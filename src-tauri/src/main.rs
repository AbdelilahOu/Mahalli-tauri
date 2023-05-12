#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
async fn command_name(csv_path: String) -> Result<Vec<csv::StringRecord>, String> {
    let rdr = csv::Reader::from_path(csv_path);
    if let Some(mut Result) = rdr.ok() {
        Ok(Result.records().map(|r| r.unwrap()).collect())
    } else {
        Err("sth went wtring".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![command_name])
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
