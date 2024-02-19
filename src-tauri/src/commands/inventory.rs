use service::{MutationsService, NewInventory};
use tauri::State;

use crate::{commands::Fail, AppState};

use super::{SResult, Seccess};

#[tauri::command]
pub async fn create_inventory(state: State<'_, AppState>, mvm: NewInventory) -> SResult<String> {
    let _ = state.db_conn;
    let res = MutationsService::create_inv_mvm(&state.db_conn, mvm).await;
    match res {
        Ok(_) => Ok(Seccess::<String> {
            error: None,
            message: Option::Some(String::from("inventory created successfully")),
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
