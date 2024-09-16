CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE weeklyWindow AS (
    startDay TEXT,
    endDay TEXT,
    startTime VARCHAR(5),
    endTime VARCHAR(5)
);

CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    picture TEXT NOT NULL,
    operations weeklyWindow[] NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TYPE productPromotion AS (
    description TEXT,
    price INTEGER,
    operations weeklyWindow[]
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    picture TEXT NOT NULL,
    promotion productPromotion,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),

    restaurantId UUID REFERENCES restaurants(id) ON DELETE CASCADE
);
