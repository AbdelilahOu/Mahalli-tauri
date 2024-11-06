use serde_json::Value;
use tauri::State;

use service::{
    ListArgs, MutationsService, NewQuote, QueriesService, TransactionService, UpdateQuote,
};

use crate::AppState;

use super::{Fail, SResult, Seccess};

#[tauri::command]
pub async fn list_quotes(state: State<'_, AppState>, args: ListArgs) -> SResult<Value> {
    let _ = state.db_conn;
    match QueriesService::list_quotes(&state.db_conn, args).await {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => Err(Fail {
            error: Some(err.to_string()),
            message: None,
        }),
    }
}

#[tauri::command]
pub async fn list_quote_products(state: State<'_, AppState>, id: String) -> SResult<Vec<Value>> {
    let _ = state.db_conn;
    match QueriesService::list_quote_products(&state.db_conn, id).await {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => Err(Fail {
            error: Some(err.to_string()),
            message: None,
        }),
    }
}

#[tauri::command]
pub async fn create_quote(state: State<'_, AppState>, quote: NewQuote) -> SResult<String> {
    let _ = state.db_conn;
    match TransactionService::create_quote(&state.db_conn, quote).await {
        Ok(id) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(id),
        }),
        Err(err) => Err(Fail {
            error: Some(err.to_string()),
            message: None,
        }),
    }
}

#[tauri::command]
pub async fn update_quote(state: State<'_, AppState>, quote: UpdateQuote) -> SResult<()> {
    let _ = state.db_conn;
    match TransactionService::update_quote(&state.db_conn, quote).await {
        Ok(_) => Ok(Seccess {
            error: None,
            message: Option::Some(String::from("update quotes success")),
            data: None,
        }),
        Err(err) => Err(Fail {
            error: Some(err.to_string()),
            message: None,
        }),
    }
}

#[tauri::command]
pub async fn delete_quote(state: State<'_, AppState>, id: String) -> SResult<u64> {
    let _ = state.db_conn;
    match MutationsService::delete_quote(&state.db_conn, id).await {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => Err(Fail {
            error: Some(err.to_string()),
            message: None,
        }),
    }
}

#[tauri::command]
pub async fn get_quote(state: State<'_, AppState>, id: String) -> SResult<Value> {
    let _ = state.db_conn;
    match QueriesService::get_quote(&state.db_conn, id).await {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => Err(Fail {
            error: Some(err.to_string()),
            message: None,
        }),
    }
}

#[tauri::command]
pub async fn get_quote_details(state: State<'_, AppState>, id: String) -> SResult<Value> {
    let _ = state.db_conn;
    match QueriesService::get_quote_details(&state.db_conn, id).await {
        Ok(res) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(res),
        }),
        Err(err) => Err(Fail {
            error: Some(err.to_string()),
            message: None,
        }),
    }
}
