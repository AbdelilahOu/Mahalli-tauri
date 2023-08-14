use serde::Deserialize;
use serde::Serialize;

#[derive(Debug, Deserialize, Serialize)]
pub struct ProductRecord {
    id: i64,
    pub name: String,
    pub price: f32,
    pub tva: f32,
    pub description: String,
    // pub inventory: i64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ClientRecord {
    id: i64,
    pub name: String,
    pub phone: String,
    pub email: String,
    pub address: String,
    pub image: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SellerRecord {
    id: i64,
    pub name: String,
    pub phone: String,
    pub email: String,
    pub address: String,
    pub image: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InvoiceRecord {
    id: i64,
    pub total: f32,
    pub status: String,
    pub created_at: String,
    pub client_id: i32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InvoiceItemRecord {
    id: i32,
    pub product_id: i32,
    pub invoice_id: i32,
    pub quantity: i64,
    pub inventory_id: i32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct OrderRecord {
    id: i32,
    pub status: String,
    pub created_at: String,
    pub seller_id: i32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct OrderItemRecord {
    id: i32,
    pub product_id: i32,
    pub price: Option<f32>,
    pub order_id: i32,
    pub quantity: i64,
    pub inventory_id: i32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InventoryMouvementRecord {
    id: i32,
    pub date: String,
    pub model: String,
    pub quantity: i64,
    pub product_id: i32,
}
