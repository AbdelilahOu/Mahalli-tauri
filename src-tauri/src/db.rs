use dotenvy::dotenv;
use migration::sea_orm::Database;
use migration::sea_orm::DatabaseConnection;
use std::env;

pub async fn establish_connection() -> DatabaseConnection {
    #[cfg(debug_assertions)]
    dotenv().ok();

    #[cfg(debug_assertions)]
    let database_url = &env::var("DATABASE_URL").unwrap();

    #[cfg(not(debug_assertions))]
    let database_url = path::Path::new(&tauri::api::path::data_dir().unwrap())
        .join(".stocker")
        .join("stocker.db");

    let database_url = database_url.as_str();

    Database::connect(database_url)
        .await
        .expect(&format!("Error connecting to {}", &database_url))
}
