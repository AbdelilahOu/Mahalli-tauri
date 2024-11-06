#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use apalis::{layers::tracing::TraceLayer, prelude::*, sqlite::SqliteStorage, utils::TokioExecutor};
use sqlx::SqlitePool;
use tauri_plugin_log::LogTarget;

use db::establish_connection;
use jobs::{ImageOptimizerJobStorage, ImageProcessorJob, process_image};
use migration::{Migrator, MigratorTrait};
use service::sea_orm::DatabaseConnection;

mod commands;
mod db;
mod jobs;

pub struct AppState {
	db_conn: DatabaseConnection,
	pub job_storage: ImageOptimizerJobStorage,
}

#[cfg(debug_assertions)]
const LOG_TARGETS: [LogTarget; 2] = [LogTarget::LogDir, LogTarget::Stdout];

#[cfg(not(debug_assertions))]
const LOG_TARGETS: [LogTarget; 1] = [LogTarget::LogDir];

#[tokio::main]
async fn main() {
	// db
	let db_conn = establish_connection().await;
	Migrator::up(&db_conn, None).await.unwrap();
	// jobs
	let pool = SqlitePool::connect("sqlite::memory:").await.unwrap();
	SqliteStorage::setup(&pool).await.expect("unable to run migrations for sqlite");

	let image_processor_storage: SqliteStorage<ImageProcessorJob> = SqliteStorage::new(pool.clone());
	let thread_safe_storage = ImageOptimizerJobStorage::new(image_processor_storage.clone());

	let clone_db_conn = db_conn.clone();

	let monitor = Monitor::<TokioExecutor>::new().register_with_count(2, {
		WorkerBuilder::new("image-processor")
			.layer(TraceLayer::new())
			.data(clone_db_conn)
			.with_storage(image_processor_storage)
			.build_fn(process_image)
	});

	tokio::spawn(async move {
		monitor.run().await.unwrap();
	});

	tauri::Builder::default().manage(AppState {
		db_conn,
		job_storage: thread_safe_storage,
	}).plugin(
		tauri_plugin_log::Builder::default()
			.targets(LOG_TARGETS)
			.level_for("tauri", log::LevelFilter::Error)
			.level_for("hyper", log::LevelFilter::Off)
			.level_for("tracing", log::LevelFilter::Off)
			.level_for("sea_orm", log::LevelFilter::Info)
			.level_for("sqlx", log::LevelFilter::Info)
			.level_for("tao", log::LevelFilter::Off)
			.build(),
	).invoke_handler(tauri::generate_handler![
    //
    // products
    //
    commands::products::list_products,
    commands::products::search_products,
    commands::products::create_product,
    commands::products::update_product,
    commands::products::delete_product,
    //
    // inventory
    //
    commands::inventory::list_inventory,
    commands::inventory::create_inventory,
    commands::inventory::delete_inventory,
    //
    // clients
    //
    commands::clients::list_clients,
    commands::clients::search_clients,
    commands::clients::create_client,
    commands::clients::update_client,
    commands::clients::delete_client,
    //
    // suppliers
    //
    commands::suppliers::list_suppliers,
    commands::suppliers::search_suppliers,
    commands::suppliers::create_supplier,
    commands::suppliers::update_supplier,
    commands::suppliers::delete_supplier,
    //
    // orders
    //
    commands::orders::list_orders,
    commands::orders::get_order,
    commands::orders::get_order_details,
    commands::orders::create_order,
    commands::orders::update_order,
    commands::orders::delete_order,
    commands::orders::list_order_products,
    commands::orders::create_order_from_quote,
    commands::orders::update_order_status,
    //
    // quotes
    //
    commands::quotes::list_quotes,
    commands::quotes::get_quote,
    commands::quotes::get_quote_details,
    commands::quotes::create_quote,
    commands::quotes::update_quote,
    commands::quotes::delete_quote,
    commands::quotes::list_quote_products,
      //
    // quote items
    //
    commands::templates::create_template,
    //
    // quote items
    //
    commands::quote_items::delete_quote_item,
    //
    // invoices
    //
    commands::invoices::list_invoices,
    commands::invoices::get_invoice,
    commands::invoices::get_invoice_details,
    commands::invoices::create_invoice,
    commands::invoices::update_invoice,
    commands::invoices::delete_invoice,
    commands::invoices::list_invoice_products,
    commands::invoices::create_invoice_from_order,
    commands::invoices::update_invoice_status,
    //
    // dashboard
    //
    commands::dashboard::list_inventory_stats,
    commands::dashboard::list_top_clients,
    commands::dashboard::list_top_suppliers,
    commands::dashboard::list_top_products,
    commands::dashboard::list_status_count,
    commands::dashboard::list_financial_metrices,
  ]).run(tauri::generate_context!()).expect("error while running tauri application");
}
