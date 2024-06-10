use service::{MutationsService};
use tauri::State;

use crate::AppState;

use super::{Fail, SResult, Seccess};

#[tauri::command]
pub async fn delete_quote_item(state: State<'_, AppState>, id: String) -> SResult<u64> {
    let _ = state.db_conn;
    let res = MutationsService::delete_quote_item(&state.db_conn, id).await;
    match res {
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
