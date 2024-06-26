use serde::{Deserialize, Serialize};

pub mod clients;
pub mod dashboard;
pub mod inventory;
pub mod invoices;
pub mod orders;
pub mod products;
pub mod quote_items;
pub mod quotes;
pub mod suppliers;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Seccess<T> {
    pub error: Option<String>,
    pub message: Option<String>,
    pub data: Option<T>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Fail {
    pub error: Option<String>,
    pub message: Option<String>,
}

pub type SResult<T> = Result<Seccess<T>, Fail>;
