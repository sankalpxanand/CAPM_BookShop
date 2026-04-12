using my.listbooks as my from '../db/schema';

service CatalogService {
    entity Books   as projection on my.Books;
    entity Orders  as projection on my.Orders;
    entity Admin   as projection on my.Admin;
    entity Users   as projection on my.Users;

    // Custom actions
    action adminLogin(email: String, password: String) returns {
        ID: UUID;
        name: String;
        email: String;
        phone: String;
    };

    action userLogin(email: String, password: String) returns {
        ID: UUID;
        name: String;
        email: String;
        phone: String;
    };

    action userSignup(name: String, phone: String, email: String, password: String) returns {
        ID: UUID;
        name: String;
        email: String;
        phone: String;
    };
}
