use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use dotenv::dotenv;
use std::env;
use std::path;
use std::process::Command;

use crate::cmd::get_csv_records;

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
            let database_url = path::Path::new(&tauri::api::path::home_dir().unwrap())
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

pub fn seed_db() {
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

    let old_data_folder = path::Path::new(&tauri::api::path::home_dir().unwrap()).join("data");
    let old_db_path = &old_data_folder.join("db.sqlite");

    match old_db_path.to_str() {
        Some(a) => {
            for i in table_names.iter_mut() {
                let mut output = Command::new("sqlite3")
                    .args([
                        "-header",
                        "-csv",
                        a,
                        format!("select * from {};", i).as_str(),
                        ">",
                        &old_data_folder.join(format!("{}.csv", i)).to_str().unwrap(),
                    ])
                    .spawn()
                    .expect("Failed to spawn packaged node");
                println!("{:?}", output.stdout.take().unwrap())
            }
        }
        None => print!("coudnt find old db while seeding"),
    }

    // let result = get_csv_records("", table)
}
