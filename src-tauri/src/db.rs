use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use dotenv::dotenv;
use std::env;
use std::path;

// use crate::cmd::get_csv_records;
use crate::csvparsing::export;

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let _env = env::var("DEV_ENV");
    match _env {
        Ok(_env) => {
            let database_url = &env::var("DATABASE_URL").unwrap();
            SqliteConnection::establish(&database_url)
                .expect(&format!("Error connecting to {}", &database_url))
        }
        Err(_) => {
            println!("Not dev");
            let database_url = path::Path::new(&tauri::api::path::data_dir().unwrap())
                .join(".stocker")
                .join("stocker.db");
            let database_url = database_url.to_str().clone().unwrap();
            SqliteConnection::establish(&database_url)
                .expect(&format!("Error connecting to {}", &database_url))
        }
    }
}

pub fn migrate_db() {
    const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");
    let mut connection = establish_connection();
    connection
        .run_pending_migrations(MIGRATIONS)
        .expect("Error migrating");
}

pub async fn seed_db() {
    dotenv().ok();
    let _env = env::var("SEED_DB");
    match _env {
        Ok(_seed) => {
            let mut table_names: Vec<String> = vec![
                String::from("products"),
                String::from("clients"),
                String::from("sellers"),
                String::from("invoices"),
                String::from("orders"),
                String::from("order_items"),
                String::from("invoice_items"),
                String::from("stock_mouvements"),
            ];

            let old_data_folder = path::Path::new("./data");
            let old_db_path = &old_data_folder.join("db.sqlite");

            print!("{:?}", old_db_path);

            match old_db_path.to_str() {
                Some(source_db_path) => {
                    for i in table_names.iter_mut() {
                        let out_put_file = old_data_folder.join(format!("{}.csv", i));
                        if out_put_file.exists() == false {
                            export::export_db_csv(
                                &source_db_path,
                                &out_put_file.to_str().unwrap(),
                                &i,
                            )
                            .await
                        }
                    }
                }
                None => print!("coudnt find old db while seeding"),
            }
        }
        Err(_r) => println!("seeding the db is desabled"),
    }
}
