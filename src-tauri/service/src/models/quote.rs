use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};
use crate::{NewQuoteItem,UpdateQuoteItem};

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectQuotes {
    pub id: String,
    pub created_at: String,
    pub client_id: String,
    pub full_name: String,
    pub products: i64,
    pub total: f64,
}

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectQuoteDetails {
    pub id: String,
    pub created_at: String,
    pub full_name: String,
    pub address: Option<String>,
    pub phone_number: Option<String>,
    pub email: Option<String>,
    pub total: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewQuote {
    pub client_id: String,
    pub items: Vec<NewQuoteItem>,
}



#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateQuote {
    pub id: String,
    pub client_id: String,
    pub items: Vec<UpdateQuoteItem>,
}
