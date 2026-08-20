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

const seedBlogArticles = [
  {
    title: 'The Complete Guide to Commercial & Digital Printing Services in Dubai',
    slug: 'printing-services-dubai',
    category: 'Printing Guide',
    author: 'ONPRINT Studio',
    read_time: '7 min read',
    excerpt: 'Understand the critical differences between digital press and offset printing in Dubai, paper stock weights, color calibration, and how to prepare print-ready files.',
    featured_image: '/assets/products/1 (7).jpg',
    image_alt: 'Commercial digital and offset printing press in Dubai UAE',
    seo_title: 'Commercial & Digital Printing Services in Dubai | Complete Guide | ONPRINT',
    seo_description: 'Discover how commercial & digital printing works in Dubai. Learn about offset vs digital presses, Pantone matching, paper stocks, and pre-press artwork specs.',
    seo_keywords: 'printing services dubai, digital printing dubai, commercial printing dubai, printing company in dubai',
    canonical_url: 'https://0nprint.com/blog/printing-services-dubai',
    content: `<h2>Understanding Commercial Printing in Dubai</h2>
<p>For modern businesses operating in Dubai's competitive corporate landscape, physical print collateral remains one of the strongest touchpoints for building brand authority. Whether distributing promotional brochures at the Dubai World Trade Centre or presenting proposals in bespoke executive folders, precision printing communicates excellence before a single word is read.</p>

<h3>Digital Press vs. Offset Printing: Which Fits Your Project?</h3>
<p>Selecting the right print technology depends primarily on quantity, turnaround urgency, and budget:</p>
<ul>
  <li><strong>Digital Printing:</strong> Best for short-to-medium runs (1 to 500 units), urgent same-day or 24-hour turnarounds, and variable data personalization. Modern digital presses in Dubai offer near-offset sharpness with zero setup plate costs.</li>
  <li><strong>Offset Printing:</strong> Ideal for high-volume commercial runs (1,000+ units), large corporate catalogs, packaging boxes, and projects requiring exact Pantone spot color fidelity. Offset offers lower per-unit costs at scale.</li>
</ul>

<h3>Paper Stocks and Tactile Finishes</h3>
<p>The tactile weight and texture of your paper immediately establish perceived value. Common executive stocks in Dubai include:</p>
<ul>
  <li><strong>350gsm Silk & Art Card:</strong> The industry standard for sturdy business cards, premium marketing flyers, and table tents.</li>
  <li><strong>120gsm Uncoated Laser Paper:</strong> Smooth, absorbent stationery stock optimized for corporate letterheads, contracts, and invoices.</li>
  <li><strong>FSC-Certified Textured & Kraft Stocks:</strong> Eco-conscious alternatives providing an organic, artisan aesthetic for luxury branding.</li>
</ul>

<h3>Key Pre-Flight File Requirements</h3>
<p>To avoid common print issues, ensure your design files follow these specifications:</p>
<ol>
  <li>Set the document color profile to <strong>CMYK (Fogra39 or US Web Coated)</strong> rather than RGB.</li>
  <li>Include at least <strong>3mm bleed</strong> on all edges with crop marks enabled.</li>
  <li>Maintain a minimum image resolution of <strong>300 DPI</strong> at 100% final output size.</li>
  <li>Convert all typography and font layers to outlines/curves before exporting as high-resolution PDF/X-1a.</li>
</ol>`,
  },
  {
    title: 'Top Corporate Gift & Promotional Merchandise Ideas for Dubai Businesses',
    slug: 'corporate-gifts-dubai',
    category: 'Corporate Gifting',
    author: 'ONPRINT Studio',
    read_time: '6 min read',
    excerpt: 'A curated selection of high-impact corporate gifts and promotional giveaways in Dubai, from laser-engraved vacuum flasks to luxury leatherette notebooks.',
    featured_image: '/assets/products/1 (1).jpg',
    image_alt: 'Custom luxury corporate gifts and promotional merchandise in Dubai',
    seo_title: 'Corporate Gifts Dubai | Promotional Gift Printing Ideas | ONPRINT',
    seo_description: 'Explore the best corporate gift ideas in Dubai. Learn how custom branded mugs, thermal bottles, luxury notebooks, and apparel enhance brand loyalty across the UAE.',
    seo_keywords: 'corporate gifts dubai, promotional gifts dubai, corporate gift printing dubai, custom gifts dubai',
    canonical_url: 'https://0nprint.com/blog/corporate-gifts-dubai',
    content: `<h2>The Power of Tangible Corporate Gifting in the UAE</h2>
<p>In the UAE business culture, corporate gifting is more than a marketing gesture — it is an integral relationship-building tradition. High-quality promotional gifts demonstrate appreciation, strengthen executive partnerships, and keep your brand top-of-mind throughout the year.</p>

<h3>Most Requested Corporate Gifts in Dubai</h3>
<p>Here are the highest-performing branded promotional items favored by Dubai enterprises:</p>
<ul>
  <li><strong>Smart Thermal Flasks & Drinkware:</strong> Double-wall insulated stainless steel bottles with LED temperature displays, laser-engraved with corporate branding. Highly practical and used daily across offices and commute.</li>
  <li><strong>Executive Leatherette Bound Notebooks:</strong> Hardcover A5 debossed journals featuring bookmark ribbons, elastic pen holders, and 80gsm cream writing paper.</li>
  <li><strong>Sublimation Ceramic Mugs:</strong> Dishwasher-safe 11oz and 15oz matte and gloss mugs printed with vibrant Pantone-accurate logos.</li>
  <li><strong>Custom Embroidered Apparel:</strong> Combed cotton polo shirts, crewneck tees, and 3D puff embroidered caps designed for team uniforms and trade exhibition booths.</li>
</ul>

<h3>Personalization & Luxury Branding Techniques</h3>
<p>Elevate your promotional items beyond standard printing using specialized finishing methods:</p>
<ul>
  <li><strong>Precision Laser Engraving:</strong> Permanent, clean etching on metal, wood, and leather items that will never fade or peel.</li>
  <li><strong>UV Spot Gloss & Metallic Foil Stamping:</strong> High-sheen detailing for presentation boxes and gift set sleeves.</li>
  <li><strong>3D Puff Embroidery:</strong> Adds depth and structure to branded headwear and executive jackets.</li>
</ul>

<h3>Planning Your Gifting Timeline</h3>
<p>For major corporate events, exhibitions at GITEX or Arab Health, and Ramadan or End-of-Year gifting, plan your custom print orders 2 to 3 weeks in advance to allow for proof approvals, sample testing, and bespoke packaging assembly.</p>`,
  },
  {
    title: 'Luxury Business Card Printing in Dubai: Paper Stocks, Finishes & Specs',
    slug: 'business-card-design-printing',
    category: 'Business Stationery',
    author: 'ONPRINT Studio',
    read_time: '5 min read',
    excerpt: 'Everything you need to know about crafting executive business cards in Dubai: 350gsm to 600gsm cotton stocks, soft-touch matte lamination, spot UV, and gold foil stamping.',
    featured_image: '/assets/products/1 (7).jpg',
    image_alt: 'Luxury foil-stamped business cards printed in Dubai',
    seo_title: 'Business Card Printing Dubai | Luxury Stocks & Foil Finishes | ONPRINT',
    seo_description: 'Expert guide to premium business card printing in Dubai. Compare 350gsm silk, cotton cardstocks, gold foil embossing, and spot UV finishes for executive cards.',
    seo_keywords: 'business card printing dubai, luxury business cards dubai, custom business cards uae',
    canonical_url: 'https://0nprint.com/blog/business-card-design-printing',
    content: `<h2>Making a Lasting Impression with Premium Business Cards</h2>
<p>Your business card is often the very first physical artifact a prospective client or investor holds. In executive meetings across DIFC, Downtown Dubai, and Abu Dhabi, a flimsy standard card is quickly discarded, while a substantial, textured card with refined finishing demands attention.</p>

<h3>Selecting the Right Cardstock Weight</h3>
<ul>
  <li><strong>350gsm Silk Card:</strong> The standard corporate benchmark offering crisp rigidness and smooth tactile handling.</li>
  <li><strong>400gsm – 450gsm Heavyweight Art Board:</strong> Substantial weight that resists bending in pockets and cardholders.</li>
  <li><strong>600gsm Cotton / Duplex Card:</strong> Ultra-thick luxury stock created by mounting two complementary paper boards together with optional colored edge painting.</li>
</ul>

<h3>Popular Specialty Finishes for Dubai Brands</h3>
<p>Modern print finishing transforms minimalist card designs into executive statements:</p>
<ul>
  <li><strong>Soft-Touch Velvet Lamination:</strong> Imparts a subtle suede-like texture that prevents fingerprint smudging and enhances grip.</li>
  <li><strong>Raised Spot UV Varnish:</strong> Creates high-gloss transparent dimensional highlights on logos, icons, or typography.</li>
  <li><strong>Hot Foil Stamping:</strong> Metallic gold, silver, rose gold, or copper foil pressed with heat and brass dies for undeniable elegance.</li>
  <li><strong>Blind Embossing & Debossing:</strong> Three-dimensional relief pressed into paper fibers without ink for subtle tactile branding.</li>
</ul>

<h3>Standard Card Dimensions in UAE</h3>
<p>The standard business card dimension across the UAE and GCC is <strong>90mm x 50mm</strong> (or 85mm x 55mm international format). Always include 3mm bleed around all sides (total artwork size 96mm x 56mm) with a 4mm inner safety margin for all typography.</p>`,
  },
  {
    title: 'How to Choose the Best Commercial Printing Company in Dubai, UAE',
    slug: 'choosing-printing-company-dubai',
    category: 'Industry Insights',
    author: 'ONPRINT Studio',
    read_time: '6 min read',
    excerpt: '5 essential criteria for selecting a reliable printing partner in Dubai, including prepress verification, turnaround speeds, sample proofs, and local press capabilities.',
    featured_image: '/assets/products/1 (9).jpg',
    image_alt: 'Commercial printing facility and prepress studio in Dubai UAE',
    seo_title: 'Choosing a Printing Company in Dubai | 5 Critical Checklist Points | ONPRINT',
    seo_description: 'Looking for a printing partner in Dubai? Learn how to evaluate print quality, turnaround times, sample proofs, and equipment before placing your commercial order.',
    seo_keywords: 'printing company in dubai, printing company dubai, professional printing services dubai',
    canonical_url: 'https://0nprint.com/blog/choosing-printing-company-dubai',
    content: `<h2>Why Your Printing Partner Matters</h2>
<p>Selecting a commercial printing company in Dubai directly impacts your brand reputation. A partner with inconsistent color calibration, delayed deliveries, or poor finishing can jeopardize major event launches and client presentations. Here are the 5 critical factors to evaluate before committing to a print vendor.</p>

<h3>1. Prepress File Inspection & Digital Proofing</h3>
<p>A professional printing facility does not simply press print on received files. They provide a thorough prepress review that checks:</p>
<ul>
  <li>CMYK color space conversion and total ink coverage limits</li>
  <li>Adequate bleed allowances and crop mark alignments</li>
  <li>Image resolution to prevent pixelated output</li>
  <li>Font rasterization and overprint settings</li>
</ul>

<h3>2. In-House Equipment & Press Capabilities</h3>
<p>Brokers who outsource every job often suffer from unexpected delays and zero direct quality control. Verify that your partner operates modern in-house equipment for digital presses, large-format roll-ups, UV printing, and die-cutting.</p>

<h3>3. Transparency in Paper Specs & Material Samples</h3>
<p>Ask to inspect tangible paper swatches and sample proofs. Reputable printers clearly state exact paper grammages (GSM), stock brands (e.g., Fedrigoni, Arctic Silk), and laminate grades upfront.</p>

<h3>4. Turnaround Reliability in Dubai</h3>
<p>Event deadlines in Dubai are non-negotiable. Ensure your printing partner offers confirmed production schedules, express same-day or 48-hour turnarounds for urgent collaterals, and tracked doorstep delivery across all Emirates.</p>

<h3>5. End-to-End Solutions Under One Roof</h3>
<p>From initial design review to printing, folding, binding, foil-stamping, and custom packaging, having a single partner manage the complete pipeline ensures seamless quality consistency across all brand assets.</p>`,
  },
]

