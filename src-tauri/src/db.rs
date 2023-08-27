use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use diesel_migrations::embed_migrations;
use diesel_migrations::EmbeddedMigrations;
use diesel_migrations::MigrationHarness;
use dotenv::dotenv;
use std::env;
use std::path;

use crate::csvparsing::export;
use crate::csvparsing::import;
use crate::csvparsing::import::TableRecord;
use crate::models::NewClient;
use crate::models::NewInventoryMvm;
use crate::models::NewInvoice;
use crate::models::NewInvoiceItem;
use crate::models::NewOrder;
use crate::models::NewOrderItem;
use crate::models::NewProduct;
use crate::models::NewSeller;
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
                .join("stocker.sqlite");
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
    // table names
    let mut table_names: Vec<String> = vec![
        String::from("products"),
        String::from("clients"),
        String::from("sellers"),
        String::from("invoices"),
        String::from("orders"),
        String::from("inventory_mouvements"),
        String::from("order_items"),
        String::from("invoice_items"),
    ];
    // path to old db and wehere to store csvs
    let old_data_folder = path::Path::new("./data");
    let old_db_path = &old_data_folder.join("db.sqlite");
    //
    let mut conn = establish_connection();
    match old_db_path.to_str() {
        // db path exists
        Some(source_db_path) => {
            // loop over and get each table data
            for table in table_names.iter_mut() {
                // checking if we already have the csvs
                let out_put_file = old_data_folder.join(format!("{}.csv", table));
                if out_put_file.exists() == false {
                    // get data as csv
                    export::export_db_csv(&source_db_path, &out_put_file.to_str().unwrap(), &table)
                        .await;
                }
                // read csv
                let result = import::get_csv_records(
                    String::from(out_put_file.to_str().unwrap()),
                    Option::from(table.clone()),
                );
                // seed db
                insert_into_tables(result, &mut conn);
            }
        }
        None => print!("coudnt find old db while seeding"),
    }
}

fn insert_into_tables(result: Result<TableRecord, String>, conn: &mut SqliteConnection) {
    match result {
        Ok(csv_data) => {
            match csv_data {
                TableRecord::Client(client_records) => {
                    for client in client_records {
                        reposotories::client_repo::insert_client(
                            NewClient {
                                fullname: client.name,
                                image: client.image,
                                address: client.address,
                                phone: client.phone,
                            },
                            conn,
                        );
                    }
                }
                TableRecord::Seller(seller_records) => {
                    for seller in seller_records {
                        reposotories::seller_repo::insert_seller(
                            NewSeller {
                                name: seller.name,
                                image: seller.image,
                                address: seller.address,
                                email: seller.email,
                                phone: seller.phone,
                            },
                            conn,
                        );
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
                            conn,
                        );
                    }
                }
                TableRecord::InventoryMouvement(inventory_records) => {
                    for inventory in inventory_records {
                        reposotories::inventory_mvm_repo::insert_inventory_mvm(
                            /*
                            TODO
                             -> need inventory image
                            */
                            NewInventoryMvm {
                                model: inventory.model,
                                product_id: inventory.product_id,
                                quantity: inventory.quantity,
                            },
                            conn,
                        );
                    }
                }
                TableRecord::Invoice(invoice_records) => {
                    for invoice in invoice_records {
                        reposotories::invoice_repo::insert_invoice(
                            NewInvoice {
                                status: invoice.status,
                                client_id: invoice.client_id,
                            },
                            conn,
                        );
                    }
                }
                TableRecord::InvoiceItem(invoice_items_records) => {
                    for invoice_item in invoice_items_records {
                        reposotories::invoice_item_repo::insert_invoice_item(
                            NewInvoiceItem {
                                inventory_id: invoice_item.inventory_id,
                                invoice_id: invoice_item.invoice_id,
                                product_id: invoice_item.product_id,
                                quantity: invoice_item.quantity,
                            },
                            conn,
                        );
                    }
                }
                TableRecord::Order(order_records) => {
                    for order in order_records {
                        reposotories::order_repo::insert_order(
                            NewOrder {
                                status: order.status,
                                seller_id: order.seller_id,
                            },
                            conn,
                        );
                    }
                }
                TableRecord::OrderItem(order_item_records) => {
                    for order_item in order_item_records {
                        reposotories::order_item_repo::insert_order_item(
                            NewOrderItem {
                                inventory_id: order_item.inventory_id,
                                order_id: order_item.order_id,
                                product_id: order_item.product_id,
                                quantity: order_item.quantity,
                                price: order_item.price,
                            },
                            conn,
                        );
                    }
                }
            }
        }
        Err(e) => println!("{:?}", e),
    }
}
