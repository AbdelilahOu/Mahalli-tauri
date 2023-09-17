use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct TNewInventory {
    pub model: String,
    pub quantity: i64,
    pub product_id: i32,
}

#[derive(Debug, Deserialize)]
pub struct TNewOrder {
    pub status: String,
    pub seller_id: i32,
    pub order_items: Vec<TNewOrderItem>,
}
#[derive(Debug, Deserialize)]
pub struct TNewOrderItem {
    pub product_id: i32,
    pub quantity: i64,
    pub price: Option<f32>,
}

#[derive(Debug, Deserialize)]
pub struct TUpdateOrder {
    pub status: String,
    pub seller_id: i32,
    pub order_items: Vec<TUpdateOrderItem>,
}
#[derive(Debug, Deserialize)]
pub struct TUpdateOrderItem {
    pub id: Option<i32>,
    pub product_id: i32,
    pub price: Option<f32>,
    pub order_id: Option<i32>,
    pub inventory_id: Option<i32>,
    pub quantity: i64,
}

#[derive(Debug, Deserialize)]
pub struct TNewInvoice {
    pub status: String,
    pub client_id: i32,
    pub invoice_items: Vec<TNewInvoiceItem>,
}
#[derive(Debug, Deserialize)]
pub struct TNewInvoiceItem {
    pub product_id: i32,
    pub quantity: i64,
}

#[derive(Debug, Deserialize)]
pub struct TUpdateInvoice {
    pub status: String,
    pub client_id: i32,
    pub invoice_items: Vec<TUpdateInvoiceItem>,
}
#[derive(Debug, Deserialize)]
pub struct TUpdateInvoiceItem {
    pub id: Option<i32>,
    pub product_id: i32,
    pub invoice_id: Option<i32>,
    pub quantity: i64,
    pub inventory_id: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct TNewProduct {
    pub description: String,
    pub name: String,
    pub price: f32,
    pub tva: f32,
    pub quantity: i64,
    pub image: String,
}
