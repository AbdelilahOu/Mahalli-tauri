// done repo_stats/get_client_exxpenses
export const clientDailyExpenses = `
    SELECT strftime('%Y-%m-%d', i.created_at) AS day,
        SUM(p.price * ABS(ci.quantity)) AS expense
    FROM invoices i
    JOIN invoice_items ci ON i.id = ci.invoice_id
    JOIN products p ON ci.product_id = p.id
    WHERE i.client_id = $1 
    AND i.created_at > $2
    GROUP BY day
    ORDER BY day
    LIMIT 7;
`;

// done
export const sellerDailyExpenses = `
    SELECT strftime('%Y-%m-%d', o.created_at) AS day,
        SUM(p.price * ABS(oi.quantity)) AS expense
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.seller_id = $1 
    AND o.created_at > $2
    GROUP BY day
    ORDER BY day
    LIMIT 7;
`;

// done stats_repo/get_client_details
export const clientDetailsJoins = `
    SELECT p.name AS name, strftime('%Y-%m', i.created_at) AS month, ABS(COALESCE(SUM(ii.quantity), 0)) AS quantity
    FROM clients c
    JOIN invoices i ON c.id = i.client_id
    JOIN invoice_items ii ON i.id = ii.invoice_id
    JOIN products p ON ii.product_id = p.id
    WHERE c.id = $1
    GROUP BY p.name, month
    ORDER BY month ASC;
`;

// seller details
export const sellerDetailsJoins = `
    SELECT p.name AS name, strftime('%Y-%m', o.created_at) AS month, ABS(COALESCE(SUM(oi.quantity), 0)) AS quantity
    FROM sellers s
    JOIN orders o ON s.id = o.seller_id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE s.id = $1
    GROUP BY p.name, month
    ORDER BY month ASC;
`;

// done : stats_repo/get_inventory_stats
export const inOutStatsJoins = `
    SELECT strftime('%Y-%m', date) AS group_month,
        SUM(CASE WHEN model = 'IN' THEN ABS(quantity) ELSE 0 END) AS total_in,
        SUM(CASE WHEN model = 'OUT' THEN ABS(quantity) ELSE 0 END) AS total_out
    FROM stock_mouvements
    GROUP BY group_month
    ORDER BY id DESC
    LIMIT 3;
`;

// done : stats_repos/get_best_three_client
export const bestThreeClients = `
    SELECT c.name AS name, SUM(p.price * ABS(ci.quantity)) AS amount
    FROM clients c
    JOIN invoices i ON c.id = i.client_id
    JOIN invoice_items ci ON i.id = ci.invoice_id
    JOIN products p ON ci.product_id = p.id
    GROUP BY c.name
    ORDER BY amount DESC
    LIMIT 3;
`;

// done : stats_repos/get_best_three_seller
export const bestThreeSellers = `
    SELECT s.name AS name, SUM(p.price * ABS(ci.quantity)) AS amount
    FROM sellers s
    JOIN orders i ON s.id = i.seller_id
    JOIN order_items ci ON i.id = ci.order_id
    JOIN products p ON ci.product_id = p.id
    GROUP BY s.name
    ORDER BY amount DESC
    LIMIT 3;
`;

// done : product_repo/get_products
export const selectProductsWithQuantity = `
    SELECT products.*, COALESCE(SUM(sm.quantity), 0) AS quantity
    FROM products LEFT JOIN stock_mouvements sm ON products.id = sm.product_id
    GROUP BY products.id ORDER BY products.id DESC
`;

// done
export const stockJoins = `
    SELECT json_object(
        'id', sm.id,
        'date', sm.date,
        'model', sm.model,
        'quantity', sm.quantity,
        'orderItem', json_object(
            'order_id', ci.order_id,
            'price', ci.price
        ),
        'invoiceItem', json_object(
            'invoice_id', ii.invoice_id
        ),
        'product_id', sm.product_id,
        'product', json_object(
            'name', p.name,
            'price', p.price
        )
    ) AS data
    FROM stock_mouvements sm
    LEFT JOIN order_items ci ON sm.id = ci.stock_id
    LEFT JOIN invoice_items ii ON sm.id = ii.stock_id
    LEFT JOIN products p ON sm.product_id = p.id OR sm.product_id = p.id
    ORDER BY sm.id DESC;
`;

