use super::schema::{clients, invoices, products, sellers, users};
use diesel::sql_types::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Queryable, QueryableByName, Clone, Serialize, Deserialize, AsChangeset)]
#[diesel(table_name = users)]
pub struct User {
    #[diesel(sql_type = Integer)]
    pub id: i32,
    #[diesel(sql_type = Text)]
    pub username: String,
    #[diesel(sql_type = Text)]
    pub email: String,
    #[diesel(sql_type = Text)]
    pub password: String,
    #[diesel(sql_type = Text)]
    pub role: String,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub username: String,
    pub password: String,
    pub email: String,
    pub role: String,
}

#[derive(Debug, Queryable, QueryableByName, Clone, Serialize, Deserialize, AsChangeset)]
#[diesel(table_name = clients)]
pub struct Client {
    #[diesel(sql_type = Integer)]
    pub id: i32,
    #[diesel(sql_type = Text)]
    pub fullname: String,
    #[diesel(sql_type = Text)]
    pub email: String,
    #[diesel(sql_type = Text)]
    pub image: String,
    #[diesel(sql_type = Text)]
    pub address: String,
    #[diesel(sql_type = Text)]
    pub phone: String,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = clients)]
pub struct NewClient {
    pub fullname: String,
    pub image: String,
    pub address: String,
    pub phone: String,
}

#[derive(Debug, Queryable, QueryableByName, Clone, Serialize, Deserialize, AsChangeset)]
#[diesel(table_name = sellers)]
pub struct Seller {
    #[diesel(sql_type = Integer)]
    id: i64,
    #[diesel(sql_type = Text)]
    name: String,
    #[diesel(sql_type = Text)]
    phone: String,
    #[diesel(sql_type = Text)]
    email: String,
    #[diesel(sql_type = Text)]
    address: String,
    #[diesel(sql_type = Text)]
    image: String,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = sellers)]
pub struct NewSeller {
    pub name: String,
    pub image: String,
    pub address: String,
    pub email: String,
    pub phone: String,
}

#[derive(Debug, Queryable, QueryableByName, Clone, Serialize, Deserialize, AsChangeset)]
#[diesel(table_name = products)]
pub struct Product {
    #[diesel(sql_type = Integer)]
    pub id: i32,
    #[diesel(sql_type = Text)]
    pub name: String,
    #[diesel(sql_type = Text)]
    pub image: String,
    #[diesel(sql_type = Text)]
    pub description: String,
    #[diesel(sql_type = Float)]
    pub price: f32,
    #[diesel(sql_type = Float)]
    pub tva: f32,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = products)]
pub struct NewProduct {
    pub description: String,
    pub name: String,
    pub price: f32,
    pub tva: f32,
}

#[derive(Debug, Queryable, QueryableByName, Clone, Serialize, Deserialize, AsChangeset)]
#[diesel(table_name = invoices)]
pub struct Invoice {
    #[diesel(sql_type = Integer)]
    id: i64,
    #[diesel(sql_type = Integer)]
    total: i64,
    #[diesel(sql_type = String)]
    status: String,
    #[diesel(sql_type = String)]
    created_at: String,
    #[diesel(sql_type = Integer)]
    client_id: i64,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = invoices)]
pub struct NewInvoice {
    total: i64,
    status: String,
    client_id: i64,
}
