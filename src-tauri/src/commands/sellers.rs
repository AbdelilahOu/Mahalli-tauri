use serde_json::Value;
use service::{ListArgs, MutationsService, NewSeller, QueriesService, Seller};
use tauri::State;

use crate::AppState;

use super::{Fail, SResult, Seccess};

#[tauri::command]
pub async fn list_sellers(state: State<'_, AppState>, args: ListArgs) -> SResult<Value> {
    let _ = state.db_conn;
    let res = QueriesService::list_sellers(&state.db_conn, args).await;
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
pub async fn search_sellers(state: State<'_, AppState>, search: String) -> SResult<Vec<Value>> {
    let _ = state.db_conn;
    let res = QueriesService::search_sellers(&state.db_conn, search).await;
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
pub async fn create_seller(state: State<'_, AppState>, seller: NewSeller) -> SResult<String> {
    let _ = state.db_conn;
    let res = MutationsService::create_seller(&state.db_conn, seller).await;
    match res {
        Ok(id) => Ok(Seccess::<String> {
            error: None,
            message: Option::Some(String::from("seller created successfully")),
            data: Some(id),
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
pub async fn delete_seller(state: State<'_, AppState>, id: String) -> SResult<u64> {
    let _ = state.db_conn;
    let res = MutationsService::delete_seller(&state.db_conn, id).await;
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
pub async fn update_seller(state: State<'_, AppState>, seller: Seller) -> SResult<String> {
    let _ = state.db_conn;
    let res = MutationsService::update_seller(&state.db_conn, seller).await;
    match res {
        Ok(_) => Ok(Seccess::<String> {
            error: None,
            message: Option::Some(String::from("update sellers success")),
            data: None,
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
