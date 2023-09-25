use super::schema::*;
use diesel::sql_types::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Queryable, QueryableByName, Clone, Serialize, Deserialize, AsChangeset)]
#[diesel(table_name = users)]
pub struct User {
    #[diesel(sql_type = Text)]
    pub id: String,
    #[diesel(sql_type = Text)]
    pub username: String,
    #[diesel(sql_type = Text)]
    pub password: String,
    #[diesel(sql_type = Text)]
    pub email: String,
    #[diesel(sql_type = Text)]
    pub role: String,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub id: String,
    pub username: String,
    pub password: String,
    pub email: String,
    pub role: String,
}

#[derive(Debug, Queryable, QueryableByName, Clone, Serialize, Deserialize, AsChangeset)]
#[diesel(table_name = clients)]
pub struct Client {
    #[diesel(sql_type = Text)]
    pub id: String,
    #[diesel(sql_type = Text)]
    pub fullname: String,
    #[diesel(sql_type = Text)]
    pub phone: String,
    #[diesel(sql_type = Text)]
    pub created_at: String,
    #[diesel(sql_type = Text)]
    pub email: String,
    #[diesel(sql_type = Text)]
    pub address: String,
    #[diesel(sql_type = Text)]
    pub image: String,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = clients)]
pub struct NewClient {
    pub id: String,
    pub fullname: String,
    pub email: String,
    pub phone: String,
    pub address: String,
    pub image: String,
}

#[derive(Debug, Queryable, Clone, QueryableByName, Serialize, Deserialize, AsChangeset)]
#[diesel(table_name = sellers)]
pub struct Seller {
    #[diesel(sql_type = Text)]
    pub id: String,
    #[diesel(sql_type = Text)]
    pub name: String,
    #[diesel(sql_type = Text)]
    pub phone: String,
    #[diesel(sql_type = Text)]
    pub created_at: String,
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
    pub id: String,

    pub name: String,
    pub image: String,
    pub address: String,
    pub email: String,
    pub phone: String,
}

#[derive(Debug, Queryable, QueryableByName, Clone, Serialize, Deserialize, AsChangeset)]
#[diesel(table_name = products)]
pub struct Product {
    #[diesel(sql_type = Text)]
    pub id: String,
    #[diesel(sql_type = Text)]
    pub name: String,
    #[diesel(sql_type = Text)]
    pub image: String,
    #[diesel(sql_type = Text)]
    pub description: String,
    #[diesel(sql_type = Text)]
    pub created_at: String,
    #[diesel(sql_type = Float)]
    pub price: f32,
    #[diesel(sql_type = Float)]
    pub tva: f32,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = products)]
pub struct NewProduct {
    pub id: String,

    pub description: String,
    pub name: String,
    pub price: f32,
    pub tva: f32,
    pub image: String,
}

#[derive(Debug, Queryable, Deserialize, Selectable, Serialize, Associations, QueryableByName)]
#[diesel(table_name = invoices, belongs_to(Client, foreign_key = client_id))]
pub struct Invoice {
    #[diesel(sql_type = Text)]
    pub id: String,
    #[diesel(sql_type = Text)]
    pub status: String,
    #[diesel(sql_type = Text)]
    pub created_at: String,
    #[diesel(sql_type = Text)]
    pub client_id: String,
}

#[derive(Debug, Deserialize, AsChangeset, Serialize)]
#[diesel(table_name = invoices)]
pub struct UpdateInvoice {
    #[diesel(sql_type = Text)]
    pub status: String,
}
#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = invoices)]
pub struct NewInvoice {
    pub id: String,

    pub status: String,
    pub client_id: String,
}

#[derive(
    Debug, Queryable, QueryableByName, Clone, AsChangeset, Serialize, Deserialize, Associations,
)]
#[diesel(table_name = invoice_items, belongs_to(Product, foreign_key = product_id),belongs_to(Invoice, foreign_key = invoice_id),belongs_to(InventoryMvm, foreign_key = inventory_id))]
pub struct InvoiceItem {
    #[diesel(sql_type = Text)]
    pub id: String,
    #[diesel(sql_type = Text)]
    pub product_id: String,
    #[diesel(sql_type = Text)]
    pub invoice_id: String,
    #[diesel(sql_type = Integer)]
    pub quantity: i64,
    #[diesel(sql_type = Text)]
    pub inventory_id: String,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = invoice_items)]
