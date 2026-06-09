-- =================================================================
-- HANDCRAFTED HAVEN - INITIALIZATION SCRIPT (SELLERS & PRODUCTS ONLY)
-- =================================================================

-- =================================================================
-- 0. CLEANUP EXISTING TABLES
-- =================================================================
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS sellers CASCADE;

-- =================================================================
-- 1. SCHEMA CREATION
-- =================================================================

-- SELLERS TABLE
CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
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
    reviewer_name VARCHAR(100) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- 2. SEED DATA
-- =================================================================

-- SEED SELLERS
INSERT INTO sellers (id, name, email, password_hash, bio, profile_image) VALUES
('33333333-3333-3333-3333-333333333333', 'Michael''s Woodworks', 'michael.artisan@example.com', 'fake_password_hash_3', 'I craft unique and sustainable pieces from reclaimed barn wood. Every grain tells a story of rebirth and natural beauty.', '/placeholder.jpg'),
('44444444-4444-4444-4444-444444444444', 'Sarah''s Ceramics', 'sarah.crafts@example.com', 'fake_password_hash_4', 'Pottery has been my passion for over 10 years. I create mugs, vases, and plates using exclusively local organic clay and natural, food-safe glazes.', '/placeholder.jpg');

-- SEED CATEGORIES
INSERT INTO categories (id, name, description) VALUES
('77777777-7777-7777-7777-777777777777', 'Woodworking', 'Handcrafted wooden objects, furniture, and kitchenware.'),
('88888888-8888-8888-8888-888888888888', 'Ceramics & Glass', 'Handmade home decor in ceramics, natural clay, and blown glass.');

-- SEED PRODUCTS
INSERT INTO products (seller_id, category_id, title, description, price, stock_quantity, image_url, is_organic, is_recycled) VALUES
('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'Rustic Oak Coffee Table', 'A sturdy coffee table made entirely of recycled oak wood and treated with natural oils.', 150.00, 3, null, false, true),
('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'Artisan Cutting Board', 'Thick solid olive wood cutting board, perfect for serving cheese and charcuterie. Features an organic treatment.', 35.50, 10, null, true, false),
('44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', 'Botanical Tea Mug Set', 'Set of 4 hand-painted ceramic mugs with floral motifs. Made with eco-friendly and food-safe glazes.', 45.00, 5, null, true, false),
('44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', 'Modern Minimalist Vase', 'Raw clay decorative vase with minimalist lines, perfect for modern or rustic interior design.', 60.00, 2, null, false, false);

-- SEED REVIEWS
INSERT INTO reviews (id, product_id, reviewer_name, rating, comment) VALUES
('99999999-9999-9999-9999-999999999991', 2, 'John Doe', 5, 'Absolutely beautiful craftsmanship! It looks great in my kitchen and feels very durable.'),
('99999999-9999-9999-9999-999999999992', 3, 'Jane Smith', 4, 'Lovely mugs, the glaze is very vibrant. They were shipped safely and arrived in perfect condition.');