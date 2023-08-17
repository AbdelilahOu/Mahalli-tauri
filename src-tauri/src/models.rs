use super::schema::{
    clients, inventory_mouvements, invoice_items, invoices, order_items, orders, products, sellers,
    users,
};
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

#[derive(Debug, Queryable, Clone, QueryableByName, Serialize, Deserialize, AsChangeset)]
#[diesel(table_name = sellers)]
pub struct Seller {
    #[diesel(sql_type = Integer)]
    pub id: i32,
    #[diesel(sql_type = Text)]
    pub name: String,
    #[diesel(sql_type = Text)]
    pub phone: String,
    #[diesel(sql_type = Text)]
    pub email: String,
    #[diesel(sql_type = Text)]
    pub address: String,
    #[diesel(sql_type = Text)]
    pub image: String,
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

#[derive(Debug, Queryable, Deserialize, Selectable, Serialize, Associations, QueryableByName)]
#[diesel(table_name = invoices, belongs_to(Client, foreign_key = client_id))]
pub struct Invoice {
    #[diesel(sql_type = Integer)]
    pub id: i32,
    #[diesel(sql_type = Float)]
    pub total: f32,
    #[diesel(sql_type = Text)]
    pub status: String,
    #[diesel(sql_type = Text)]
    pub created_at: String,
    #[diesel(sql_type = Integer)]
    pub client_id: i32,
}
#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = invoices)]
pub struct NewInvoice {
    pub total: f32,
    pub status: String,
    pub client_id: i32,
}

#[derive(
    Debug, Queryable, QueryableByName, Clone, AsChangeset, Serialize, Deserialize, Associations,
)]
#[diesel(table_name = invoice_items, belongs_to(Product, foreign_key = product_id),belongs_to(Invoice, foreign_key = invoice_id),belongs_to(InventoryMvm, foreign_key = inventory_id))]
pub struct InvoiceItem {
    #[diesel(sql_type = Integer)]
    pub id: i32,
    #[diesel(sql_type = Integer)]
    pub product_id: i32,
    #[diesel(sql_type = Integer)]
    pub invoice_id: i32,
    #[diesel(sql_type = Integer)]
    pub quantity: i64,
    #[diesel(sql_type = Integer)]
    pub inventory_id: i32,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = invoice_items)]
pub struct NewInvoiceItem {
    pub product_id: i32,
    pub invoice_id: i32,
    pub quantity: i64,
    pub inventory_id: i32,
}

#[derive(
    Debug, Queryable, Clone, Deserialize, Selectable, Serialize, Associations, QueryableByName,
)]
#[diesel(table_name = orders, belongs_to(Seller, foreign_key = seller_id))]
pub struct Order {
    #[diesel(sql_type = Integer)]
    pub id: i32,
    #[diesel(sql_type = Text)]
    pub status: String,
    #[diesel(sql_type = Text)]
    pub created_at: String,
    #[diesel(sql_type = Integer)]
    pub seller_id: i32,
}
#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = orders)]
pub struct NewOrder {
    pub status: String,
    pub seller_id: i32,
}

#[derive(
    Debug, Queryable, QueryableByName, Clone, AsChangeset, Serialize, Deserialize, Associations,
)]
#[diesel(table_name = order_items, belongs_to(Product, foreign_key = product_id),belongs_to(Order, foreign_key = order_id),belongs_to(InventoryMvm, foreign_key = inventory_id))]
pub struct OrderItem {
    #[diesel(sql_type = Integer)]
    pub id: i32,
    #[diesel(sql_type = Integer)]
    pub product_id: i32,
    #[diesel(sql_type = Nullable<Float>)]
    pub price: Option<f32>,
    #[diesel(sql_type = Integer)]
    pub order_id: i32,
    #[diesel(sql_type = Integer)]
    pub inventory_id: i32,
    #[diesel(sql_type = BigInt)]
    pub quantity: i64,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = order_items)]
pub struct NewOrderItem {
    pub product_id: i32,
    pub order_id: i32,
    pub quantity: i64,
    pub price: Option<f32>,
    pub inventory_id: i32,
}

#[derive(Debug, Queryable, QueryableByName, Clone, Serialize, Deserialize, Associations)]
#[diesel(table_name = inventory_mouvements, belongs_to(Product, foreign_key = product_id))]
pub struct InventoryMvm {
    #[diesel(sql_type = Integer)]
    pub id: i32,
    #[diesel(sql_type = Text)]
    pub date: String,
    #[diesel(sql_type = Text)]
    pub model: String,
    #[diesel(sql_type = Float)]
    pub quantity: i64,
    #[diesel(sql_type = Integer)]
    pub product_id: i32,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = inventory_mouvements)]
pub struct NewInventoryMvm {
    pub date: String,
    pub model: String,
    pub quantity: i64,
    pub product_id: i32,
}

pub struct B3Clients {
    pub name: String,
    pub amount: i64,
}

pub struct B3Sellers {
    pub name: String,
    pub amount: i64,
}

pub struct CDExpenses {
    pub day: String,
    pub expense: i64,
}

pub struct SDexpenses {
    pub day: String,
    pub expense: i64,
}

#[derive(QueryableByName, Queryable, Deserialize, Serialize)]
pub struct ProductWithQuantity {
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
    #[diesel(sql_type = BigInt)]
    pub quantity: i64,
}

#[derive()]
pub struct ClientDetails {}
