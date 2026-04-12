namespace my.listbooks;
entity Books{
    key ID : UUID;
    title : String;
    author : String;
    price : Decimal;
    stock : Integer;
    location : String;  
    genre : String;
    orders    : Association to many Orders on orders.book = $self;
}

entity Orders {
    key ID        : UUID;
    book          : Association to Books;
    bookTitle     : String;   
    quantity      : Integer;
    orderDate     : DateTime;
    totalPrice    : Decimal;
}