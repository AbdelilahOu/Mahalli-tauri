use migration::{Migrator, MigratorTrait};
use service::sea_orm::{Database, DatabaseConnection};

pub async fn setup_database() -> DatabaseConnection {
    let db_url = get_database_url();
    let db_conn = Database::connect(&db_url)
        .await
        .expect(&format!("Error connecting to {}", &db_url));

    Migrator::up(&db_conn, None)
        .await
        .expect("unable to run migrations");

    return db_conn;
}

fn get_database_url() -> String {
    #[cfg(debug_assertions)]
    {
        dotenvy::dotenv().ok();
        std::env::var("DATABASE_URL").unwrap()
    }

    #[cfg(not(debug_assertions))]
    {
        let home_dir = dirs::data_dir().unwrap_or_else(|| panic!("Could not get home directory"));
        let data_dir = home_dir.join(".mahalli/data");
        std::fs::create_dir_all(&data_dir)
            .unwrap_or_else(|_| panic!("Could not create data directory"));
        format!("sqlite://{}db.sqlite?mode=rwc", data_dir.to_string_lossy())
    }
}