async function seedBlogPostsIfEmpty(connection) {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM blog_posts')
    if (rows[0].count === 0) {
      console.log('[Blog] Seeding initial high-quality Dubai SEO blog posts...')
      for (const post of seedBlogArticles) {
        await connection.query(
          `INSERT INTO blog_posts 
           (title, slug, category, author, read_time, excerpt, content, featured_image, image_alt, seo_title, seo_description, seo_keywords, canonical_url, active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
           ON DUPLICATE KEY UPDATE title=VALUES(title)`,
          [
            post.title,
            post.slug,
            post.category,
            post.author,
            post.read_time,
            post.excerpt,
            post.content,
            post.featured_image,
            post.image_alt,
            post.seo_title,
            post.seo_description,
            post.seo_keywords,
            post.canonical_url,
          ]
        )
      }
      console.log('[Blog] Seeded 4 comprehensive SEO blog articles successfully.')
    }
  } catch (err) {
    console.warn('[Blog Seed Check Note]:', err.message)
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

    // 6. Blog Posts Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        excerpt TEXT DEFAULT NULL,
        content LONGTEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'Printing & Branding',
        featured_image VARCHAR(500) DEFAULT NULL,
        image_alt VARCHAR(255) DEFAULT NULL,
        author VARCHAR(100) DEFAULT 'ONPRINT Studio',
        read_time VARCHAR(50) DEFAULT '5 min read',
        seo_title VARCHAR(255) DEFAULT NULL,
        seo_description TEXT DEFAULT NULL,
        seo_keywords VARCHAR(500) DEFAULT NULL,
        canonical_url VARCHAR(500) DEFAULT NULL,
        published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // Seed blog posts if empty
    await seedBlogPostsIfEmpty(connection)

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
    await connection.query('SELECT 1')
    connection.release()
    console.log('ONPRINT MySQL connection successful')
    await initDatabase()
    return true
  } catch (err) {
    console.error('ONPRINT MySQL connection failed:', err.message)
    return false
  }
}

module.exports = {
  pool,
  testConnection,
  initDatabase,
  seedBlogArticles,
}
