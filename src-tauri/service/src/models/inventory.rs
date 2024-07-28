use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectInventory {
    pub id: String,
    pub name: String,
    pub created_at: String,
    pub price: f64,
    pub quantity: f64,
    pub transaction_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewInventory {
    pub transaction_type: String,
    pub product_id: String,
    pub quantity: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Inventory {
    pub id: String,
    pub transaction_type: String,
    pub product_id: String,
    pub quantity: f64,
}
