use serde::Deserialize;
use serde::Serialize;

#[derive(Debug, Deserialize, Serialize)]
pub struct ProductRecord {
    pub id: String,
    pub name: String,
    pub price: f32,
    pub description: String,
    pub image: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ClientRecord {
    pub id: String,
    pub fullname: String,
    pub phone: String,
    pub email: String,
    pub address: String,
    pub image: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SellerRecord {
    pub id: String,
    pub name: String,
    pub phone: String,
    pub email: String,
    pub address: String,
    pub image: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InvoiceRecord {
    pub id: String,
    pub status: String,
    pub created_at: String,
    pub client_id: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InvoiceItemRecord {
    pub id: String,
    pub product_id: String,
    pub invoice_id: String,
    pub quantity: i64,
    pub inventory_id: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct OrderRecord {
    pub id: String,
    pub status: String,
    pub created_at: String,
    pub seller_id: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct OrderItemRecord {
    pub id: String,
    pub product_id: String,
    pub price: Option<f32>,
    pub order_id: String,
    pub quantity: i64,
    pub inventory_id: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InventoryMouvementRecord {
    pub id: String,
    pub date: String,
    pub model: String,
    pub quantity: i64,
    pub product_id: String,
}
