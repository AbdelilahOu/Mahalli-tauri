use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectMvm {
    pub created_at: String,
    pub price: f64,
    pub quantity: f64,
    pub mvm_type: String,
}
