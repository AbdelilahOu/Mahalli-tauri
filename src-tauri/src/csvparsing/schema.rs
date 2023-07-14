use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct ProductRecord {
    id: i64,
    name: String,
    price: f64,
    tva: f64,
    description: String,
    stock: i64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ClientRecord {
    id: i64,
    name: String,
    phone: String,
    email: String,
    address: String,
    image: i64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SellerRecord {
    id: i64,
    name: String,
    phone: String,
    email: String,
    address: String,
    image: i64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InvoiceRecord {
    id: i64,
    total: i64,
    status: String,
    created_at: String,
    client_id: i64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InvoiceItemRecord {
    id: i64,
    product_id: i64,
    invoice_id: i64,
    quantity: i64,
    stock_id: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct OrderRecord {
    id: i64,
    status: String,
    created_at: String,
    seller_id: i64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct OrderItemRecord {
    id: i64,
    product_id: i64,
    price: i64,
    order_id: i64,
    quantity: i64,
    stock_id: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct StockMouvementRecord {
    id: i64,
    date: String,
    model: String,
    quantity: String,
    product_id: String,
}
