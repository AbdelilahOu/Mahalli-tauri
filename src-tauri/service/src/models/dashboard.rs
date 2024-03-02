use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectMvm {
    pub created_at: String,
    pub price: f64,
    pub quantity: f64,
    pub mvm_type: String,
}

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectTops {
    pub full_name: String,
    pub price: f64,
    pub quantity: f64,
}

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectStatusCount {
    pub status: String,
    pub status_count: i64,
}
