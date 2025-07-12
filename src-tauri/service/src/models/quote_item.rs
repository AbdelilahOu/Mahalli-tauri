use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectQuotesItemsForUpdate {
    pub id: String,
    pub name: String,
    pub price: f64,
    pub quantity: f64,
    pub product_id: String,
}

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectQuotesItems {
    pub name: String,
    pub price: f64,
    pub quantity: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewQuoteItem {
    pub price: f64,
    pub quantity: f64,
    pub product_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateQuoteItem {
    pub id: Option<String>,
    pub price: f64,
    pub quantity: f64,
    pub product_id: String,
}
