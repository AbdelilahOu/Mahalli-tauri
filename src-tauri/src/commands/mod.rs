use serde::{Deserialize, Serialize};

pub mod clients;
pub mod inventory;
pub mod products;
pub mod sellers;

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