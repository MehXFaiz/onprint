const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'onprintdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

async function columnExists(connection, tableName, columnName) {
  try {
    const [rows] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [process.env.DB_NAME || 'onprintdb', tableName, columnName]
    )
    return rows.length > 0
  } catch {
    return false
  }
}

async function addColumnIfMissing(connection, tableName, columnName, columnDefinition) {
  try {
    const exists = await columnExists(connection, tableName, columnName)
    if (!exists) {
      await connection.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${columnDefinition}`)
      console.log(`[Database Migration] Added column '${columnName}' to table '${tableName}'`)
    }
  } catch (err) {
    console.warn(`[Database Migration Note] '${tableName}.${columnName}':`, err.message)
  }
}



const seedCategoriesList = [
  {
    category_key: 'cat-brochures-printing',
    name: 'Brochures Printing',
    slug: 'brochures-printing',
    description: 'Premium corporate bi-fold, tri-fold, and multi-page marketing brochures printed on luxury coated art paper with precision folding and finishing.',
    image: '/uploads/categories/brochures-printing.jpg',
    image_url: '/uploads/categories/brochures-printing.jpg',
    status: 'active',
    display_order: 1,
    active: 1,
    seo_title: 'Brochures Printing in Dubai | Premium Brochure Printing | ONPRINT',
    seo_description: 'Professional brochure printing in Dubai. Custom bi-fold, tri-fold, and multi-page brochures with soft-touch matte lamination and fast turnaround.',
    seo_keywords: 'brochures printing dubai, brochure printing dubai, corporate brochures uae, custom bi fold brochures',
    seo_heading: 'Commercial Brochure Printing in Dubai',
    canonical_url: 'https://0nprint.com/categories/brochures-printing',
    image_alt: 'Professional commercial printed brochures in Dubai',
  },
  {
    category_key: 'cat-business-cards-printing',
    name: 'Business Cards Printing',
    slug: 'business-cards-printing',
    description: 'Executive 350gsm to 600gsm cotton and silk business cards with soft-touch velvet lamination, metallic gold foil stamping, and painted edges.',
    image: '/uploads/categories/business-cards-printing.jpg',
    image_url: '/uploads/categories/business-cards-printing.jpg',
    status: 'active',
    display_order: 2,
    active: 1,
    seo_title: 'Business Card Printing in Dubai | Luxury Business Cards | ONPRINT',
    seo_description: 'Make an undeniable first impression with luxury business cards in Dubai. 350gsm–600gsm cotton stocks, gold foil stamping, and spot UV varnishing.',
    seo_keywords: 'business cards printing dubai, luxury business cards dubai, executive visiting cards uae',
    seo_heading: 'Luxury Executive Business Card Printing in Dubai',
    canonical_url: 'https://0nprint.com/categories/business-cards-printing',
    image_alt: 'Luxury gold foil executive business cards in Dubai',
  },
  {
    category_key: 'cat-flyers-printing-in-dubai',
    name: 'Flyers Printing In Dubai',
    slug: 'flyers-printing-in-dubai',
    description: 'High-impact commercial marketing flyers printed on 170gsm–300gsm gloss or matte art paper with vibrant CMYK Pantone color fidelity.',
    image: '/uploads/categories/flyers-printing-in-dubai.jpg',
    image_url: '/uploads/categories/flyers-printing-in-dubai.jpg',
    status: 'active',
    display_order: 3,
    active: 1,
    seo_title: 'Flyer Printing in Dubai | Same Day Marketing Flyer Printing | ONPRINT',
    seo_description: 'Order custom marketing flyer printing in Dubai. Single and double-sided promo flyers on premium art paper with express same-day delivery.',
    seo_keywords: 'flyers printing in dubai, flyer printing dubai, promotional flyers uae, marketing leaflets dubai',
    seo_heading: 'High-Impact Marketing Flyer Printing in Dubai',
    canonical_url: 'https://0nprint.com/categories/flyers-printing-in-dubai',
    image_alt: 'Full color commercial marketing flyers printed in Dubai',
  },
  {
    category_key: 'cat-id-card-printing-dubai',
    name: 'ID Card Printing Dubai',
    slug: 'id-card-printing-dubai',
    description: 'Secure CR80 standard PVC employee identity cards with high-definition thermal printing, smart chips, magnetic strips, and barcodes.',
    image: '/uploads/categories/id-card-printing-dubai.jpg',
    image_url: '/uploads/categories/id-card-printing-dubai.jpg',
    status: 'active',
    display_order: 4,
    active: 1,
    seo_title: 'ID Card Printing Dubai | Corporate Employee & PVC Cards | ONPRINT',
    seo_description: 'High-security corporate PVC ID card printing in Dubai. Crisp photo resolution, smart NFC chips, barcodes, and custom lanyards for UAE businesses.',
    seo_keywords: 'id card printing dubai, pvc id cards dubai, corporate employee badges uae, student id card printing',
    seo_heading: 'Corporate PVC ID Card Printing Solutions Dubai',
    canonical_url: 'https://0nprint.com/categories/id-card-printing-dubai',
    image_alt: 'Corporate employee PVC identity cards with chips in Dubai',
  },
  {
    category_key: 'cat-lanyard-printing-dubai',
    name: 'Lanyard Printing Dubai',
    slug: 'lanyard-printing-dubai',
    description: 'Custom branded satin and woven polyester neck lanyards with screen printing, safety breakaway clips, and heavy-duty metal swivel hooks.',
    image: '/uploads/categories/lanyard-printing-dubai.jpg',
    image_url: '/uploads/categories/lanyard-printing-dubai.jpg',
    status: 'active',
    display_order: 5,
    active: 1,
    seo_title: 'Lanyard Printing Dubai | Custom Branded Neck Lanyards | ONPRINT',
    seo_description: 'Custom branded neck lanyard printing in Dubai. High-density polyester and satin lanyards with safety buckles and swivel hooks for corporate events.',
    seo_keywords: 'lanyard printing dubai, custom lanyards dubai, branded neck straps uae, event lanyards dubai',
    seo_heading: 'Custom Branded Neck Lanyard Printing in Dubai',
    canonical_url: 'https://0nprint.com/categories/lanyard-printing-dubai',
    image_alt: 'Custom branded corporate neck lanyards in Dubai',
  },
  {
    category_key: 'cat-letterheads-printing-dubai',
    name: 'Letterheads Printing Dubai',
    slug: 'letterheads-printing-dubai',
    description: 'Executive 120gsm smooth uncoated white letterheads and official corporate stationery printed with crisp full-color CMYK laser compatibility.',
    image: '/uploads/categories/letterheads-printing-dubai.jpg',
    image_url: '/uploads/categories/letterheads-printing-dubai.jpg',
    status: 'active',
    display_order: 6,
    active: 1,
    seo_title: 'Letterhead Printing in Dubai | Official Corporate Stationery | ONPRINT',
    seo_description: 'Executive corporate letterhead printing in Dubai. 120gsm smooth laser-guaranteed paper for official contracts, proposals, and invoices.',
    seo_keywords: 'letterheads printing dubai, letterhead printing dubai, corporate stationery uae, official letterhead paper',
    seo_heading: 'Executive Corporate Letterhead Printing in Dubai',
    canonical_url: 'https://0nprint.com/categories/letterheads-printing-dubai',
    image_alt: 'Executive corporate stationery letterhead and envelope in Dubai',
  },
  {
    category_key: 'cat-name-badges-printing-dubai',
    name: 'Name Badges Printing Dubai',
    slug: 'name-badges-printing-dubai',
    description: 'Laser-cut brushed metal and acrylic employee name badges with magnetic backings, clear domed epoxy coatings, and scratch-resistant finishes.',
    image: '/uploads/categories/name-badges-printing-dubai.jpg',
    image_url: '/uploads/categories/name-badges-printing-dubai.jpg',
    status: 'active',
    display_order: 7,
    active: 1,
    seo_title: 'Name Badges Printing Dubai | Magnetic Metal & Acrylic Badges | ONPRINT',
    seo_description: 'Professional staff name badges printing in Dubai. Brushed silver, gold, and acrylic magnetic badges with domed epoxy resin for corporate teams.',
    seo_keywords: 'name badges printing dubai, magnetic name badges dubai, staff badge printing uae, acrylic name tag printing',
    seo_heading: 'Professional Magnetic Name Badges Printing Dubai',
    canonical_url: 'https://0nprint.com/categories/name-badges-printing-dubai',
    image_alt: 'Professional magnetic metal and acrylic name badges in Dubai',
  },
]

async function seedCategoriesIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM categories')
    const count = rows && rows[0] ? (rows[0].count ?? rows[0].COUNT ?? 0) : 0
    if (count === 0) {
      console.log('[Categories] Seeding initial high-quality Dubai printing categories in MySQL...')
      for (const cat of seedCategoriesList) {
        await connection.query(
          `INSERT INTO categories 
           (category_key, name, slug, description, image, image_url, status, display_order, active, seo_title, seo_description, seo_keywords, seo_heading, canonical_url, image_alt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name), image_url=VALUES(image_url), image=VALUES(image)`,
          [
            cat.category_key,
            cat.name,
            cat.slug,
            cat.description,
            cat.image,
            cat.image_url,
            cat.status,
            cat.display_order,
            cat.active,
            cat.seo_title,
            cat.seo_description,
            cat.seo_keywords,
            cat.seo_heading,
            cat.canonical_url,
            cat.image_alt,
          ]
        )
      }
      console.log('[Categories] Seeded 7 professional printing categories successfully.')
    }
  } catch (err) {
    console.warn('[Categories Seed Check Note]:', err.message)
  }
}



async function initDatabase() {
  try {
    const connection = await pool.getConnection()

    // 1. Users Table
    await connection.query(`
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
    `)

    // 2. Categories Table
    await connection.query(`
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // Dynamic SEO columns for categories
    await addColumnIfMissing(connection, 'categories', 'seo_title', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'categories', 'seo_description', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'categories', 'seo_keywords', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'categories', 'seo_heading', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'categories', 'canonical_url', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'categories', 'image_alt', 'VARCHAR(255) DEFAULT NULL')

    // Seed categories if empty
    await seedCategoriesIfEmpty(connection)

    // 3. Products Table
    await connection.query(`
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
    `)

    // Dynamic SEO columns for products
    await addColumnIfMissing(connection, 'products', 'seo_title', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'products', 'seo_description', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'products', 'seo_keywords', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'products', 'seo_heading', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'products', 'canonical_url', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'products', 'image_alt', 'VARCHAR(255) DEFAULT NULL')

    // 4. Product Images Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
    await addColumnIfMissing(connection, 'product_images', 'alt_text', 'VARCHAR(255) DEFAULT NULL')

    // 5. Services Table
    await connection.query(`
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
    `)

    // Dynamic SEO columns for services
    await addColumnIfMissing(connection, 'services', 'seo_title', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'services', 'seo_description', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'services', 'seo_keywords', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'services', 'seo_heading', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'services', 'canonical_url', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'services', 'image_alt', 'VARCHAR(255) DEFAULT NULL')

    // 6. Dynamic Blogs Table
    await connection.query(`
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
    `)

    // Ensure all columns exist on blogs table in case it was created earlier
    await addColumnIfMissing(connection, 'blogs', 'category_id', 'INT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'product_id', 'INT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'author_id', 'INT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'author_name', 'VARCHAR(100) DEFAULT "ONPRINT Editorial Team"')
    await addColumnIfMissing(connection, 'blogs', 'status', 'VARCHAR(50) DEFAULT "draft"')
    await addColumnIfMissing(connection, 'blogs', 'is_featured', 'TINYINT(1) DEFAULT 0')
    await addColumnIfMissing(connection, 'blogs', 'seo_title', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'meta_description', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'focus_keyword', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'secondary_keywords', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'canonical_url', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'og_title', 'VARCHAR(255) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'og_description', 'TEXT DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'og_image', 'VARCHAR(500) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'schema_type', 'VARCHAR(50) DEFAULT "BlogPosting"')
    await addColumnIfMissing(connection, 'blogs', 'reading_time', 'INT DEFAULT 3')
    await addColumnIfMissing(connection, 'blogs', 'target_location', 'VARCHAR(100) DEFAULT NULL')
    await addColumnIfMissing(connection, 'blogs', 'image_alt', 'VARCHAR(255) DEFAULT NULL')

    // Maintain legacy blog_posts view or migrate if previous blog_posts table exists
    try {
      const [tableCheck] = await connection.query(`SHOW TABLES LIKE 'blog_posts'`)
      if (tableCheck.length > 0) {
        // Copy any existing blog_posts into blogs if empty
        const [blogCount] = await connection.query(`SELECT COUNT(*) AS cnt FROM blogs`)
        if (blogCount[0].cnt === 0) {
          await connection.query(`
            INSERT IGNORE INTO blogs (title, slug, excerpt, content, featured_image, image_alt, author_name, status, seo_title, meta_description, canonical_url, published_at, created_at)
            SELECT title, slug, excerpt, content, featured_image, image_alt, author, IF(active = 1, 'published', 'draft'), seo_title, seo_description, canonical_url, published_at, created_at
            FROM blog_posts
          `)
        }
      }
    } catch (e) {
      // Ignore migration note
    }

    // 7. Contact Messages Table
    await connection.query(`
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
    `)

    // 8. Quotes Table
    await connection.query(`
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
    `)

    // 9. Orders Table
    await connection.query(`
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 10. Site Settings Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 11. Automatically Seed/Verify Admin User in DB
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@onprint.ae').toLowerCase().trim()
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const adminName = process.env.ADMIN_NAME || 'ONPRINT Admin'
    const adminPhone = process.env.ADMIN_PHONE || '+971 4 800 PRINT'

    const [adminRows] = await connection.query(
      'SELECT id, password_hash, role FROM users WHERE email = ? LIMIT 1',
      [adminEmail]
    )

    if (adminRows.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 10)
      await connection.query(
        'INSERT INTO users (name, email, password_hash, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [adminName, adminEmail, passwordHash, adminPhone, 'admin', 'active']
      )
      console.log(`[Database] Seeded Admin User in MySQL: ${adminEmail} (password: ${adminPassword})`)
    } else {
      const existingUser = adminRows[0]
      const isPassValid = await bcrypt.compare(adminPassword, existingUser.password_hash)
      if (!isPassValid || existingUser.role !== 'admin') {
        const passwordHash = await bcrypt.hash(adminPassword, 10)
        await connection.query(
          'UPDATE users SET password_hash = ?, role = "admin", status = "active" WHERE id = ?',
          [passwordHash, existingUser.id]
        )
        console.log(`[Database] Updated Admin User credentials/role in MySQL for: ${adminEmail}`)
      }
    }

    connection.release()
    console.log('[Database] ONPRINT MySQL schema, SEO columns & admin verified successfully')
    return true
  } catch (err) {
    console.warn('[Database] MySQL table initialization warning:', err.message)
    return false
  }
}

async function testConnection() {
  try {
    const connection = await pool.getConnection()
    await connection.query('SELECT 1 AS connected')
    connection.release()
    console.log('MySQL database connected successfully')
    await initDatabase()
    return true
  } catch (err) {
    console.error('MySQL database connection failed:', err.message)
    return false
  }
}

module.exports = {
  pool,
  testConnection,
  initDatabase,
  seedCategoriesList,
}
