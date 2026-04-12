const cds = require('@sap/cds')

module.exports = class CatalogService extends cds.ApplicationService {

    async init() {

        const { Books, Orders } = this.entities

        // Validate Books on CREATE and UPDATE
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

        // Before creating an order
        this.before('CREATE', 'Orders', async (req) => {
            const { book_ID, quantity } = req.data

            if (!quantity || quantity <= 0) {
                return req.error(400, 'Quantity must be greater than zero')
            }

            // Check if book exists and get its details
            const book = await SELECT.one.from(Books).where({ ID: book_ID })

            // If book not found
            if (!book) {
                return req.error(404, `Book with ID ${book_ID} not found`)
            }

            // If not enough stock
            if (book.stock < quantity) {
                return req.error(400, `Not enough stock! Available stock: ${book.stock}`)
            }

            // Calculate total price
            req.data.totalPrice = book.price * quantity

            // Set order date
            req.data.orderDate = new Date().toISOString()

            // Set book title
            req.data.bookTitle = book.title
        })

        // After creating an order, reduce stock
        this.after('CREATE', 'Orders', async (result, req) => {
            const { book_ID, quantity } = req.data

            // Reduce stock
            await UPDATE(Books)
                .set({ stock: { '-=': quantity } })
                .where({ ID: book_ID })
        })

        // Before deleting a book, delete its orders first
        this.before('DELETE', 'Books', async (req) => {
            const { ID } = req.data
            await DELETE.from(Orders).where({ book_ID: ID })
        })

        await super.init()
    }
}