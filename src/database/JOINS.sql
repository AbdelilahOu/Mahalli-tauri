SELECT json_object(
    'id', c.id,
    'status', c.status,
    'created_at', c.created_at,
    'seller_id', c.seller_id,
    'seller', json_object(
        'id', s.id,
        'name', s.name
    ),
    'commandItems', (
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
        FROM command_items ci
        INNER JOIN products p ON ci.product_id = p.id
        WHERE ci.command_id = c.id
    )
) AS data
FROM commands c
INNER JOIN sellers s ON c.seller_id = s.id
ORDER BY c.id DESC;


SELECT json_object(
    'id', i.id,
    'total', (
        SELECT SUM(ii.quantity * p.price)
        FROM invoice_items ii
        INNER JOIN products p ON ii.product_id = p.id
        WHERE ii.invoice_id = i.id
    ),
    'created_at', i.created_at,
    'client_id', i.client_id,
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
) AS data FROM invoices i INNER JOIN clients c ON i.client_id = c.id ORDER BY i.id DESC;


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
    'commandItems', json_group_array(
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
FROM commands c INNER JOIN sellers s ON c.seller_id = s.id INNER JOIN command_items ci ON c.id = ci.command_id INNER JOIN products p ON ci.product_id = p.id WHERE c.id = $1;


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
FROM invoices i INNER JOIN clients c ON i.client_id = c.id INNER JOIN invoice_items ii ON i.id = ii.invoice_id INNER JOIN products p ON ii.product_id = p.id WHERE i.id = [invoice_id];


