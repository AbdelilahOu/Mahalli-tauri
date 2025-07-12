use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectProducts {
    pub id: String,
    pub name: String,
    pub created_at: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub selling_price: Option<f64>,
    pub purchase_price: Option<f64>,
    pub inventory: f64,
    pub min_quantity: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewProduct {
    pub name: String,
    pub description: Option<String>,
    pub selling_price: f64,
    pub purchase_price: f64,
    pub min_quantity: f64,
    pub image: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub selling_price: f64,
    pub purchase_price: f64,
    pub min_quantity: f64,
    pub image: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateProduct {
    pub id: String,
    pub name: Option<String>,
    pub description: Option<String>,
    pub selling_price: Option<f64>,
    pub purchase_price: Option<f64>,
    pub min_quantity: Option<f64>,
    pub image: Option<String>,
}
