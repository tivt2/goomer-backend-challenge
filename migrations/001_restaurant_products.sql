CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    picture TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurant_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_day TEXT NOT NULL,
    end_day TEXT NOT NULL,
    start_time VARCHAR(5),
    end_time VARCHAR(5),

    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    picture TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_promotion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    product_id UUID REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_promotion_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_day TEXT NOT NULL,
    end_day TEXT NOT NULL,
    start_time VARCHAR(5),
    end_time VARCHAR(5),

    promotion_id UUID REFERENCES product_promotion(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS operations_restaurant_id_idx ON restaurant_operations(restaurant_id);
CREATE INDEX IF NOT EXISTS promotion_product_id_idx ON product_promotion(product_id);
CREATE INDEX IF NOT EXISTS operations_promotion_id_idx ON product_promotion_operations(promotion_id);
