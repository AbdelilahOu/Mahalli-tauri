use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use dotenv::dotenv;
use std::env;
use std::path;

use crate::csvparsing::export;
use crate::csvparsing::import;
use crate::csvparsing::import::TableRecord;
use crate::models::{NewClient, NewInvoice, NewProduct, NewSeller};
use crate::reposotories;

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
            // table names
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
            // path to old db and wehere to store csvs
            let old_data_folder = path::Path::new("./data");
            let old_db_path = &old_data_folder.join("db.sqlite");
            //
            match old_db_path.to_str() {
                // db path exists
                Some(source_db_path) => {
                    // loop over and get each table data
                    for table in table_names.iter_mut() {
                        // checking if we already have the csvs
                        let out_put_file = old_data_folder.join(format!("{}.csv", table));
                        if out_put_file.exists() == false {
                            // get data
                            export::export_db_csv(
                                &source_db_path,
                                &out_put_file.to_str().unwrap(),
                                &table,
                            )
                            .await;

                            let result = import::get_csv_records(
                                String::from(out_put_file.to_str().unwrap()),
                                Option::from(table.clone()),
                            );

                            match result {
                                Ok(csv_data) => match csv_data {
                                    TableRecord::Client(client_records) => {
                                        for client in client_records {
                                            reposotories::client_repo::insert_client(NewClient {
                                                fullname: client.name,
                                                image: client.image,
                                                address: client.address,
                                                phone: client.phone,
                                            });
                                        }
                                    }
                                    TableRecord::Product(product_records) => {
                                        for product in product_records {
                                            reposotories::product_repo::insert_product(
                                                /*
                                                TODO
                                                 -> need product image
                                                */
                                                NewProduct {
                                                    name: product.name,
                                                    price: product.price,
                                                    description: product.description,
                                                    tva: product.tva,
                                                },
                                            );
                                        }
                                    }
                                    // TableRecord::Invoice(product_records) => {
                                    //     for invoice in product_records {
                                    //         reposotories::invoice_repo::insert_invoice(NewInvoice {
                                    //             total: invoice.total,
                                    //             status: invoice.status,
                                    //             client_id: invoice.client_id,
                                    //         })
                                    //     }
                                    // }
                                    _ => {
                                        println!("not implemented yet");
                                    }
                                },
                                Err(e) => println!("{:?}", e),
                            }
                        }
                    }
                }
                None => print!("coudnt find old db while seeding"),
            }
        }
        Err(_r) => println!("seeding the db is desabled"),
    }
}
