#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use db::establish_connection;
use diesel::SqliteConnection;
use std::sync::Mutex;

#[macro_use]
extern crate diesel;
extern crate diesel_migrations;
extern crate dotenv;

mod cmd;
mod csvparsing;
mod db;
mod models;
mod reposotories;
mod schema;
mod types;

pub struct AppState {
    db_conn: Mutex<SqliteConnection>,
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            db_conn: Mutex::new(establish_connection()),
        })
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
            cmd::get_seller,
            cmd::get_sellers,
            cmd::insert_seller,
            cmd::update_seller,
            cmd::delete_seller,
            cmd::get_user,
            cmd::insert_user,
            cmd::update_user,
            cmd::delete_user,
            cmd::get_invoice,
            cmd::get_invoices,
            cmd::insert_invoice,
            cmd::update_invoice,
            cmd::delete_invoice,
            cmd::get_order,
            cmd::get_orders,
            cmd::insert_order,
            cmd::update_order,
            cmd::delete_order,
            cmd::get_order_items,
            cmd::update_order_items,
            cmd::delete_order_items,
            cmd::get_invoice_items,
            cmd::insert_invoice_items,
            cmd::update_invoice_items,
            cmd::delete_invoice_items,
            cmd::get_inventory_mvm,
            cmd::delete_inventory_mvm,
            cmd::update_inventory_mvm,
            cmd::get_b3_clients,
            cmd::get_b3_sellers,
            cmd::get_c_week_expenses,
            cmd::get_s_week_expenses,
            cmd::get_c_product_month,
            cmd::get_s_product_month,
            cmd::get_inventory_stats,
            cmd::seed_db,
        ])
        .setup(|_app| {
            // db::migrate_db();
            Ok(())
        })
        .plugin(tauri_plugin_oauth::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