// done
export const ordersJoins = `
    SELECT json_object(
        'id', c.id,
        'status', c.status,
        'created_at', c.created_at,
        'seller_id', c.seller_id,
        'seller', json_object(
            'id', s.id,
            'name', s.name
        ),
        'orderItems', (
            SELECT json_group_array(
                json_object(
                    'id', ci.id,
                    'price', ci.price,
                    'quantity', ci.quantity,
                    'product_id', ci.product_id,
                    'stock_id', ci.stock_id,
                    'product', json_object(
                        'id', p.id,
                        'name', p.name,
                        'price', p.price
                    )
                )
            )
            FROM order_items ci
            INNER JOIN products p ON ci.product_id = p.id
            WHERE ci.order_id = c.id
        )
    ) AS data
    FROM orders c
    INNER JOIN sellers s ON c.seller_id = s.id
    ORDER BY c.id DESC;
`;

// done
export const invoicesJoins = `
    SELECT json_object(
        'id', i.id,
        'total', (
            SELECT SUM(ABS(ii.quantity) * p.price)
            FROM invoice_items ii
            INNER JOIN products p ON ii.product_id = p.id
            WHERE ii.invoice_id = i.id
        ),
        'created_at', i.created_at,
        'client_id', i.client_id,
        'status', i.status,
        'client', json_object(
            'id', c.id,
            'name', c.name
        ),
        'invoiceItems', (
            SELECT json_group_array(
                json_object(
                    'id', ii.id,
                    'quantity', ABS(ii.quantity),
                    'stock_id', ii.stock_id,
                    'product_id', ii.product_id,
                    'product', json_object(
                        'id', p.id,
                        'name', p.name,
                        'price', p.price
                    )
                )
            )
            FROM invoice_items ii
            INNER JOIN products p ON ii.product_id = p.id
            WHERE ii.invoice_id = i.id
        )
    ) AS data
    FROM invoices i
    INNER JOIN clients c ON i.client_id = c.id
    ORDER BY i.id DESC;
`;

// done
export const orderDetailsJoins = `
    SELECT json_object(
        'id', c.id,
        'status', c.status,
        'created_at', c.created_at,
        'seller', json_object(
            'id', s.id,
            'name', s.name,
            'phone', s.phone,
            'email', s.email,
            'address', s.address,
            'image', s.image
        ),
        'orderItems', json_group_array(
            json_object(
                'id', ci.id,
                'price', ci.price,
                'quantity', ci.quantity,
                'product_id', ci.product_id,
                'product', json_object(
                    'id', p.id,
                    'name', p.name,
                    'description', p.description,
                    'price', p.price,
                    'tva', p.tva,
                    'image', p.image
                )
            )
        )
    ) AS data
    FROM orders c
    INNER JOIN sellers s ON c.seller_id = s.id
    INNER JOIN order_items ci ON c.id = ci.order_id
    INNER JOIN products p ON ci.product_id = p.id
    WHERE c.id = $1;
`;

// done
export const invoiceDetailsJoins = `
    SELECT json_object(
        'id', i.id,
        'total', i.total,
        'created_at', i.created_at,
        'client_id', i.client_id,
        'client', json_object(
            'id', c.id,
            'name', c.name,
            'phone', c.phone,
            'email', c.email,
            'address', c.address,
            'image', c.image
        ),
        'invoiceItems', json_group_array(
            json_object(
                'id', ii.id,
                'quantity', ABS(ii.quantity),
                'product_id', ii.product_id,
                'product', json_object(
                    'id', p.id,
                    'name', p.name,
                    'description', p.description,
                    'price', p.price,
                    'tva', p.tva,
                    'image', p.image
                )
            )
        )
    ) AS data
    FROM invoices i
    INNER JOIN clients c ON i.client_id = c.id
    INNER JOIN invoice_items ii ON i.id = ii.invoice_id
    INNER JOIN products p ON ii.product_id = p.id
    WHERE i.id = $1;
`;
