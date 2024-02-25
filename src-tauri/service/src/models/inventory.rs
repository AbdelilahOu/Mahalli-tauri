use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct NewInventory {
    pub mvm_type: String,
    pub product_id: String,
    pub quantity: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Inventory {
    pub id: String,
    pub mvm_type: String,
    pub product_id: String,
    pub quantity: f64,
}
