-- =====================================================
-- ONPRINT GODADDY MYSQL DATABASE SCHEMA & SEED DATA
-- Fully Optimized for Dubai SEO & Google Search Architecture
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  status VARCHAR(50) DEFAULT 'active',
  last_login_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_key VARCHAR(100) DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  image VARCHAR(500) DEFAULT NULL,
  image_url VARCHAR(500) DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'active',
  display_order INT DEFAULT 0,
  active TINYINT(1) DEFAULT 1,
  seo_title VARCHAR(255) DEFAULT NULL,
  seo_description TEXT DEFAULT NULL,
  seo_keywords VARCHAR(500) DEFAULT NULL,
  seo_heading VARCHAR(255) DEFAULT NULL,
  canonical_url VARCHAR(500) DEFAULT NULL,
  image_alt VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_key VARCHAR(100) DEFAULT NULL,
  category_id INT DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  short_description TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  minimum_quantity INT NOT NULL DEFAULT 1,
  featured TINYINT(1) DEFAULT 0,
  specifications JSON DEFAULT NULL,
  active TINYINT(1) DEFAULT 1,
  seo_title VARCHAR(255) DEFAULT NULL,
  seo_description TEXT DEFAULT NULL,
  seo_keywords VARCHAR(500) DEFAULT NULL,
  seo_heading VARCHAR(255) DEFAULT NULL,
  canonical_url VARCHAR(500) DEFAULT NULL,
  image_alt VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255) DEFAULT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_key VARCHAR(100) DEFAULT NULL,
  category_id INT DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  short_description TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  image VARCHAR(500) DEFAULT NULL,
  display_order INT DEFAULT 0,
  active TINYINT(1) DEFAULT 1,
  seo_title VARCHAR(255) DEFAULT NULL,
  seo_description TEXT DEFAULT NULL,
  seo_keywords VARCHAR(500) DEFAULT NULL,
  seo_heading VARCHAR(255) DEFAULT NULL,
  canonical_url VARCHAR(500) DEFAULT NULL,
  image_alt VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_services_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT DEFAULT NULL,
  content LONGTEXT NOT NULL,
  featured_image VARCHAR(500) DEFAULT NULL,
  image_alt VARCHAR(255) DEFAULT NULL,
  category_id INT DEFAULT NULL,
  product_id INT DEFAULT NULL,
  author_id INT DEFAULT NULL,
  author_name VARCHAR(100) DEFAULT 'ONPRINT Editorial Team',
  status ENUM('draft', 'published', 'scheduled') DEFAULT 'draft',
  is_featured TINYINT(1) DEFAULT 0,
  seo_title VARCHAR(255) DEFAULT NULL,
  meta_description TEXT DEFAULT NULL,
  focus_keyword VARCHAR(255) DEFAULT NULL,
  secondary_keywords TEXT DEFAULT NULL,
  canonical_url VARCHAR(500) DEFAULT NULL,
  og_title VARCHAR(255) DEFAULT NULL,
  og_description TEXT DEFAULT NULL,
  og_image VARCHAR(500) DEFAULT NULL,
  schema_type VARCHAR(50) DEFAULT 'BlogPosting',
  reading_time INT DEFAULT 3,
  target_location VARCHAR(100) DEFAULT NULL,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_blogs_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_blogs_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  CONSTRAINT fk_blogs_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  company VARCHAR(255) DEFAULT NULL,
  subject VARCHAR(255) DEFAULT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_number VARCHAR(50) NOT NULL UNIQUE,
  user_id INT DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  company VARCHAR(255) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  total_price DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_quotes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quote_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_id INT NOT NULL,
  product_id INT DEFAULT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) DEFAULT 0.00,
  subtotal DECIMAL(10, 2) DEFAULT 0.00,
  options JSON DEFAULT NULL,
  CONSTRAINT fk_quote_items_quote FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
  CONSTRAINT fk_quote_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'subscribed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  user_id INT DEFAULT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) DEFAULT NULL,
  company VARCHAR(255) DEFAULT NULL,
  shipping_address TEXT DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  subtotal DECIMAL(10, 2) DEFAULT 0.00,
  tax DECIMAL(10, 2) DEFAULT 0.00,
  shipping DECIMAL(10, 2) DEFAULT 0.00,
  total_price DECIMAL(10, 2) DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'AED',
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT DEFAULT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) DEFAULT 0.00,
  subtotal DECIMAL(10, 2) DEFAULT 0.00,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INITIAL SEED DATA
-- =====================================================

