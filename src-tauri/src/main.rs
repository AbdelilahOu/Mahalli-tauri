#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod cmd;
mod db;

use db::establish_connection;
use migration::{Migrator, MigratorTrait};
use service::sea_orm::DatabaseConnection;

pub struct State {
    db_conn: DatabaseConnection,
}

#[tokio::main]
async fn main() {
    // establish conn
    let db_conn = establish_connection().await;
    // run migrations
    Migrator::up(&db_conn, None).await.unwrap();
    //
    tauri::Builder::default()
        .manage(State { db_conn })
        .invoke_handler(tauri::generate_handler![cmd::list_products])
        .plugin(tauri_plugin_oauth::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
