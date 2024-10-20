use serde::{Deserialize, Serialize};


#[derive(Debug, Serialize, Deserialize)]
pub struct NewTemplate {
    pub values_json: String,
}