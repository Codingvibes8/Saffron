/**
 * Saffron & Ember - Neon DB Table Inspector
 * Run via: npm run db:view
 */

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

function loadEnv() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const value = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl || dbUrl.includes('user:password')) {
  console.error('DATABASE_URL is missing or using placeholder credentials in .env');
  process.exit(1);
}

const sql = neon(dbUrl);

async function inspectDb() {
  console.log('='.repeat(65));
  console.log('  NEON POSTGRES TABLE INSPECTOR');
  console.log('='.repeat(65));

  try {
    // 1. List all public tables
    const tables = await sql.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    );

    if (tables.length === 0) {
      console.log('\nNo tables found in public schema yet.');
      return;
    }

    console.log(`\nFound ${tables.length} table(s):\n`);

    for (const row of tables) {
      const tableName = row.table_name;
      const countRes = await sql.query(`SELECT COUNT(*)::int as count FROM "${tableName}";`);
      const rowCount = countRes[0]?.count || 0;
      console.log(`  📁 ${tableName.padEnd(20)} (${rowCount} rows)`);
    }

    console.log('\n' + '='.repeat(65));
  } catch (err) {
    if (err.message && err.message.includes('password authentication failed')) {
      console.error('\n❌ Authentication Error: Password authentication failed for user.');
      console.error('👉 Please log into https://console.neon.tech, select your project,');
      console.error('   and copy the latest Connection String into your .env file.\n');
    } else {
      console.error('\nDatabase query error:', err.message);
    }
  }
}

inspectDb();
