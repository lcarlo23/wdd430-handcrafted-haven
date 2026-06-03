-- =================================================================
-- HANDCRAFTED HAVEN - INITIALIZATION SCRIPT
-- =================================================================

-- =================================================================
-- 0. CLEANUP EXISTING TABLES
-- =================================================================
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS sellers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =================================================================
-- 1. SCHEMA CREATION
-- =================================================================

-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SELLERS TABLE
CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIES TABLE
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- PRODUCTS TABLE
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(255),
    is_organic BOOLEAN DEFAULT FALSE,
    is_recycled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REVIEWS TABLE
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CART ITEMS TABLE
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDERS TABLE
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    is_gift_wrapped BOOLEAN DEFAULT FALSE,
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDER ITEMS TABLE
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    price_at_time NUMERIC(10, 2) NOT NULL
);

-- =================================================================
-- 2. SEED DATA
-- =================================================================

-- SEED USERS
INSERT INTO users (id, first_name, last_name, email, password_hash) VALUES
('11111111-1111-1111-1111-111111111111', 'John', 'Doe', 'john.buyer@example.com', 'fake_password_hash_1'),
('22222222-2222-2222-2222-222222222222', 'Jane', 'Smith', 'jane.buyer@example.com', 'fake_password_hash_2'),
('33333333-3333-3333-3333-333333333333', 'Michael', 'Wood', 'michael.artisan@example.com', 'fake_password_hash_3'),
('44444444-4444-4444-4444-444444444444', 'Sarah', 'Clay', 'sarah.crafts@example.com', 'fake_password_hash_4');

-- SEED SELLERS
INSERT INTO sellers (id, user_id, name, bio, profile_image) VALUES
('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Michael''s Woodworks', 'I craft unique and sustainable pieces from reclaimed barn wood. Every grain tells a story of rebirth and natural beauty.', '/placeholder.jpg'),
('66666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', 'Sarah''s Ceramics', 'Pottery has been my passion for over 10 years. I create mugs, vases, and plates using exclusively local organic clay and natural, food-safe glazes.', '/placeholder.jpg');

-- SEED CATEGORIES
INSERT INTO categories (id, name, description) VALUES
('77777777-7777-7777-7777-777777777777', 'Woodworking', 'Handcrafted wooden objects, furniture, and kitchenware.'),
('88888888-8888-8888-8888-888888888888', 'Ceramics & Glass', 'Handmade home decor in ceramics, natural clay, and blown glass.');

-- SEED PRODUCTS
INSERT INTO products (seller_id, category_id, title, description, price, stock_quantity, image_url, is_organic, is_recycled) VALUES
('55555555-5555-5555-5555-555555555555', '77777777-7777-7777-7777-777777777777', 'Rustic Oak Coffee Table', 'A sturdy coffee table made entirely of recycled oak wood and treated with natural oils.', 150.00, 3, null, false, true),
('55555555-5555-5555-5555-555555555555', '77777777-7777-7777-7777-777777777777', 'Artisan Cutting Board', 'Thick solid olive wood cutting board, perfect for serving cheese and charcuterie. Features an organic treatment.', 35.50, 10, null, true, false),
('66666666-6666-6666-6666-666666666666', '88888888-8888-8888-8888-888888888888', 'Botanical Tea Mug Set', 'Set of 4 hand-painted ceramic mugs with floral motifs. Made with eco-friendly and food-safe glazes.', 45.00, 5, null, true, false),
('66666666-6666-6666-6666-666666666666', '88888888-8888-8888-8888-888888888888', 'Modern Minimalist Vase', 'Raw clay decorative vase with minimalist lines, perfect for modern or rustic interior design.', 60.00, 2, null, false, false);

-- SEED REVIEWS
INSERT INTO reviews (id, product_id, user_id, rating, comment) VALUES
('99999999-9999-9999-9999-999999999991', 2, '11111111-1111-1111-1111-111111111111', 5, 'Absolutely beautiful craftsmanship! It looks great in my kitchen and feels very durable.'),
('99999999-9999-9999-9999-999999999992', 3, '22222222-2222-2222-2222-222222222222', 4, 'Lovely mugs, the glaze is very vibrant. They were shipped safely and arrived in perfect condition.');

-- SEED CART ITEMS
INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 1, 1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222', 4, 2);

-- SEED ORDERS
INSERT INTO orders (id, user_id, total_amount, status, is_gift_wrapped, shipping_address) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '22222222-2222-2222-2222-222222222222', 150.00, 'delivered', true, '123 Maple Street, Springfield, NY 10001'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '11111111-1111-1111-1111-111111111111', 35.50, 'shipped', false, '456 Oak Avenue, Metropolis, CA 90210');

-- SEED ORDER ITEMS
INSERT INTO order_items (id, order_id, product_id, quantity, price_at_time) VALUES
('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 3, 2, 45.00), 
('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 4, 1, 60.00), 
('cccccccc-cccc-cccc-cccc-ccccccccccc3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 2, 1, 35.50);