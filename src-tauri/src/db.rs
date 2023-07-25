use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use dotenv::dotenv;
use std::env;
use std::path;

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

fn migrate_db() {
    const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");
    let mut connection = establish_connection();
    connection
        .run_pending_migrations(MIGRATIONS)
        .expect("Error migrating");
}
