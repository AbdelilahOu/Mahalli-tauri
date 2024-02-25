use service::{MutationsService, NewOrderItem};
use tauri::State;

use crate::AppState;

use super::{Fail, SResult, Seccess};

#[tauri::command]
pub async fn create_order_item(state: State<'_, AppState>, item: NewOrderItem) -> SResult<String> {
    let _ = state.db_conn;
    let res = MutationsService::create_order_item(&state.db_conn, item).await;
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
