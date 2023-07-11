#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
// modes
mod csvparsing;
use crate::csvparsing::{export::*, import::*};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_csv_records, export_db_csv])
        .plugin(tauri_plugin_oauth::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
