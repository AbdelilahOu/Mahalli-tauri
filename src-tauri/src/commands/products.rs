use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use service::{MutationsService, NewProduct, Product, QueriesService};
use tauri::State;

use crate::AppState;
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

#[tauri::command]
pub async fn list_products(state: State<'_, AppState>) -> SResult<Vec<Value>> {
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
            Err(Fail {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}

#[tauri::command]
pub async fn search_products(state: State<'_, AppState>, search: String) -> SResult<Vec<Value>> {
    let _ = state.db_conn;
    let res = QueriesService::search_products(&state.db_conn, search).await;
    match res {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => {
            println!("Error: {}", err);
            Err(Fail {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}

#[tauri::command]
pub async fn create_product(state: State<'_, AppState>, product: NewProduct) -> SResult<Value> {
    let _ = state.db_conn;
    let res = MutationsService::create_product(&state.db_conn, product).await;
    match res {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(json!({
                "id": res.id,
                "name": res.name,
                "price": res.price,
                "description": res.description,
                "image": res.image,
                "createdAt": res.created_at,
                "minQuantity": res.min_quantity,
            })),
        }),
        Err(err) => {
            println!("Error: {}", err);
            Err(Fail {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}

#[tauri::command]
pub async fn delete_product(state: State<'_, AppState>, id: String) -> SResult<u64> {
    let _ = state.db_conn;
    let res = MutationsService::delete_product(&state.db_conn, id).await;
    match res {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => {
            println!("Error: {}", err);
            Err(Fail {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}

#[tauri::command]
pub async fn update_product(state: State<'_, AppState>, product: Product) -> SResult<String> {
    let _ = state.db_conn;
    let res = MutationsService::update_product(&state.db_conn, product).await;
    match res {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => {
            println!("Error: {}", err);
            Err(Fail {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}
