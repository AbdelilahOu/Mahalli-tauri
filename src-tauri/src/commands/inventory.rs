use service::{Inventory, MutationsService, NewInventory};
use tauri::State;

use crate::{commands::Fail, AppState};

use super::{SResult, Seccess};

#[tauri::command]
pub async fn create_inventory(state: State<'_, AppState>, mvm: NewInventory) -> SResult<String> {
    let _ = state.db_conn;
    let res = MutationsService::create_inv_mvm(&state.db_conn, mvm).await;
    match res {
        Ok(id) => Ok(Seccess::<String> {
            error: None,
            message: Option::Some(String::from("inventory created successfully")),
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
pub async fn delete_inventory(state: State<'_, AppState>, id: String) -> SResult<String> {
    let _ = state.db_conn;
    let res = MutationsService::delete_inv_mvm(&state.db_conn, id).await;
    match res {
        Ok(_) => Ok(Seccess::<String> {
            error: None,
            message: Option::Some(String::from("inventory deleted successfully")),
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

#[tauri::command]
pub async fn update_inventory(state: State<'_, AppState>, mvm: Inventory) -> SResult<String> {
    let _ = state.db_conn;
    let res = MutationsService::update_inv_mvm(&state.db_conn, mvm).await;
    match res {
        Ok(_) => Ok(Seccess::<String> {
            error: None,
            message: Option::Some(String::from("inventory updated successfully")),
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
