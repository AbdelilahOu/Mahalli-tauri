// @generated automatically by Diesel CLI.

diesel::table! {
    clients (id) {
        id -> Text,
        fullname -> Text,
        phone -> Text,
        created_at -> Timestamp,
        email -> Text,
        address -> Text,
        image -> Text,
    }
}

diesel::table! {
    inventory_mouvements (id) {
        id -> Text,
        date -> Timestamp,
        model -> Text,
        quantity -> BigInt,
        created_at -> Timestamp,
        product_id -> Text,
    }
}

diesel::table! {
    invoice_items (id) {
        id -> Text,
        product_id -> Text,
        invoice_id -> Text,
        quantity -> BigInt,
        inventory_id -> Text,
    }
}

diesel::table! {
    invoices (id) {
        id -> Text,
        status -> Text,
        created_at -> Timestamp,
        client_id -> Text,
    }
}

diesel::table! {
    order_items (id) {
        id -> Text,
        product_id -> Text,
        price -> Nullable<Float>,
        order_id -> Text,
        inventory_id -> Text,
        quantity -> BigInt,
    }
}

diesel::table! {
    orders (id) {
        id -> Text,
        status -> Text,
        created_at -> Timestamp,
        seller_id -> Text,
    }
}

diesel::table! {
    products (id) {
        id -> Text,
        name -> Text,
        image -> Text,
        description -> Text,
        created_at -> Timestamp,
        price -> Float,
    }
}

diesel::table! {
    sellers (id) {
        id -> Text,
        name -> Text,
        phone -> Text,
        created_at -> Timestamp,
        email -> Text,
        address -> Text,
        image -> Text,
    }
}

diesel::table! {
    users (id) {
        id -> Text,
        username -> Text,
        created_at -> Timestamp,
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
