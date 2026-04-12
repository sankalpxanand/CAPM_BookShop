namespace my.listbooks;

entity Admin {
    key ID       : UUID;
    name         : String;
    email        : String;
    phone        : String;
    password     : String;
}

entity Users {
    key ID       : UUID;
    name         : String;
    phone        : String;
    email        : String;
    password     : String;
    admin        : Association to Admin;
}

entity Books {
    key ID       : UUID;
    title        : String;
    author       : String;
    price        : Decimal;
    stock        : Integer;
    location     : String;
    genre        : String;
    orders       : Association to many Orders on orders.book = $self;
}

entity Orders {
    key ID        : UUID;
    book          : Association to Books;
    user          : Association to Users;
    bookTitle     : String;
    quantity      : Integer;
    orderDate     : DateTime;
    totalPrice    : Decimal;
}