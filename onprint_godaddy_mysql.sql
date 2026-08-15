-- =====================================================
-- ONPRINT GODADDY MYSQL DATABASE SCHEMA & SEED DATA
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
  active TINYINT(1) DEFAULT 1,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_services_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
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
  status VARCHAR(50) DEFAULT 'Pending',
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
('ONPRINT Admin', 'admin@onprint.ae', '$2a$10$wB9V3J9b1Y7z8Yx.L7K0.e6tLz9R8a7b6c5d4e3f2g1h0i9j8k', 'admin', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Categories
INSERT INTO categories (id, category_key, name, slug, description, active) VALUES
(1, 'cat-corporate-gifts', 'Corporate Gift Items', 'corporate-gift-items', 'Premium branded gifts, apparel, mugs, and giveaways designed for businesses and corporate events in Dubai.', 1),
(2, 'cat-office-stationery', 'Office Stationery Printing', 'office-stationery-printing', 'Executive notebooks, pens, business cards, and letterheads tailored for professional brand correspondence.', 1),
(3, 'cat-other-products', 'Other Products', 'other-products', 'Large-format roll-ups, outdoor flags, die-cut vinyl stickers, and acrylic executive nameplates.', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);

-- Products
INSERT INTO products (id, product_key, category_id, name, slug, short_description, description, price, minimum_quantity, featured, active) VALUES
(1, 'prod-1', 1, 'Mug Printing Dubai', 'mug-printing-dubai', 'High-quality ceramic & thermal mugs custom printed with corporate logos and sublimation.', 'Premium 11oz & 15oz ceramic mugs with dishwasher-safe full-color sublimation printing. Ideal for corporate branding and office gifts.', 25.00, 20, 1, 1),
(2, 'prod-2', 1, 'Custom Mouse Pad', 'custom-mouse-pad', 'Smooth micro-weave fabric mouse pads with non-slip rubber base & anti-fray edge stitching.', 'Ultra-smooth tracking surface custom printed with your high-resolution brand artwork or desk mat designs.', 35.00, 25, 0, 1),
(3, 'prod-3', 1, 'T-Shirt Printing Dubai', 't-shirt-printing-dubai', 'Premium 100% combed cotton t-shirts with DTG, screen printing, and embroidered logos.', 'Breathable, durable corporate crewneck & polo t-shirts printed with vibrant eco-friendly inks or precision embroidery.', 45.00, 15, 1, 1),
(4, 'prod-4', 1, 'Cap Printing Dubai', 'cap-printing-dubai', 'Customized snapback, baseball, and trucker caps with 3D embroidery & printed logos.', 'High-profile structured caps featuring adjustable straps, custom interior taping, and bold 3D puff embroidery.', 30.00, 20, 0, 1),
(5, 'prod-5', 1, 'Custom Water Bottles Printing in Dubai', 'water-bottles-printing-dubai', 'Smart LED temperature display vacuum flasks & stainless steel water bottles with laser engraving.', 'Double-wall insulated 500ml stainless steel water bottles with LED touch temperature display and full-color UV logo printing.', 55.00, 25, 1, 1),
(6, 'prod-6', 2, 'Notebook Printing', 'notebook-printing', 'Hardcover leatherette journals with foil stamped covers and ribbon page markers.', 'Executive A5 & A4 bound notebooks with 80gsm cream ruled pages, custom ribbon markers, and debossed covers.', 40.00, 50, 1, 1),
(7, 'prod-7', 2, 'Pens Printing', 'pens-printing', 'Metallic & eco-friendly rollerball pens laser engraved or screen printed with your brand.', 'Sleek metal body ballpoint pens with black or blue German ink refills, packaged in velvet presentation pouches.', 15.00, 100, 0, 1),
(8, 'prod-8', 2, 'Business Cards Printing', 'business-cards-printing', 'Premium 350gsm silk, soft-touch matte laminate, and gold foil embossed cards.', 'Make an undeniable first impression with thick 350gsm–400gsm cotton or soft-touch laminated cards with painted edges.', 50.00, 100, 1, 1),
(9, 'prod-9', 2, 'Letterhead Printing Dubai', 'letterhead-printing-dubai', 'Executive 120gsm smooth white letterheads printed in crisp full-color CMYK.', 'Laser-guaranteed 120gsm smooth uncoated paper letterheads for official corporate contracts, invoices, and letters.', 65.00, 250, 0, 1),
(10, 'prod-10', 3, 'Roll-up Printing Dubai', 'roll-up-printing-dubai', 'Heavy-duty aluminum roll-up banner stands with anti-curl grey back film & padded bag.', '85x200cm & 100x200cm retractable banner stands printed on high-resolution anti-curl PET film for exhibitions and retail.', 180.00, 1, 1, 1),
(11, 'prod-11', 3, 'Flag Printing Dubai', 'flag-printing-dubai', 'Teardrop and feather beach flags with weather-resistant knitted polyester print.', 'Dynamic outdoor promotional flags with heavy water bags, ground spikes, and single or double-sided mirror printing.', 220.00, 1, 0, 1),
(12, 'prod-12', 3, 'Stickers Printing Dubai', 'stickers-printing-dubai', 'Waterproof vinyl die-cut stickers, kiss-cut sheets, and metallic foil product labels.', 'Durable weather-resistant vinyl stickers with matte or gloss UV lamination for packaging, windows, and branding.', 40.00, 250, 1, 1),
(13, 'prod-13', 3, 'Name Plate Printing Dubai', 'name-plate-printing-dubai', 'Elegant acrylic, stainless steel, and brass desk & door nameplates with UV printing.', 'Laser-cut clear acrylic or brushed metal door & desk signs with metallic stand-off bolts for modern corporate offices.', 120.00, 1, 0, 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Product Images
INSERT INTO product_images (product_id, image_url, display_order) VALUES
(1, '/assets/products/1 (1).jpg', 1),
(2, '/assets/products/1 (2).jpg', 1),
(3, '/assets/products/1 (3).jpg', 1),
(4, '/assets/products/1 (4).jpg', 1),
(5, '/assets/products/1 (13).jpg', 1),
(6, '/assets/products/1 (5).jpg', 1),
(7, '/assets/products/1 (6).jpg', 1),
(8, '/assets/products/1 (7).jpg', 1),
(9, '/assets/products/1 (8).jpg', 1),
(10, '/assets/products/1 (9).jpg', 1),
(11, '/assets/products/1 (10).jpg', 1),
(12, '/assets/products/1 (11).jpg', 1),
(13, '/assets/products/1 (12).jpg', 1);

-- Services
INSERT INTO services (id, service_key, category_id, name, slug, short_description, description, image, display_order, active) VALUES
(1, 'serv-1', 2, 'Digital & Offset Printing', 'digital-offset-printing', 'High-precision digital and high-volume offset printing with Pantone color matching and crisp CMYK clarity.', 'From short-run express marketing collateral to high-volume commercial runs, our offset and digital presses deliver pin-sharp resolution, Pantone color fidelity, and rapid turnarounds in Dubai.', '/assets/products/1 (7).jpg', 1, 1),
(2, 'serv-2', 1, 'Luxury Packaging & Custom Boxes', 'luxury-packaging-custom-boxes', 'Custom rigid boxes, magnetic gift boxes, folding cartons, and specialty foil-stamped presentation sleeves.', 'Elevate unboxing experiences with custom-engineered rigid gift boxes, velvet interiors, foil debossing, soft-touch laminates, and magnetic closures designed for luxury UAE brands.', '/assets/products/1 (5).jpg', 2, 1),
(3, 'serv-3', 1, 'Corporate Gift Customization', 'corporate-gift-customization', 'Bespoke corporate merchandise, executive desk sets, thermal flasks, custom mugs, and apparel embroidery.', 'Turn everyday corporate giveaways into premium branded keepsakes. Laser engraving, screen printing, and UV printing on stainless steel flasks, leather items, ceramic mugs, and apparel.', '/assets/products/1 (13).jpg', 3, 1),
(4, 'serv-4', 3, 'Large Format & Exhibition Signage', 'large-format-exhibition-signage', 'Roll-up banner stands, pop-up backdrops, outdoor teardrop flags, acrylic nameplates, and wall graphics.', 'Make your brand unmissable at trade shows and events. Durable UV-resistant inks, anti-curl PET film roll-ups, acrylic door plates, and high-impact outdoor promotional banners.', '/assets/products/1 (9).jpg', 4, 1),
(5, 'serv-5', 3, 'Custom Labels & Die-Cut Stickers', 'custom-labels-die-cut-stickers', 'Waterproof vinyl stickers, product packaging labels, gold foil seals, and roll labels.', 'Precision contour-cut stickers and product packaging labels printed on waterproof vinyl, metallic foil, or transparent stock with scratch-resistant matte or gloss UV finish.', '/assets/products/1 (11).jpg', 5, 1),
(6, 'serv-6', 2, 'Executive Business Stationery', 'executive-business-stationery', 'Premium business cards, cotton letterheads, custom envelopes, and luxury foil presentation folders.', 'Leave a lasting impression with 350gsm–400gsm cotton card stocks, edge painting, gold or silver foil embossing, spot UV varnishing, and custom die-cut corporate folders.', '/assets/products/1 (8).jpg', 6, 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);