-- Default Admin User (Password: admin123)
INSERT INTO users (name, email, password_hash, role, status) VALUES
('ONPRINT Admin', 'admin@onprint.ae', '$2b$10$ciuCsCYnbPnRskoS6HtC6O4JinOZXmN4IFjrmJtKemCZyDipxzD66', 'admin', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Categories with SEO metadata
INSERT INTO categories (id, category_key, name, slug, description, image, image_url, status, display_order, active, seo_title, seo_description, seo_keywords, seo_heading, canonical_url, image_alt) VALUES
(1, 'cat-brochures-printing', 'Brochures Printing', 'brochures-printing', 'Premium corporate bi-fold, tri-fold, and multi-page marketing brochures printed on luxury coated art paper with precision folding and finishing.', '/uploads/categories/brochures-printing.jpg', '/uploads/categories/brochures-printing.jpg', 'active', 1, 1, 'Brochures Printing in Dubai | Premium Brochure Printing | ONPRINT', 'Professional brochure printing in Dubai. Custom bi-fold, tri-fold, and multi-page brochures with soft-touch matte lamination and fast turnaround.', 'brochures printing dubai, brochure printing dubai, corporate brochures uae, custom bi fold brochures', 'Commercial Brochure Printing in Dubai', 'https://0nprint.com/categories/brochures-printing', 'Professional commercial printed brochures in Dubai'),
(2, 'cat-business-cards-printing', 'Business Cards Printing', 'business-cards-printing', 'Executive 350gsm to 600gsm cotton and silk business cards with soft-touch velvet lamination, metallic gold foil stamping, and painted edges.', '/uploads/categories/business-cards-printing.jpg', '/uploads/categories/business-cards-printing.jpg', 'active', 2, 1, 'Business Card Printing in Dubai | Luxury Business Cards | ONPRINT', 'Make an undeniable first impression with luxury business cards in Dubai. 350gsm–600gsm cotton stocks, gold foil stamping, and spot UV varnishing.', 'business cards printing dubai, luxury business cards dubai, executive visiting cards uae', 'Luxury Executive Business Card Printing in Dubai', 'https://0nprint.com/categories/business-cards-printing', 'Luxury gold foil executive business cards in Dubai'),
(3, 'cat-flyers-printing-in-dubai', 'Flyers Printing In Dubai', 'flyers-printing-in-dubai', 'High-impact commercial marketing flyers printed on 170gsm–300gsm gloss or matte art paper with vibrant CMYK Pantone color fidelity.', '/uploads/categories/flyers-printing-in-dubai.jpg', '/uploads/categories/flyers-printing-in-dubai.jpg', 'active', 3, 1, 'Flyer Printing in Dubai | Same Day Marketing Flyer Printing | ONPRINT', 'Order custom marketing flyer printing in Dubai. Single and double-sided promo flyers on premium art paper with express same-day delivery.', 'flyers printing in dubai, flyer printing dubai, promotional flyers uae, marketing leaflets dubai', 'High-Impact Marketing Flyer Printing in Dubai', 'https://0nprint.com/categories/flyers-printing-in-dubai', 'Full color commercial marketing flyers printed in Dubai'),
(4, 'cat-id-card-printing-dubai', 'ID Card Printing Dubai', 'id-card-printing-dubai', 'Secure CR80 standard PVC employee identity cards with high-definition thermal printing, smart chips, magnetic strips, and barcodes.', '/uploads/categories/id-card-printing-dubai.jpg', '/uploads/categories/id-card-printing-dubai.jpg', 'active', 4, 1, 'ID Card Printing Dubai | Corporate Employee & PVC Cards | ONPRINT', 'High-security corporate PVC ID card printing in Dubai. Crisp photo resolution, smart NFC chips, barcodes, and custom lanyards for UAE businesses.', 'id card printing dubai, pvc id cards dubai, corporate employee badges uae, student id card printing', 'Corporate PVC ID Card Printing Solutions Dubai', 'https://0nprint.com/categories/id-card-printing-dubai', 'Corporate employee PVC identity cards with chips in Dubai'),
(5, 'cat-lanyard-printing-dubai', 'Lanyard Printing Dubai', 'lanyard-printing-dubai', 'Custom branded satin and woven polyester neck lanyards with screen printing, safety breakaway clips, and heavy-duty metal swivel hooks.', '/uploads/categories/lanyard-printing-dubai.jpg', '/uploads/categories/lanyard-printing-dubai.jpg', 'active', 5, 1, 'Lanyard Printing Dubai | Custom Branded Neck Lanyards | ONPRINT', 'Custom branded neck lanyard printing in Dubai. High-density polyester and satin lanyards with safety buckles and swivel hooks for corporate events.', 'lanyard printing dubai, custom lanyards dubai, branded neck straps uae, event lanyards dubai', 'Custom Branded Neck Lanyard Printing in Dubai', 'https://0nprint.com/categories/lanyard-printing-dubai', 'Custom branded corporate neck lanyards in Dubai'),
(6, 'cat-letterheads-printing-dubai', 'Letterheads Printing Dubai', 'letterheads-printing-dubai', 'Executive 120gsm smooth uncoated white letterheads and official corporate stationery printed with crisp full-color CMYK laser compatibility.', '/uploads/categories/letterheads-printing-dubai.jpg', '/uploads/categories/letterheads-printing-dubai.jpg', 'active', 6, 1, 'Letterhead Printing in Dubai | Official Corporate Stationery | ONPRINT', 'Executive corporate letterhead printing in Dubai. 120gsm smooth laser-guaranteed paper for official contracts, proposals, and invoices.', 'letterheads printing dubai, letterhead printing dubai, corporate stationery uae, official letterhead paper', 'Executive Corporate Letterhead Printing in Dubai', 'https://0nprint.com/categories/letterheads-printing-dubai', 'Executive corporate stationery letterhead and envelope in Dubai'),
(7, 'cat-name-badges-printing-dubai', 'Name Badges Printing Dubai', 'name-badges-printing-dubai', 'Laser-cut brushed metal and acrylic employee name badges with magnetic backings, clear domed epoxy coatings, and scratch-resistant finishes.', '/uploads/categories/name-badges-printing-dubai.jpg', '/uploads/categories/name-badges-printing-dubai.jpg', 'active', 7, 1, 'Name Badges Printing Dubai | Magnetic Metal & Acrylic Badges | ONPRINT', 'Professional staff name badges printing in Dubai. Brushed silver, gold, and acrylic magnetic badges with domed epoxy resin for corporate teams.', 'name badges printing dubai, magnetic name badges dubai, staff badge printing uae, acrylic name tag printing', 'Professional Magnetic Name Badges Printing Dubai', 'https://0nprint.com/categories/name-badges-printing-dubai', 'Professional magnetic metal and acrylic name badges in Dubai')
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), image=VALUES(image), image_url=VALUES(image_url), seo_title=VALUES(seo_title), seo_description=VALUES(seo_description);
