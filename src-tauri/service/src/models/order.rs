use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};
use crate::{NewOrderItem,UpdateOrderItem};

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectOrders {
    pub id: String,
    pub created_at: String,
    pub client_id: String,
    pub full_name: String,
    pub status: String,
    pub identifier: String,
    pub products: i64,
    pub total: f64,
}

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectOrderDetails {
    pub id: String,
    pub created_at: String,
    pub full_name: String,
    pub identifier: String,
    pub address: Option<String>,
    pub phone_number: Option<String>,
    pub email: Option<String>,
    pub status: String,
    pub total: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewOrder {
    pub client_id: String,
    pub status: String,
    pub items: Vec<NewOrderItem>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateOrder {
    pub id: String,
    pub client_id: String,
    pub status: String,
    pub items: Vec<UpdateOrderItem>,
}
