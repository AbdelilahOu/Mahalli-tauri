pub struct TNewOrder {
    pub status: String,
    pub seller_id: i32,
    pub order_items: Vec<TNewOrderItems>,
}

pub struct TNewOrderItems {
    pub product_id: i32,
    pub order_id: i32,
    pub quantity: i64,
    pub price: Option<f32>,
    pub inventory_id: i32,
}
