/**
 * ONPRINT SEO Keywords Insertion Script
 * 
 * This script safely inserts 147 SEO keywords into the database.
 * It checks for duplicates and creates a backup before insertion.
 * 
 * Usage: node scripts/insert-keywords.js
 */

require('dotenv').config()
const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function insertKeywords() {
  let connection

  try {
    // Connect to database
    log('\n🔌 Connecting to database...', 'cyan')
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'onprintdb',
      multipleStatements: true, // Allow multiple SQL statements
    })
    log('✅ Connected to database', 'green')

    // Check current keyword count
    log('\n📊 Checking current keyword count...', 'cyan')
    const [countBefore] = await connection.query(
      'SELECT COUNT(*) as total FROM seo_keywords'
    )
    const beforeCount = countBefore[0].total
    log(`   Current keywords: ${beforeCount}`, 'blue')

    // Create backup
    log('\n💾 Creating backup...', 'cyan')
    const backupDate = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const backupTable = `seo_keywords_backup_${backupDate}`
    
    await connection.query(`DROP TABLE IF EXISTS ${backupTable}`)
    await connection.query(`CREATE TABLE ${backupTable} AS SELECT * FROM seo_keywords`)
    
    const [backupCheck] = await connection.query(
      `SELECT COUNT(*) as total FROM ${backupTable}`
    )
    log(`✅ Backup created: ${backupTable} (${backupCheck[0].total} rows)`, 'green')

    // Read SQL file
    log('\n📄 Reading SQL file...', 'cyan')
    const sqlFilePath = path.join(__dirname, '..', 'seo-keywords-expansion.sql')
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found: ${sqlFilePath}`)
    }
    
    const sql = fs.readFileSync(sqlFilePath, 'utf8')
    log('✅ SQL file loaded', 'green')

    // Execute SQL
    log('\n⚙️  Inserting keywords...', 'cyan')
    log('   This may take a few seconds...', 'yellow')
    
    try {
      await connection.query(sql)
      log('✅ Keywords inserted successfully', 'green')
    } catch (insertError) {
      if (insertError.code === 'ER_DUP_ENTRY') {
        log('⚠️  Some keywords already exist (duplicate entries)', 'yellow')
        log('   Continuing with non-duplicate keywords...', 'yellow')
      } else {
        throw insertError
      }
    }

    // Check final count
    log('\n📊 Checking final keyword count...', 'cyan')
    const [countAfter] = await connection.query(
      'SELECT COUNT(*) as total FROM seo_keywords'
    )
    const afterCount = countAfter[0].total
    const addedCount = afterCount - beforeCount
    
    log(`   Keywords before: ${beforeCount}`, 'blue')
    log(`   Keywords after: ${afterCount}`, 'blue')
    log(`   Keywords added: ${addedCount}`, 'green')

    // Show distribution
    log('\n📈 Keyword distribution:', 'cyan')
    
    const [priorityDist] = await connection.query(`
      SELECT priority, COUNT(*) as count 
      FROM seo_keywords 
      GROUP BY priority 
      ORDER BY FIELD(priority, 'High', 'Medium', 'Low')
    `)
    priorityDist.forEach(row => {
      log(`   ${row.priority}: ${row.count} keywords`, 'blue')
    })

    const [clusterDist] = await connection.query(`
      SELECT cluster, COUNT(*) as count 
      FROM seo_keywords 
      GROUP BY cluster 
      ORDER BY count DESC 
      LIMIT 10
    `)
    log('\n📊 Top clusters:', 'cyan')
    clusterDist.forEach(row => {
      log(`   ${row.cluster}: ${row.count} keywords`, 'blue')
    })

    // Sample of new keywords
    log('\n🔍 Sample of keywords (latest 10):', 'cyan')
    const [sample] = await connection.query(`
      SELECT keyword, cluster, priority, target_page 
      FROM seo_keywords 
      ORDER BY id DESC 
      LIMIT 10
    `)
    sample.forEach(row => {
      log(`   • ${row.keyword} [${row.priority}] → ${row.target_page}`, 'blue')
    })

    log('\n' + '='.repeat(60), 'green')
    log('✅ KEYWORD INSERTION COMPLETED SUCCESSFULLY!', 'bright')
    log('='.repeat(60), 'green')
    log('\n📋 Next steps:', 'cyan')
    log('   1. Restart your server: npm run dev', 'blue')
    log('   2. Visit Admin SEO Manager dashboard', 'blue')
    log('   3. Check "Keyword Architecture" tab', 'blue')
    log('   4. Verify target keywords count = 147', 'blue')
    log('   5. Connect Google Search Console for live ranking data', 'blue')
    log('')

  } catch (error) {
    log('\n❌ ERROR DURING KEYWORD INSERTION:', 'red')
    log(`   ${error.message}`, 'red')
    
    if (error.code) {
      log(`   Error code: ${error.code}`, 'red')
    }
    
    if (error.sqlMessage) {
      log(`   SQL error: ${error.sqlMessage}`, 'red')
    }
    
    log('\n💡 Troubleshooting:', 'yellow')
    log('   • Check database connection in .env file', 'yellow')
    log('   • Verify MySQL is running', 'yellow')
    log('   • Check database exists: onprintdb', 'yellow')
    log('   • Review seo-keywords-expansion.sql for syntax errors', 'yellow')
    
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      log('🔌 Database connection closed', 'cyan')
    }
  }
}

// Run the script
log('\n' + '='.repeat(60), 'cyan')
log('ONPRINT SEO KEYWORDS INSERTION SCRIPT', 'bright')
log('='.repeat(60), 'cyan')

insertKeywords()
