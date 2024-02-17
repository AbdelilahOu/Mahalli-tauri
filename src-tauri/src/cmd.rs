use serde::{Deserialize, Serialize};
use serde_json::Value;
use service::QueriesService;

use crate::State;
#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Seccess<T> {
    pub error: Option<String>,
    pub message: Option<String>,
    pub data: Option<T>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Error {
    pub error: Option<String>,
    pub message: Option<String>,
}

pub type SResult<T> = Result<Seccess<T>, Error>;

#[tauri::command]
pub async fn list_products(state: tauri::State<'_, State>) -> SResult<Vec<Value>> {
    let _ = state.db_conn;
    let res = QueriesService::list_products(&state.db_conn).await;
    match res {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => {
            println!("Error: {}", err);
            Err(Error {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}
