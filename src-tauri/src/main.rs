#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::Mutex;

use db::establish_connection;
use diesel::SqliteConnection;

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
// :::::::::::::

struct AppState {
    db_conn: Mutex<SqliteConnection>,
}

fn main() {
    let state = AppState {
        db_conn: establish_connection().into(),
    };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            cmd::export_db_csv,
            cmd::get_csv_records,
            cmd::get_product,
            cmd::get_products,
            cmd::insert_product,
            cmd::update_product,
            cmd::delete_product,
            cmd::get_client,
            cmd::get_clients,
            cmd::insert_client,
            cmd::update_client,
            cmd::delete_client,
            cmd::get_user,
            cmd::insert_user,
            cmd::update_user,
            cmd::delete_user,
            cmd::seed_db,
        ])
        .setup(|_app| {
            db::migrate_db();
            Ok(())
        })
        .plugin(tauri_plugin_oauth::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
