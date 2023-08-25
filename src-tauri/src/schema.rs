// @generated automatically by Diesel CLI.

diesel::table! {
    clients (id) {
        id -> Integer,
        fullname -> Text,
        phone -> Text,
        email -> Text,
        address -> Text,
        image -> Text,
    }
}

diesel::table! {
    inventory_mouvements (id) {
        id -> Integer,
        date -> Timestamp,
        model -> Text,
        quantity -> BigInt,
        product_id -> Integer,
    }
}

diesel::table! {
    invoice_items (id) {
        id -> Integer,
        product_id -> Integer,
        invoice_id -> Integer,
        quantity -> BigInt,
        inventory_id -> Integer,
    }
}

diesel::table! {
    invoices (id) {
        id -> Integer,
        status -> Text,
        created_at -> Timestamp,
        client_id -> Integer,
    }
}

diesel::table! {
    order_items (id) {
        id -> Integer,
        product_id -> Integer,
        price -> Nullable<Float>,
        order_id -> Integer,
        inventory_id -> Integer,
        quantity -> BigInt,
    }
}

diesel::table! {
    orders (id) {
        id -> Integer,
        status -> Text,
        created_at -> Timestamp,
        seller_id -> Integer,
    }
}

diesel::table! {
    products (id) {
        id -> Integer,
        name -> Text,
        image -> Text,
        description -> Text,
        price -> Float,
        tva -> Float,
    }
}

diesel::table! {
    sellers (id) {
        id -> Integer,
        name -> Text,
        phone -> Text,
        email -> Text,
        address -> Text,
        image -> Text,
    }
}

diesel::table! {
    users (id) {
        id -> Integer,
        username -> Text,
        password -> Text,
        email -> Text,
        role -> Text,
    }
}

diesel::joinable!(inventory_mouvements -> products (product_id));
diesel::joinable!(invoice_items -> inventory_mouvements (inventory_id));
diesel::joinable!(invoice_items -> invoices (invoice_id));
diesel::joinable!(invoice_items -> products (product_id));
diesel::joinable!(invoices -> clients (client_id));
diesel::joinable!(order_items -> inventory_mouvements (inventory_id));
diesel::joinable!(order_items -> orders (order_id));
diesel::joinable!(order_items -> products (product_id));
diesel::joinable!(orders -> sellers (seller_id));

diesel::allow_tables_to_appear_in_same_query!(
    clients,
    inventory_mouvements,
    invoice_items,
    invoices,
    order_items,
    orders,
    products,
    sellers,
    users,
);
