use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectClients {
    pub id: String,
    pub fullname: String,
    pub created_at: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub price: Option<f64>,
    pub stock: f64,
    pub min_quantity: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewClient {
    pub name: String,
    pub description: Option<String>,
    pub price: f64,
    pub min_quantity: f64,
    pub image: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Client {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub price: f64,
    pub min_quantity: f64,
    pub image: Option<String>,
}