pub struct UpdateInvoiceItem {
    #[diesel(sql_type = Integer)]
    pub quantity: i64,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = invoice_items)]
pub struct NewInvoiceItem {
    pub id: String,
    pub product_id: String,
    pub invoice_id: String,
    pub quantity: i64,
    pub inventory_id: String,
}

#[derive(
    Debug, Queryable, Clone, Deserialize, Selectable, Serialize, Associations, QueryableByName,
)]
#[diesel(table_name = orders, belongs_to(Seller, foreign_key = seller_id))]
pub struct Order {
    #[diesel(sql_type = Text)]
    pub id: String,
    #[diesel(sql_type = Text)]
    pub status: String,
    #[diesel(sql_type = Text)]
    pub created_at: String,
    #[diesel(sql_type = Text)]
    pub seller_id: String,
}

#[derive(Debug, AsChangeset, Clone, Serialize)]
#[diesel(table_name = orders)]
pub struct UpdateOrder {
    #[diesel(sql_type = Text)]
    pub status: String,
}
#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = orders)]
pub struct NewOrder {
    pub id: String,
    pub status: String,
    pub seller_id: String,
}

#[derive(
    Debug, Queryable, QueryableByName, Clone, AsChangeset, Serialize, Deserialize, Associations,
)]
#[diesel(table_name = order_items, belongs_to(Product, foreign_key = product_id),belongs_to(Order, foreign_key = order_id),belongs_to(InventoryMvm, foreign_key = inventory_id))]
pub struct OrderItem {
    #[diesel(sql_type = Text)]
    pub id: String,
    #[diesel(sql_type = Text)]
    pub product_id: String,
    #[diesel(sql_type = Nullable<Float>)]
    pub price: Option<f32>,
    #[diesel(sql_type = Text)]
    pub order_id: String,
    #[diesel(sql_type = Text)]
    pub inventory_id: String,
    #[diesel(sql_type = BigInt)]
    pub quantity: i64,
}

#[derive(Debug, Clone, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = order_items)]
pub struct UpdateOrderItem {
    #[diesel(sql_type = Nullable<Float>)]
    pub price: Option<f32>,
    #[diesel(sql_type = BigInt)]
    pub quantity: i64,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = order_items)]
pub struct NewOrderItem {
    pub id: String,
    pub product_id: String,
    pub order_id: String,
    pub quantity: i64,
    pub price: Option<f32>,
    pub inventory_id: String,
}

#[derive(Debug, Queryable, QueryableByName, Clone, Serialize, Deserialize, Associations)]
#[diesel(table_name = inventory_mouvements, belongs_to(Product, foreign_key = product_id))]
pub struct InventoryMvm {
    #[diesel(sql_type = Text)]
    pub id: String,
    #[diesel(sql_type = Text)]
    pub date: String,
    #[diesel(sql_type = Text)]
    pub model: String,
    #[diesel(sql_type = Float)]
    pub quantity: i64,
    #[diesel(sql_type = Text)]
    pub created_at: String,
    #[diesel(sql_type = Text)]
    pub product_id: String,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = inventory_mouvements)]
pub struct UpdateInventoryMvm {
    #[diesel(sql_type = Integer)]
    pub quantity: i64,
}

#[derive(Debug, Insertable, Clone, Serialize, Deserialize)]
#[diesel(table_name = inventory_mouvements)]
pub struct NewInventoryMvm {
    pub id: String,
    pub model: String,
    pub quantity: i64,
    pub product_id: String,
}

#[derive(QueryableByName, Queryable, Deserialize, Serialize)]
pub struct ProductWithQuantity {
    #[diesel(sql_type = Text)]
    pub id: String,
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
