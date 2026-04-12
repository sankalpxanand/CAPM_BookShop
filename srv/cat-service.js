const cds = require('@sap/cds')
const bcrypt = require('bcryptjs')

module.exports = class CatalogService extends cds.ApplicationService {

    async init() {

        const { Books, Orders, Admin, Users } = this.entities

        // =====================
        // BOOKS VALIDATIONS
        // =====================
        this.before(['CREATE', 'UPDATE'], 'Books', (req) => {
            const { title, price, stock } = req.data

            if (title !== undefined && !title.trim()) {
                return req.error(400, 'Title cannot be empty')
            }
            if (price !== undefined && price <= 0) {
                return req.error(400, 'Price must be greater than zero')
            }
            if (stock !== undefined && stock < 0) {
                return req.error(400, 'Stock cannot be negative')
            }
        })

        // =====================
        // ORDERS VALIDATIONS
        // =====================
        this.before('CREATE', 'Orders', async (req) => {
            const { book_ID, quantity, user_ID } = req.data

            if (!quantity || quantity <= 0) {
                return req.error(400, 'Quantity must be greater than zero')
            }

            if (!user_ID) {
                return req.error(400, 'User ID is required')
            }

            const book = await SELECT.one.from(Books).where({ ID: book_ID })

            if (!book) {
                return req.error(404, `Book with ID ${book_ID} not found`)
            }
            if (book.stock < quantity) {
                return req.error(400, `Not enough stock! Available stock: ${book.stock}`)
            }

            const user = await SELECT.one.from(Users).where({ ID: user_ID })

            if (!user) {
                return req.error(404, `User not found`)
            }

            req.data.totalPrice = book.price * quantity
            req.data.orderDate = new Date().toISOString()
            req.data.bookTitle = book.title
            req.data.userName = user.name
        })

        this.after('CREATE', 'Orders', async (result, req) => {
            const { book_ID, quantity } = req.data
            await UPDATE(Books)
                .set({ stock: { '-=': quantity } })
                .where({ ID: book_ID })
        })

        this.before('DELETE', 'Books', async (req) => {
            const { ID } = req.data
            await DELETE.from(Orders).where({ book_ID: ID })
        })

        // =====================
        // ADMIN LOGIN
        // =====================
        this.on('adminLogin', async (req) => {
            const { email, password } = req.data

            if (!email || !password) {
                return req.error(400, 'Email and password are required')
            }

            const admin = await SELECT.one.from(Admin).where({ email: email })

            if (!admin) {
                return req.error(401, 'Invalid email or password')
            }

            const isMatch = await bcrypt.compare(password, admin.password)
            if (!isMatch) {
                return req.error(401, 'Invalid email or password')
            }

            return {
                ID: admin.ID,
                name: admin.name,
                email: admin.email,
                phone: admin.phone
            }
        })

        // =====================
        // USER LOGIN
        // =====================
        this.on('userLogin', async (req) => {
            const { email, password } = req.data

            if (!email || !password) {
                return req.error(400, 'Email and password are required')
            }

            const user = await SELECT.one.from(Users).where({ email: email })

            if (!user) {
                return req.error(401, 'Invalid email or password')
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return req.error(401, 'Invalid email or password')
            }

            return {
                ID: user.ID,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        })

        // =====================
        // USER SIGNUP
        // =====================
        this.on('userSignup', async (req) => {
            const { name, phone, email, password } = req.data

            if (!name || !email || !password || !phone) {
                return req.error(400, 'All fields are required')
            }

            // Check if email already exists
            const existing = await SELECT.one.from(Users).where({ email: email })
            if (existing) {
                return req.error(409, 'Email already exists. Please login instead.')
            }

            // Get admin ID (only one admin)
            const admin = await SELECT.one.from(Admin)
            if (!admin) {
                return req.error(500, 'No admin found')
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10)

            // Create user
            const newUser = {
                ID: cds.utils.uuid(),
                name: name,
                phone: phone,
                email: email,
                password: hashedPassword,
                admin_ID: admin.ID
            }

            await INSERT.into(Users).entries(newUser)

            return {
                ID: newUser.ID,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone
            }
        })

        await super.init()
    }
}