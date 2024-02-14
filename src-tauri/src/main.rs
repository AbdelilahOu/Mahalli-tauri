#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod db;

use db::establish_connection;
use migration::{Migrator, MigratorTrait};
use service::{sea_orm::DatabaseConnection, MutationsService, QueriesService};

use std::sync::Mutex;

pub struct AppState {
    db_conn: Mutex<DatabaseConnection>,
}

#[tokio::main]
async fn main() {
    // establish conn
    let db_conn = establish_connection().await;
    // run migrations
    Migrator::up(&db_conn, None).await.unwrap();
    //
    tauri::Builder::default()
        .manage(AppState {
            db_conn: Mutex::new(db_conn),
        })
        .plugin(tauri_plugin_oauth::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
