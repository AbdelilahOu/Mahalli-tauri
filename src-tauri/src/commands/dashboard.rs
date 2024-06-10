use serde_json::Value;
use tauri::State;

use service::QueriesService;

use crate::AppState;

use super::{Fail, Seccess, SResult};

#[tauri::command]
pub async fn list_mvm_stats(state: State<'_, AppState>) -> SResult<Vec<Value>> {
    let _ = state.db_conn;
    match QueriesService::list_mvm_stats(&state.db_conn).await {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => {
            Err(Fail {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}

#[tauri::command]
pub async fn list_top_clients(state: State<'_, AppState>) -> SResult<Vec<Value>> {
    let _ = state.db_conn;
    match QueriesService::list_top_clients(&state.db_conn).await {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => {
            Err(Fail {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}

#[tauri::command]
pub async fn list_top_suppliers(state: State<'_, AppState>) -> SResult<Vec<Value>> {
    let _ = state.db_conn;
    match QueriesService::list_top_suppliers(&state.db_conn).await {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => {
            Err(Fail {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}

#[tauri::command]
pub async fn list_top_products(state: State<'_, AppState>) -> SResult<Vec<Value>> {
    let _ = state.db_conn;
    match QueriesService::list_top_products(&state.db_conn).await {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => {
            Err(Fail {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}

#[tauri::command]
pub async fn list_status_count(state: State<'_, AppState>) -> SResult<Value> {
    let _ = state.db_conn;
    match QueriesService::list_status_count(&state.db_conn).await {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => {
            Err(Fail {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}

#[tauri::command]
pub async fn list_revenue(state: State<'_, AppState>) -> SResult<Value> {
    let _ = state.db_conn;
    match QueriesService::list_revenue(&state.db_conn).await {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => {
            Err(Fail {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}

#[tauri::command]
pub async fn list_expenses(state: State<'_, AppState>) -> SResult<Value> {
    let _ = state.db_conn;
    match QueriesService::list_expenses(&state.db_conn).await {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => {
            Err(Fail {
                error: Some(err.to_string()),
                message: None,
            })
        }
    }
}
