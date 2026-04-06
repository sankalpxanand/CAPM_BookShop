using my.listbooks as my from '../db/schema';
service CatalogService {
    entity Books as projection on my.Books;
    entity Orders as projection on my.Orders;
}