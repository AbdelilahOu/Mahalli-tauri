pub struct TNewInvoiceWithItems {
    pub total: f32,
    pub status: String,
    pub client_id: i32,
    pub items: Vec<TNewInvoiceItem>,
}

pub struct TNewInvoiceItem {
    pub product_id: i32,
    pub quantity: i64,
}
