#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[macro_use]
extern crate diesel;
extern crate diesel_migrations;
extern crate dotenv;

// modes
mod cmd;
mod csvparsing;
mod db;
mod models;
mod reposotories;
mod schema;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            cmd::export_db_csv,
            cmd::get_csv_records,
            cmd::get_product,
            cmd::get_products,
            cmd::create_product,
            cmd::update_product,
            cmd::delete_product,
            cmd::get_client,
            cmd::get_clients,
            cmd::create_client,
            cmd::update_client,
            cmd::delete_client
        ])
        .plugin(tauri_plugin_oauth::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
