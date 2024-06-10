use service::{MutationsService};
use tauri::State;

use crate::AppState;

use super::{Fail, SResult, Seccess};

#[tauri::command]
pub async fn delete_order_item(state: State<'_, AppState>, id: String) -> SResult<u64> {
    let _ = state.db_conn;
    match MutationsService::delete_order_item(&state.db_conn, id).await {
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
