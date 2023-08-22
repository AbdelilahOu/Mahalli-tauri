use serde::Deserialize;

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
pub struct TNewInvoice {
    pub status: String,
    pub client_id: i32,
    pub invoice_items: Vec<TNewInvoiceItem>,
}
#[derive(Debug, Deserialize)]
pub struct TNewInvoiceItem {
    pub product_id: i32,
    pub invoice_id: i32,
    pub quantity: i64,
}
