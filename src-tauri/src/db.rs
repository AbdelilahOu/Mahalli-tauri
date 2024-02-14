use dotenvy::dotenv;
use migration::sea_orm::Database;
use migration::sea_orm::DatabaseConnection;

use std::env;
use std::path;

pub async fn establish_connection() -> DatabaseConnection {
    dotenv().ok();
    let _env = env::var("DEV_ENV");
    match _env {
        Ok(_env) => {
            let database_url = &env::var("DATABASE_URL").unwrap();
            Database::connect(database_url)
                .await
                .expect(&format!("Error connecting to {}", &database_url))
        }
        Err(_) => {
            println!("Not dev");
            let database_url = path::Path::new(&tauri::api::path::data_dir().unwrap())
                .join(".stocker")
                .join("stocker.db");
            let database_url = database_url.to_str().clone().unwrap();
            Database::connect(database_url)
                .await
                .expect(&format!("Error connecting to {}", &database_url))
        }
    }
}
