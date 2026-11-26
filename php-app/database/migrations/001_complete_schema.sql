-- =====================================================================================
-- ONPRINT — COMPLETE MYSQL 8.0 / MARIADB 10.4+ RELATIONAL DATABASE SCHEMA (50 TABLES)
-- Migrated 1-to-1 from all 43 Mongoose Models + Normalized Relational Child Tables
-- Compatible with Hostinger Shared Hosting (InnoDB, utf8mb4_unicode_ci)
-- =====================================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS & RBAC PERMISSIONS
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `legacy_mongo_id` VARCHAR(64) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(60) DEFAULT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('super_admin', 'admin', 'employee', 'customer') NOT NULL DEFAULT 'customer',
  `permissions` LONGTEXT DEFAULT NULL,
  `is_super_admin` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `last_login_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_users_email` (`email`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. USER SESSIONS
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `token_hash` VARCHAR(128) NOT NULL,
  `ip_address` VARCHAR(64) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_user_sessions_token` (`token_hash`),
  CONSTRAINT `fk_user_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `legacy_mongo_id` VARCHAR(64) DEFAULT NULL,
  `category_key` VARCHAR(120) DEFAULT NULL,
  `department_slug` VARCHAR(120) DEFAULT NULL,
  `department_name` VARCHAR(180) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `display_order` INT NOT NULL DEFAULT 0,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `seo_title` VARCHAR(255) DEFAULT NULL,
  `seo_description` TEXT DEFAULT NULL,
  `seo_keywords` VARCHAR(600) DEFAULT NULL,
  `seo_heading` VARCHAR(255) DEFAULT NULL,
  `canonical_url` VARCHAR(500) DEFAULT NULL,
  `image_alt` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_categories_slug` (`slug`),
  INDEX `idx_categories_active_order` (`active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `legacy_mongo_id` VARCHAR(64) DEFAULT NULL,
  `product_key` VARCHAR(120) DEFAULT NULL,
  `category_id` INT UNSIGNED DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `short_description` TEXT DEFAULT NULL,
  `description` LONGTEXT DEFAULT NULL,
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `minimum_quantity` INT NOT NULL DEFAULT 1,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `specifications` LONGTEXT DEFAULT NULL,
  `features_json` LONGTEXT DEFAULT NULL,
  `faqs_json` LONGTEXT DEFAULT NULL,
  `primary_image` VARCHAR(500) DEFAULT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `seo_title` VARCHAR(255) DEFAULT NULL,
  `seo_description` TEXT DEFAULT NULL,
  `seo_keywords` VARCHAR(600) DEFAULT NULL,
  `seo_heading` VARCHAR(255) DEFAULT NULL,
  `canonical_url` VARCHAR(500) DEFAULT NULL,
  `image_alt` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_products_slug` (`slug`),
  INDEX `idx_products_category` (`category_id`),
  INDEX `idx_products_featured_active` (`active`, `featured`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. PRODUCT IMAGES (Normalized Child Table)
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT UNSIGNED NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `display_order` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_product_images_prod` (`product_id`, `display_order`),
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. PRODUCT SECONDARY CATEGORIES (Pivot Table)
CREATE TABLE IF NOT EXISTS `product_categories` (
  `product_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`product_id`, `category_id`),
  CONSTRAINT `fk_prod_cat_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_prod_cat_category` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. SERVICES
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `legacy_mongo_id` VARCHAR(64) DEFAULT NULL,
  `service_key` VARCHAR(120) DEFAULT NULL,
  `category_id` INT UNSIGNED DEFAULT NULL,
  `category_slug` VARCHAR(255) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `short_description` TEXT DEFAULT NULL,
  `description` LONGTEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `seo_title` VARCHAR(255) DEFAULT NULL,
  `seo_description` TEXT DEFAULT NULL,
  `seo_keywords` VARCHAR(600) DEFAULT NULL,
  `seo_heading` VARCHAR(255) DEFAULT NULL,
  `canonical_url` VARCHAR(500) DEFAULT NULL,
  `image_alt` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_services_slug` (`slug`),
  INDEX `idx_services_active_order` (`active`, `display_order`),
  CONSTRAINT `fk_services_category` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. BLOGS
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `legacy_mongo_id` VARCHAR(64) DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `excerpt` TEXT DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `featured_image` VARCHAR(500) DEFAULT NULL,
  `image_alt` VARCHAR(255) DEFAULT NULL,
  `category_id` INT UNSIGNED DEFAULT NULL,
  `category_name` VARCHAR(180) DEFAULT NULL,
  `category_slug` VARCHAR(180) DEFAULT NULL,
  `product_id` INT UNSIGNED DEFAULT NULL,
  `product_slug` VARCHAR(255) DEFAULT NULL,
  `author_id` INT UNSIGNED DEFAULT NULL,
  `author_name` VARCHAR(150) DEFAULT 'ONPRINT Editorial Team',
  `status` ENUM('draft', 'published', 'scheduled') NOT NULL DEFAULT 'draft',
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `seo_title` VARCHAR(255) DEFAULT NULL,
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `focus_keyword` VARCHAR(255) DEFAULT NULL,
  `secondary_keywords` TEXT DEFAULT NULL,
  `canonical_url` VARCHAR(500) DEFAULT NULL,
  `og_title` VARCHAR(255) DEFAULT NULL,
  `og_description` TEXT DEFAULT NULL,
  `og_image` VARCHAR(500) DEFAULT NULL,
  `schema_type` VARCHAR(80) DEFAULT 'BlogPosting',
  `reading_time` INT NOT NULL DEFAULT 5,
  `target_location` VARCHAR(150) DEFAULT 'Dubai, UAE',
  `robots_index` VARCHAR(30) DEFAULT 'index',
  `robots_follow` VARCHAR(30) DEFAULT 'follow',
  `seo_score` INT NOT NULL DEFAULT 85,
  `readability_score` INT NOT NULL DEFAULT 80,
  `keyword_density` DECIMAL(5, 2) NOT NULL DEFAULT 1.20,
  `word_count` INT NOT NULL DEFAULT 0,
  `seo_suggestions` LONGTEXT DEFAULT NULL,
  `schema_markup` LONGTEXT DEFAULT NULL,
  `faqs` LONGTEXT DEFAULT NULL,
  `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_blogs_slug` (`slug`),
  INDEX `idx_blogs_status_pub` (`status`, `published_at`),
  INDEX `idx_blogs_featured` (`is_featured`),
  CONSTRAINT `fk_blogs_category` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blogs_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blogs_author` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. QUOTES
CREATE TABLE IF NOT EXISTS `quotes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `legacy_mongo_id` VARCHAR(64) DEFAULT NULL,
  `quote_number` VARCHAR(64) NOT NULL,
  `order_number` VARCHAR(64) DEFAULT NULL,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(60) DEFAULT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `specs` TEXT DEFAULT NULL,
  `finishes` LONGTEXT DEFAULT NULL,
  `delivery_urgency` VARCHAR(60) DEFAULT 'Standard',
  `delivery_location` VARCHAR(150) DEFAULT 'Dubai',
  `artwork_file` VARCHAR(500) DEFAULT NULL,
  `artwork_files` LONGTEXT DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `staff_notes` TEXT DEFAULT NULL,
  `formal_pdf_quote` VARCHAR(500) DEFAULT NULL,
  `status` VARCHAR(60) NOT NULL DEFAULT 'New',
  `estimated_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_quotes_number` (`quote_number`),
  INDEX `idx_quotes_status` (`status`),
  INDEX `idx_quotes_email` (`email`),
  CONSTRAINT `fk_quotes_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. QUOTE ITEMS
CREATE TABLE IF NOT EXISTS `quote_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `quote_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED DEFAULT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `options` LONGTEXT DEFAULT NULL,
  CONSTRAINT `fk_quote_items_quote` FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_quote_items_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. CORPORATE QUOTES (B2B Procurement)
CREATE TABLE IF NOT EXISTS `corporate_quotes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `legacy_mongo_id` VARCHAR(64) DEFAULT NULL,
  `reference_number` VARCHAR(64) NOT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `contact_name` VARCHAR(255) NOT NULL,
  `department` VARCHAR(150) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(60) NOT NULL,
  `trade_license_number` VARCHAR(100) DEFAULT NULL,
  `trn_number` VARCHAR(100) DEFAULT NULL,
  `annual_volume_estimate` VARCHAR(150) DEFAULT NULL,
  `credit_terms_requested` VARCHAR(80) DEFAULT 'Prepaid',
  `delivery_locations` LONGTEXT DEFAULT NULL,
  `artwork_files` LONGTEXT DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `status` VARCHAR(80) NOT NULL DEFAULT 'New',
  `assigned_account_manager` VARCHAR(150) DEFAULT 'Senior Corporate Account Executive',
  `staff_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_corp_quotes_ref` (`reference_number`),
  INDEX `idx_corp_quotes_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. CORPORATE QUOTE ITEMS
CREATE TABLE IF NOT EXISTS `corporate_quote_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `corporate_quote_id` INT UNSIGNED NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `specifications` TEXT DEFAULT NULL,
  `estimated_frequency` VARCHAR(80) DEFAULT 'One-off',
  CONSTRAINT `fk_corp_items_quote` FOREIGN KEY (`corporate_quote_id`) REFERENCES `corporate_quotes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. ORDERS
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `legacy_mongo_id` VARCHAR(64) DEFAULT NULL,
  `order_number` VARCHAR(64) NOT NULL,
  `quote_id` INT UNSIGNED DEFAULT NULL,
  `quote_number` VARCHAR(64) DEFAULT NULL,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_email` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(60) DEFAULT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `shipping_address` TEXT DEFAULT NULL,
  `delivery_location` VARCHAR(180) DEFAULT 'Dubai, UAE',
  `product_name` VARCHAR(255) DEFAULT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `status` VARCHAR(80) NOT NULL DEFAULT 'Pending',
  `stage_index` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `payment_status` VARCHAR(50) NOT NULL DEFAULT 'unpaid',
  `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `tax` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `shipping` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'AED',
  `notes` TEXT DEFAULT NULL,
  `specs` TEXT DEFAULT NULL,
  `artwork_file` VARCHAR(500) DEFAULT NULL,
  `proof_url` VARCHAR(500) DEFAULT NULL,
  `guest_token` VARCHAR(100) DEFAULT NULL,
  `courier_partner` VARCHAR(150) DEFAULT 'ONPRINT Express Courier',
  `tracking_number` VARCHAR(120) DEFAULT NULL,
  `estimated_delivery` VARCHAR(120) DEFAULT NULL,
  `artwork_approved_at` DATETIME DEFAULT NULL,
  `dispatched_at` DATETIME DEFAULT NULL,
  `delivered_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_orders_number` (`order_number`),
  INDEX `idx_orders_status` (`status`),
  INDEX `idx_orders_email` (`customer_email`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_orders_quote` FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. ORDER ITEMS
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED DEFAULT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. PRODUCT REVIEWS
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `legacy_mongo_id` VARCHAR(64) DEFAULT NULL,
  `product_id` INT UNSIGNED DEFAULT NULL,
  `product_slug` VARCHAR(255) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT 'General Commercial Print',
  `customer_name` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `rating` TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `title` VARCHAR(255) NOT NULL,
  `comment` TEXT NOT NULL,
  `verified_purchase` TINYINT(1) NOT NULL DEFAULT 0,
  `order_number` VARCHAR(64) DEFAULT NULL,
  `status` ENUM('pending', 'approved', 'flagged', 'rejected') NOT NULL DEFAULT 'approved',
  `helpful_votes` INT UNSIGNED NOT NULL DEFAULT 0,
  `staff_response_text` TEXT DEFAULT NULL,
  `staff_responder_name` VARCHAR(150) DEFAULT NULL,
  `staff_responded_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_reviews_slug_status` (`product_slug`, `status`),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. PORTFOLIO PROJECTS
CREATE TABLE IF NOT EXISTS `portfolio_projects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_key` VARCHAR(120) DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `project_name` VARCHAR(255) DEFAULT NULL,
  `client` VARCHAR(255) DEFAULT NULL,
  `industry` VARCHAR(150) DEFAULT NULL,
  `category` VARCHAR(150) NOT NULL DEFAULT 'Business Cards & Stationery',
  `service_provided` VARCHAR(255) DEFAULT NULL,
  `challenge` TEXT DEFAULT NULL,
  `solution` TEXT DEFAULT NULL,
  `specs` TEXT DEFAULT NULL,
  `materials_and_finishes` TEXT DEFAULT NULL,
  `result` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `related_service_name` VARCHAR(180) DEFAULT NULL,
  `related_service_url` VARCHAR(500) DEFAULT NULL,
  `related_product_name` VARCHAR(180) DEFAULT NULL,
  `related_product_url` VARCHAR(500) DEFAULT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_portfolio_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `legacy_mongo_id` VARCHAR(64) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(60) DEFAULT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `subject` VARCHAR(255) DEFAULT 'Direct Studio Inquiry',
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_contact_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'subscribed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_newsletter_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. SITE SETTINGS
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(120) NOT NULL,
  `setting_value` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_site_settings_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. NOTIFICATION LOGS
CREATE TABLE IF NOT EXISTS `notification_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `idempotency_key` VARCHAR(190) DEFAULT NULL,
  `event_type` VARCHAR(80) NOT NULL,
  `recipient_email` VARCHAR(255) NOT NULL,
  `recipient_phone` VARCHAR(60) DEFAULT NULL,
  `recipient_name` VARCHAR(255) DEFAULT NULL,
  `reference_number` VARCHAR(100) DEFAULT NULL,
  `channel` VARCHAR(40) NOT NULL DEFAULT 'email',
  `subject` VARCHAR(255) DEFAULT NULL,
  `payload_summary` LONGTEXT DEFAULT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'sent',
  `provider_message_id` VARCHAR(150) DEFAULT NULL,
  `error_message` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_notif_idempotency` (`idempotency_key`),
  INDEX `idx_notif_event_ref` (`event_type`, `reference_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. PAGE SEO REGISTRY
CREATE TABLE IF NOT EXISTS `page_seo` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `page_type` VARCHAR(60) NOT NULL DEFAULT 'static',
  `page_id` INT UNSIGNED DEFAULT NULL,
  `url` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(255) DEFAULT NULL,
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `focus_keyword` VARCHAR(255) DEFAULT NULL,
  `secondary_keywords` TEXT DEFAULT NULL,
  `h1` VARCHAR(255) DEFAULT NULL,
  `seo_content` LONGTEXT DEFAULT NULL,
  `canonical_url` VARCHAR(500) DEFAULT NULL,
  `robots_index` VARCHAR(30) NOT NULL DEFAULT 'index',
  `robots_follow` VARCHAR(30) NOT NULL DEFAULT 'follow',
  `og_title` VARCHAR(255) DEFAULT NULL,
  `og_description` TEXT DEFAULT NULL,
  `og_image` VARCHAR(500) DEFAULT NULL,
  `twitter_title` VARCHAR(255) DEFAULT NULL,
  `twitter_description` TEXT DEFAULT NULL,
  `twitter_image` VARCHAR(500) DEFAULT NULL,
  `schema_type` VARCHAR(80) DEFAULT 'WebPage',
  `schema_markup` LONGTEXT DEFAULT NULL,
  `breadcrumbs_json` LONGTEXT DEFAULT NULL,
  `seo_score` INT NOT NULL DEFAULT 88,
  `readability_score` INT NOT NULL DEFAULT 82,
  `search_intent` VARCHAR(60) DEFAULT 'Commercial',
  `focus_entity` VARCHAR(255) DEFAULT NULL,
  `related_entities` TEXT DEFAULT NULL,
  `faq_content` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_page_seo_url` (`url`(250)),
  INDEX `idx_page_seo_type` (`page_type`),
  INDEX `idx_page_seo_keyword` (`focus_keyword`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. PAGE SEO HISTORY
CREATE TABLE IF NOT EXISTS `page_seo_history` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `page_seo_id` INT UNSIGNED NOT NULL,
  `page_url` VARCHAR(500) NOT NULL,
  `field_changed` VARCHAR(100) NOT NULL,
  `old_value` LONGTEXT DEFAULT NULL,
  `new_value` LONGTEXT DEFAULT NULL,
  `changed_by` VARCHAR(150) DEFAULT 'Admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_page_seo_hist_pid` (`page_seo_id`),
  CONSTRAINT `fk_page_seo_hist_page` FOREIGN KEY (`page_seo_id`) REFERENCES `page_seo`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. SEO KEYWORDS
CREATE TABLE IF NOT EXISTS `seo_keywords` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `keyword` VARCHAR(255) NOT NULL,
  `keyword_type` VARCHAR(40) NOT NULL DEFAULT 'primary',
  `search_intent` VARCHAR(60) NOT NULL DEFAULT 'Commercial',
  `cluster` VARCHAR(180) NOT NULL DEFAULT 'General',
  `target_url` VARCHAR(500) DEFAULT NULL,
  `target_page` VARCHAR(255) DEFAULT NULL,
  `priority` VARCHAR(30) NOT NULL DEFAULT 'Medium',
  `status` VARCHAR(50) NOT NULL DEFAULT 'Planned',
  `notes` TEXT DEFAULT NULL,
  `content_type` VARCHAR(100) DEFAULT NULL,
  `assigned_page` VARCHAR(500) DEFAULT NULL,
  `category` VARCHAR(150) DEFAULT NULL,
  `country` VARCHAR(100) DEFAULT 'UAE',
  `city` VARCHAR(100) DEFAULT 'Dubai',
  `current_ranking` INT DEFAULT NULL,
  `previous_ranking` INT DEFAULT NULL,
  `search_volume` INT DEFAULT NULL,
  `cpc` DECIMAL(8, 2) DEFAULT NULL,
  `competition` VARCHAR(50) DEFAULT NULL,
  `last_checked` DATE DEFAULT NULL,
  `ranking_change` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_seo_keywords_kw` (`keyword`),
  INDEX `idx_seo_kw_cluster` (`cluster`),
  INDEX `idx_seo_kw_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 24. SEO KEYWORD SNAPSHOTS
CREATE TABLE IF NOT EXISTS `seo_keyword_snapshots` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `query` VARCHAR(255) NOT NULL,
  `page_url` VARCHAR(500) DEFAULT NULL,
  `clicks` INT NOT NULL DEFAULT 0,
  `impressions` INT NOT NULL DEFAULT 0,
  `ctr` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
  `position` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
  `previous_position` DECIMAL(6, 2) DEFAULT NULL,
  `opportunity_type` VARCHAR(80) DEFAULT NULL,
  `snapshot_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_kw_snap_date` (`snapshot_date`),
  INDEX `idx_kw_snap_query` (`query`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 25. SEO PAGE METRICS
CREATE TABLE IF NOT EXISTS `seo_page_metrics` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `page_url` VARCHAR(500) NOT NULL,
  `clicks` INT NOT NULL DEFAULT 0,
  `impressions` INT NOT NULL DEFAULT 0,
  `ctr` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
  `position` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
  `snapshot_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_page_metric_url` (`page_url`(191), `snapshot_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 26. SEO BACKLINKS (with Toxic Forensics Classification)
CREATE TABLE IF NOT EXISTS `seo_backlinks` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `linking_domain` VARCHAR(255) NOT NULL,
  `linking_url` VARCHAR(1000) NOT NULL,
  `target_url` VARCHAR(500) NOT NULL,
  `anchor_text` VARCHAR(500) DEFAULT NULL,
  `link_type` VARCHAR(50) NOT NULL DEFAULT 'unknown',
  `status` VARCHAR(50) NOT NULL DEFAULT 'needs_review',
  `authority` DECIMAL(6, 2) DEFAULT NULL,
  `relevance` VARCHAR(50) DEFAULT 'unknown',
  `toxic_risk` VARCHAR(50) DEFAULT 'unknown',
  `classification` VARCHAR(60) DEFAULT 'needs_review',
  `recommended_action` VARCHAR(80) DEFAULT 'keep',
  `review_decision` VARCHAR(60) DEFAULT 'pending',
  `first_discovered_at` DATE DEFAULT NULL,
  `last_checked_at` DATE DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_backlink_domain` (`linking_domain`),
  INDEX `idx_backlink_status` (`status`),
  INDEX `idx_backlink_risk` (`toxic_risk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 27. SEO BACKLINK REMOVAL REQUESTS
CREATE TABLE IF NOT EXISTS `seo_backlink_removal_requests` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `domain` VARCHAR(255) NOT NULL,
  `linking_url` VARCHAR(1000) DEFAULT NULL,
  `contact_email` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(60) NOT NULL DEFAULT 'draft',
  `sent_at` DATETIME DEFAULT NULL,
  `follow_up_at` DATETIME DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_removal_domain` (`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 28. SEO DISAVOW VERSIONS
CREATE TABLE IF NOT EXISTS `seo_disavow_versions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `version_label` VARCHAR(100) NOT NULL,
  `domains_count` INT NOT NULL DEFAULT 0,
  `urls_count` INT NOT NULL DEFAULT 0,
  `file_content` LONGTEXT NOT NULL,
  `generated_by` VARCHAR(150) DEFAULT 'Admin',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 29. SEO OUTREACH PROSPECTS (General & Business Card Link Building)
CREATE TABLE IF NOT EXISTS `seo_outreach_prospects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `prospect_group` VARCHAR(60) NOT NULL DEFAULT 'general',
  `website_name` VARCHAR(255) DEFAULT NULL,
  `website_domain` VARCHAR(255) NOT NULL,
  `website_url` VARCHAR(1000) DEFAULT NULL,
  `contact_name` VARCHAR(255) DEFAULT NULL,
  `contact_email` VARCHAR(255) DEFAULT NULL,
  `website_category` VARCHAR(150) DEFAULT NULL,
  `relevance` VARCHAR(50) DEFAULT 'High',
  `authority` DECIMAL(6, 2) DEFAULT NULL,
  `outreach_status` VARCHAR(60) NOT NULL DEFAULT 'Prospect',
  `date_contacted` DATE DEFAULT NULL,
  `follow_up_date` DATE DEFAULT NULL,
  `response` TEXT DEFAULT NULL,
  `link_obtained` TINYINT(1) NOT NULL DEFAULT 0,
  `target_url` VARCHAR(500) DEFAULT NULL,
  `anchor_text` VARCHAR(500) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_outreach_status` (`outreach_status`),
  INDEX `idx_outreach_group` (`prospect_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 30. BACKLINK OPPORTUNITIES (150 UAE Opportunities)
CREATE TABLE IF NOT EXISTS `backlink_opportunities` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `website_name` VARCHAR(255) NOT NULL,
  `domain` VARCHAR(255) NOT NULL,
  `website_url` VARCHAR(1000) NOT NULL,
  `category` VARCHAR(150) NOT NULL,
  `submission_method` VARCHAR(150) NOT NULL DEFAULT 'Online Form',
  `domain_authority` INT NOT NULL DEFAULT 0,
  `priority` VARCHAR(30) NOT NULL DEFAULT 'Medium',
  `country` VARCHAR(100) DEFAULT 'UAE',
  `city` VARCHAR(100) DEFAULT 'Dubai',
  `relevance` VARCHAR(50) DEFAULT 'High',
  `link_type` VARCHAR(100) DEFAULT NULL,
  `follow_type` VARCHAR(50) DEFAULT 'Follow',
  `contact_url` VARCHAR(1000) DEFAULT NULL,
  `submission_url` VARCHAR(1000) DEFAULT NULL,
  `target_url` VARCHAR(500) NOT NULL,
  `target_anchor_text` VARCHAR(500) DEFAULT NULL,
  `status` VARCHAR(60) NOT NULL DEFAULT 'Planned',
  `date_added` DATE DEFAULT NULL,
  `date_submitted` DATE DEFAULT NULL,
  `date_live` DATE DEFAULT NULL,
  `live_url` VARCHAR(1000) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_bo_domain` (`domain`),
  INDEX `idx_bo_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 31. SEO BACKLINK OPPORTUNITIES 200 (B1–B10)
CREATE TABLE IF NOT EXISTS `seo_backlink_opportunities_200` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `website` VARCHAR(255) NOT NULL,
  `domain` VARCHAR(255) NOT NULL,
  `url` VARCHAR(1000) NOT NULL,
  `country` VARCHAR(100) DEFAULT 'United Arab Emirates',
  `city` VARCHAR(100) DEFAULT 'Dubai',
  `industry` VARCHAR(150) NOT NULL,
  `relevance` VARCHAR(50) DEFAULT 'High',
  `link_opportunity` VARCHAR(255) NOT NULL,
  `submission_url` VARCHAR(1000) DEFAULT NULL,
  `contact_url` VARCHAR(1000) DEFAULT NULL,
  `link_type` VARCHAR(100) DEFAULT 'Directory Profile',
  `follow_type` VARCHAR(50) DEFAULT 'Follow',
  `target_onprint_url` VARCHAR(500) NOT NULL,
  `anchor_text` VARCHAR(500) DEFAULT NULL,
  `status` VARCHAR(60) NOT NULL DEFAULT 'Prospect',
  `date` DATE DEFAULT NULL,
  `link_url` VARCHAR(1000) DEFAULT NULL,
  `link_attribute` VARCHAR(50) DEFAULT 'follow',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_bo200_domain` (`domain`),
  INDEX `idx_bo200_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 32. SEO COMPETITOR RECORDS
CREATE TABLE IF NOT EXISTS `seo_competitor_records` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `competitor_name` VARCHAR(255) NOT NULL,
  `competitor_url` VARCHAR(500) DEFAULT NULL,
  `record_type` VARCHAR(80) NOT NULL,
  `keyword` VARCHAR(255) DEFAULT NULL,
  `source_url` VARCHAR(1000) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `imported_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_comp_name` (`competitor_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 33. SEO COMPETITOR GAPS
CREATE TABLE IF NOT EXISTS `seo_competitor_gaps` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `competitor_url` VARCHAR(500) NOT NULL,
  `competitor_topic` VARCHAR(255) NOT NULL,
  `onprint_url` VARCHAR(500) NOT NULL,
  `missing_topic` VARCHAR(255) NOT NULL,
  `keyword_opportunity` VARCHAR(255) NOT NULL,
  `search_intent` VARCHAR(60) DEFAULT 'Commercial',
  `recommended_content` TEXT DEFAULT NULL,
  `internal_link_opportunity` VARCHAR(500) DEFAULT NULL,
  `geo_opportunity` TEXT DEFAULT NULL,
  `priority` VARCHAR(30) DEFAULT 'Medium',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_comp_gap_kw` (`keyword_opportunity`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 34. SEO AI VISIBILITY TRACKING
CREATE TABLE IF NOT EXISTS `seo_ai_visibility_tracking` (
  `id` VARCHAR(100) PRIMARY KEY,
  `query` VARCHAR(500) NOT NULL,
  `cluster` VARCHAR(255) DEFAULT NULL,
  `intent` VARCHAR(100) DEFAULT NULL,
  `target_page` VARCHAR(255) DEFAULT NULL,
  `target_url` VARCHAR(500) DEFAULT NULL,
  `overall_visibility_score` INT NOT NULL DEFAULT 0,
  `status` VARCHAR(100) DEFAULT 'Dominant Citation',
  `last_tested` DATE DEFAULT NULL,
  `engines_json` LONGTEXT DEFAULT NULL,
  `key_entities_extracted` LONGTEXT DEFAULT NULL,
  `recommended_action` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_ai_vis_cluster` (`cluster`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 35. GEO FAQS
CREATE TABLE IF NOT EXISTS `geo_faqs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `question` TEXT NOT NULL,
  `answer` LONGTEXT NOT NULL,
  `category` VARCHAR(150) NOT NULL DEFAULT 'General',
  `related_service` VARCHAR(255) DEFAULT NULL,
  `related_keyword` VARCHAR(255) DEFAULT NULL,
  `target_url` VARCHAR(500) DEFAULT NULL,
  `search_intent` VARCHAR(60) DEFAULT 'Commercial',
  `status` VARCHAR(50) NOT NULL DEFAULT 'published',
  `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_geo_faq_cat` (`category`),
  INDEX `idx_geo_faq_url` (`target_url`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 36. GEO CONTENT KNOWLEDGE RECORDS
CREATE TABLE IF NOT EXISTS `geo_content` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `topic` VARCHAR(255) NOT NULL,
  `question` TEXT NOT NULL,
  `answer` LONGTEXT NOT NULL,
  `target_keyword` VARCHAR(255) DEFAULT NULL,
  `entity` VARCHAR(150) DEFAULT 'ONPRINT',
  `target_url` VARCHAR(500) DEFAULT NULL,
  `related_service` VARCHAR(255) DEFAULT NULL,
  `faq` TINYINT(1) NOT NULL DEFAULT 1,
  `source` VARCHAR(255) DEFAULT 'ONPRINT Pressroom Operations Manual',
  `author` VARCHAR(150) DEFAULT 'ONPRINT Technical Team',
  `status` VARCHAR(50) NOT NULL DEFAULT 'published',
  `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_geo_content_topic` (`topic`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 37. GEO CITATION LOGS
CREATE TABLE IF NOT EXISTS `geo_citation_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `query` VARCHAR(500) NOT NULL,
  `date_checked` DATE NOT NULL,
  `platform` VARCHAR(100) NOT NULL,
  `onprint_mentioned` TINYINT(1) NOT NULL DEFAULT 0,
  `onprint_url` VARCHAR(500) DEFAULT NULL,
  `citation_source` VARCHAR(500) DEFAULT NULL,
  `competitors_mentioned` LONGTEXT DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_geo_cit_platform` (`platform`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 38. GEO COMPETITOR AUDITS
CREATE TABLE IF NOT EXISTS `geo_competitor_audits` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `competitor_url` VARCHAR(1000) NOT NULL,
  `competitor_name` VARCHAR(255) DEFAULT NULL,
  `analysis_json` LONGTEXT DEFAULT NULL,
  `recommendations_json` LONGTEXT DEFAULT NULL,
  `audited_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 39. SEO REDIRECTS (301/302 Manager)
CREATE TABLE IF NOT EXISTS `seo_redirects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `old_url` VARCHAR(500) NOT NULL,
  `new_url` VARCHAR(500) NOT NULL,
  `redirect_type` ENUM('301', '302', '307') NOT NULL DEFAULT '301',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `hit_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_seo_redirect_old` (`old_url`(250)),
  INDEX `idx_seo_redirect_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 40. SEO BRAND MENTIONS
CREATE TABLE IF NOT EXISTS `seo_brand_mentions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `mention_source` VARCHAR(255) NOT NULL,
  `source_url` VARCHAR(1000) NOT NULL,
  `brand_query` VARCHAR(120) DEFAULT 'ONPRINT',
  `snippet` TEXT DEFAULT NULL,
  `has_link` TINYINT(1) NOT NULL DEFAULT 0,
  `linking_url` VARCHAR(500) DEFAULT NULL,
  `domain_authority` INT NOT NULL DEFAULT 30,
  `sentiment` VARCHAR(40) DEFAULT 'positive',
  `outreach_status` VARCHAR(60) NOT NULL DEFAULT 'uncontacted',
  `notes` TEXT DEFAULT NULL,
  `date_discovered` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_bm_status` (`outreach_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 41. SEO EXPERIMENTS (A/B Testing)
CREATE TABLE IF NOT EXISTS `seo_experiments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `page_url` VARCHAR(500) NOT NULL,
  `test_type` VARCHAR(60) NOT NULL,
  `control_value` TEXT NOT NULL,
  `variant_value` TEXT NOT NULL,
  `hypothesis` TEXT DEFAULT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'running',
  `start_date` DATE NOT NULL,
  `end_date` DATE DEFAULT NULL,
  `baseline_clicks` INT NOT NULL DEFAULT 0,
  `baseline_impressions` INT NOT NULL DEFAULT 0,
  `baseline_ctr` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
  `variant_clicks` INT NOT NULL DEFAULT 0,
  `variant_impressions` INT NOT NULL DEFAULT 0,
  `variant_ctr` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
  `winner` VARCHAR(40) DEFAULT 'inconclusive',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_seo_exp_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 42. SEO CONVERSIONS (Strict Funnel Separation)
CREATE TABLE IF NOT EXISTS `seo_conversions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `conversion_type` VARCHAR(60) NOT NULL,
  `landing_page` VARCHAR(500) DEFAULT NULL,
  `referrer` VARCHAR(500) DEFAULT NULL,
  `source_label` VARCHAR(150) DEFAULT NULL,
  `product_name` VARCHAR(200) DEFAULT NULL,
  `button_location` VARCHAR(120) DEFAULT NULL,
  `device_category` VARCHAR(40) DEFAULT 'desktop',
  `query_string` VARCHAR(255) DEFAULT NULL,
  `ip_hash` VARCHAR(64) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_conv_type` (`conversion_type`),
  INDEX `idx_conv_page` (`landing_page`(191)),
  INDEX `idx_conv_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 43. SEO CONTENT DECAY
CREATE TABLE IF NOT EXISTS `seo_content_decay` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `page_url` VARCHAR(500) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `page_type` VARCHAR(60) DEFAULT 'service',
  `previous_clicks` INT NOT NULL DEFAULT 0,
  `current_clicks` INT NOT NULL DEFAULT 0,
  `clicks_change_pct` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
  `previous_impressions` INT NOT NULL DEFAULT 0,
  `current_impressions` INT NOT NULL DEFAULT 0,
  `impressions_change_pct` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
  `decay_severity` VARCHAR(40) DEFAULT 'MEDIUM',
  `recommended_action` TEXT DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'needs_refresh',
  `last_audited` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_decay_severity` (`decay_severity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 44. SEO TASKS
CREATE TABLE IF NOT EXISTS `seo_tasks` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `category` VARCHAR(60) DEFAULT 'onpage',
  `priority` VARCHAR(30) DEFAULT 'medium',
  `status` VARCHAR(40) NOT NULL DEFAULT 'pending',
  `assigned_to` VARCHAR(120) DEFAULT 'Admin',
  `due_date` DATE DEFAULT NULL,
  `completed_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_seo_tasks_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 45. SEO SETTINGS
CREATE TABLE IF NOT EXISTS `seo_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(120) NOT NULL,
  `setting_value` LONGTEXT DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_seo_settings_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 46. SEO AUDITS
CREATE TABLE IF NOT EXISTS `seo_audits` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `health_score` INT NOT NULL DEFAULT 0,
  `technical_score` INT NOT NULL DEFAULT 0,
  `onpage_score` INT NOT NULL DEFAULT 0,
  `content_score` INT NOT NULL DEFAULT 0,
  `structured_data_score` INT NOT NULL DEFAULT 0,
  `total_pages_scanned` INT NOT NULL DEFAULT 0,
  `issues_count` INT NOT NULL DEFAULT 0,
  `summary_json` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 47. SEO ISSUES
CREATE TABLE IF NOT EXISTS `seo_issues` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `audit_id` INT UNSIGNED DEFAULT NULL,
  `entity_type` VARCHAR(60) NOT NULL,
  `entity_id` INT UNSIGNED DEFAULT NULL,
  `url` VARCHAR(500) DEFAULT NULL,
  `issue_type` VARCHAR(100) NOT NULL,
  `category` VARCHAR(60) DEFAULT 'onpage',
  `severity` VARCHAR(30) DEFAULT 'medium',
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `recommendation` TEXT DEFAULT NULL,
  `resolved` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_seo_issues_severity` (`severity`, `resolved`),
  CONSTRAINT `fk_seo_issues_audit` FOREIGN KEY (`audit_id`) REFERENCES `seo_audits`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 48. SEO RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS `seo_recommendations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `page_url` VARCHAR(500) NOT NULL,
  `entity_type` VARCHAR(60) DEFAULT 'page',
  `entity_id` INT UNSIGNED DEFAULT NULL,
  `target_type` VARCHAR(60) DEFAULT NULL,
  `target_field` VARCHAR(80) DEFAULT NULL,
  `target_name` VARCHAR(255) DEFAULT NULL,
  `target_url` VARCHAR(500) DEFAULT NULL,
  `issue` VARCHAR(255) NOT NULL,
  `priority` VARCHAR(30) DEFAULT 'MEDIUM',
  `status` VARCHAR(40) NOT NULL DEFAULT 'PENDING',
  `current_value` LONGTEXT DEFAULT NULL,
  `proposed_value` LONGTEXT DEFAULT NULL,
  `recommended_value` LONGTEXT DEFAULT NULL,
  `reason` TEXT DEFAULT NULL,
  `expected_benefit` TEXT DEFAULT NULL,
  `confidence` DECIMAL(4, 2) DEFAULT 0.88,
  `keywords` LONGTEXT DEFAULT NULL,
  `internal_link_suggestions` LONGTEXT DEFAULT NULL,
  `reviewed_at` DATETIME DEFAULT NULL,
  `applied_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_seo_rec_status` (`status`, `priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 49. SEO CHANGES & DAILY REPORTS
CREATE TABLE IF NOT EXISTS `seo_changes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `recommendation_id` INT UNSIGNED DEFAULT NULL,
  `entity_type` VARCHAR(60) NOT NULL,
  `entity_id` INT UNSIGNED DEFAULT NULL,
  `page_url` VARCHAR(500) NOT NULL,
  `change_type` VARCHAR(80) NOT NULL,
  `old_value` LONGTEXT DEFAULT NULL,
  `new_value` LONGTEXT DEFAULT NULL,
  `ai_reason` TEXT DEFAULT NULL,
  `ai_model` VARCHAR(80) DEFAULT 'onprint-seo-engine',
  `approved_by` VARCHAR(120) DEFAULT 'Admin',
  `approved_at` DATETIME DEFAULT NULL,
  `applied_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(40) NOT NULL DEFAULT 'applied',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_seo_changes_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `seo_daily_reports` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `report_date` DATE NOT NULL,
  `health_score` INT NOT NULL DEFAULT 0,
  `technical_score` INT NOT NULL DEFAULT 0,
  `onpage_score` INT NOT NULL DEFAULT 0,
  `content_score` INT NOT NULL DEFAULT 0,
  `structured_data_score` INT NOT NULL DEFAULT 0,
  `total_pages_scanned` INT NOT NULL DEFAULT 0,
  `critical_issues` INT NOT NULL DEFAULT 0,
  `high_issues` INT NOT NULL DEFAULT 0,
  `medium_issues` INT NOT NULL DEFAULT 0,
  `low_issues` INT NOT NULL DEFAULT 0,
  `pending_recommendations` INT NOT NULL DEFAULT 0,
  `applied_changes_today` INT NOT NULL DEFAULT 0,
  `organic_clicks` INT NOT NULL DEFAULT 0,
  `organic_impressions` INT NOT NULL DEFAULT 0,
  `clicks` INT NOT NULL DEFAULT 0,
  `impressions` INT NOT NULL DEFAULT 0,
  `ctr` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
  `avg_position` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
  `top_gaining_keywords` LONGTEXT DEFAULT NULL,
  `top_losing_keywords` LONGTEXT DEFAULT NULL,
  `top_opportunities` LONGTEXT DEFAULT NULL,
  `technical_issues` LONGTEXT DEFAULT NULL,
  `content_opportunities` LONGTEXT DEFAULT NULL,
  `ai_recommendations` LONGTEXT DEFAULT NULL,
  `changes_applied` LONGTEXT DEFAULT NULL,
  `changes_pending` LONGTEXT DEFAULT NULL,
  `executive_summary` TEXT DEFAULT NULL,
  `report_summary` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_seo_daily_date` (`report_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 50. SEO INTEGRATIONS & ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS `seo_integrations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `integration_name` VARCHAR(120) NOT NULL,
  `is_connected` TINYINT(1) NOT NULL DEFAULT 0,
  `config` LONGTEXT DEFAULT NULL,
  `last_synced_at` DATETIME DEFAULT NULL,
  `error_message` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_seo_integration_name` (`integration_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `seo_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `event_type` VARCHAR(80) NOT NULL,
  `status` VARCHAR(40) DEFAULT 'info',
  `message` TEXT NOT NULL,
  `details` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_seo_logs_event` (`event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
