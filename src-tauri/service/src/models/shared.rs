use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct UpdateStatus {
    pub id: String,
    pub status: String,
}
