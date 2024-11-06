use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectSuppliers {
    pub id: String,
    pub full_name: String,
    pub address: Option<String>,
    pub phone_number: Option<String>,
    pub email: Option<String>,
    pub image: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewSupplier {
    pub full_name: String,
    pub address: Option<String>,
    pub phone_number: Option<String>,
    pub email: Option<String>,
    pub image: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Supplier {
    pub id: String,
    pub full_name: String,
    pub address: Option<String>,
    pub phone_number: Option<String>,
    pub email: Option<String>,
    pub image: Option<String>,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSupplier {
    pub id: String,
    pub full_name: Option<String>,
    pub address: Option<String>,
    pub phone_number: Option<String>,
    pub email: Option<String>,
    pub image: Option<String>,
}