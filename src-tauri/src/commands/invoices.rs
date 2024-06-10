use serde_json::Value;
use tauri::State;

use service::{ListArgs, MutationsService, NewInvoice, QueriesService, TransactionService, UpdateInvoice};

use crate::AppState;

use super::{Fail, Seccess, SResult};

#[tauri::command]
pub async fn create_invoice_from_order(state: State<'_, AppState>, id: String) -> SResult<String> {
    let _ = state.db_conn;
    match TransactionService::create_invoice_from_order(&state.db_conn, id).await {
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
pub async fn list_invoices(state: State<'_, AppState>, args: ListArgs) -> SResult<Value> {
    let _ = state.db_conn;
    match QueriesService::list_invoices(&state.db_conn, args).await {
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
pub async fn list_invoice_products(state: State<'_, AppState>, id: String) -> SResult<Vec<Value>> {
    let _ = state.db_conn;
    match QueriesService::list_invoice_products(&state.db_conn, id).await {
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
pub async fn create_invoice(state: State<'_, AppState>, invoice: NewInvoice) -> SResult<String> {
    let _ = state.db_conn;
    match TransactionService::create_invoice(&state.db_conn, invoice).await {
        Ok(id) => Ok(Seccess {
            error: None,
            message: None,
            data: Some(id),
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
pub async fn update_invoice(state: State<'_, AppState>, invoice: UpdateInvoice) -> SResult<()> {
    let _ = state.db_conn;
    match TransactionService::update_invoice(&state.db_conn, invoice).await {
        Ok(_) => Ok(Seccess {
            error: None,
            message: Option::Some(String::from("update invoices success")),
            data: None,
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
pub async fn delete_invoice(state: State<'_, AppState>, id: String) -> SResult<u64> {
    let _ = state.db_conn;
    match MutationsService::delete_invoice(&state.db_conn, id).await {
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
pub async fn get_invoice(state: State<'_, AppState>, id: String) -> SResult<Value> {
    let _ = state.db_conn;
    match QueriesService::get_invoice(&state.db_conn, id).await {
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
pub async fn get_invoice_details(state: State<'_, AppState>, id: String) -> SResult<Value> {
    let _ = state.db_conn;
    match QueriesService::get_invoice_details(&state.db_conn, id).await {
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
