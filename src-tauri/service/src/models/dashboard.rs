use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectTransaction {
    pub created_at: String,
    pub price: f64,
    pub quantity: f64,
    pub transaction_type: String,
}

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectTops {
    pub full_name: String,
    pub price: f64,
    pub quantity: f64,
}

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectTopProducts {
    pub name: String,
    pub quantity: f64,
}

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectStatusCount {
    pub status: String,
    pub status_count: i64,
}

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectRevenue {
    pub current_revenue: f64,
    pub last_month_revenue: f64,
}

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct SelectExpenses {
    pub current_expenses: f64,
    pub last_month_expenses: f64,
}

#[derive(Deserialize, Serialize, Debug, PartialEq, FromQueryResult)]
pub struct FiniacialMetrices {
    pub current_revenue: f64,
    pub last_month_revenue: f64,
    pub current_expenses: f64,
    pub last_month_expenses: f64,
}