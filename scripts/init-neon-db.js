/**
 * Saffron & Ember - Neon Serverless Postgres DB Provisioning & Seeding
 * Run via: npm run db:init (or npm run db:provision / node scripts/init-neon-db.js)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
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
  console.error('ERROR: DATABASE_URL is missing or using placeholder in .env');
  process.exit(1);
}

// Compile TypeScript files if dist doesn't exist
const distMenuDataPath = path.resolve(__dirname, '..', 'dist', 'menu-data.js');
const distDbPath = path.resolve(__dirname, '..', 'dist', 'db.js');
if (!fs.existsSync(distMenuDataPath) || !fs.existsSync(distDbPath)) {
  console.log('Compiling TypeScript sources (menu-data, db, types)...');
  execSync(
    'npx tsc src/lib/menu-data.ts src/lib/db.ts src/lib/types.ts --outDir ./dist --module commonjs --target es2020 --skipLibCheck',
    {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
    }
  );
}

const { INITIAL_PRODUCTS, MENU_CATEGORIES } = require('../dist/menu-data');
const { INITIAL_ORDERS, INITIAL_RESERVATIONS } = require('../dist/db');

const sql = neon(dbUrl);

  const CATEGORIES_DATA = [
    { id: 'cat-small-plates', name: 'Small Plates & Chaat', slug: 'small-plates-and-chaat', sort_order: 1 },
    { id: 'cat-tandoori-grill', name: 'Tandoori Grill', slug: 'tandoori-grill', sort_order: 2 },
    { id: 'cat-signature-curries', name: 'Signature Curries', slug: 'signature-curries', sort_order: 3 },
    { id: 'cat-biryani', name: 'Biryani', slug: 'biryani', sort_order: 4 },
    { id: 'cat-breads-sides', name: 'Breads & Sides', slug: 'breads-and-sides', sort_order: 5 },
    { id: 'cat-drinks-desserts', name: 'Drinks & Desserts', slug: 'drinks-and-desserts', sort_order: 6 },
    { id: 'cat-feast-deals', name: 'Feast Deals', slug: 'feast-deals', sort_order: 7 },
  ];

  async function initAndSeed() {
    console.log('='.repeat(65));
    console.log('  SAFFRON & EMBER - NEON POSTGRES PROVISION & SEED');
    console.log('='.repeat(65));

    // 1. Create Tables
    console.log('\n[1/5] Ensuring table schemas exist...');

    await sql.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sort_order INT DEFAULT 0
    );
  `);

    await sql.query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      original_price NUMERIC(10, 2),
      category TEXT NOT NULL,
      badge_category TEXT NOT NULL,
      image TEXT NOT NULL,
      featured BOOLEAN DEFAULT FALSE,
      has_modifiers BOOLEAN DEFAULT TRUE,
      dietary TEXT[] DEFAULT '{}',
      default_spice TEXT DEFAULT 'Medium',
      available BOOLEAN DEFAULT TRUE
    );
  `);

    await sql.query(`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      reference TEXT NOT NULL UNIQUE,
      guest_name TEXT NOT NULL,
      guest_email TEXT NOT NULL,
      guest_phone TEXT NOT NULL,
      reservation_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      party_size INT NOT NULL,
      seating_area TEXT NOT NULL,
      occasion TEXT,
      dietary_notes TEXT,
      special_requests TEXT,
      status TEXT DEFAULT 'confirmed',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

    await sql.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      fulfilment TEXT NOT NULL,
      delivery_address TEXT,
      postcode TEXT,
      items JSONB NOT NULL,
      subtotal NUMERIC(10, 2) NOT NULL,
      discount NUMERIC(10, 2) DEFAULT 0,
      promo_code TEXT,
      delivery_fee NUMERIC(10, 2) DEFAULT 0,
      total NUMERIC(10, 2) NOT NULL,
      status TEXT DEFAULT 'Preparing',
      estimated_minutes INT DEFAULT 25,
      payment_status TEXT DEFAULT 'paid',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
    console.log('  ✓ 4 table schemas verified (categories, products, reservations, orders).');

    // 2. Seed Categories
    console.log(`\n[2/5] Seeding categories (${CATEGORIES_DATA.length} categories)...`);
    for (const cat of CATEGORIES_DATA) {
      await sql`
      INSERT INTO categories (id, name, slug, sort_order)
      VALUES (${cat.id}, ${cat.name}, ${cat.slug}, ${cat.sort_order})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        slug = EXCLUDED.slug,
        sort_order = EXCLUDED.sort_order;
    `;
    }
    console.log(`  ✓ Seeded ${CATEGORIES_DATA.length} categories.`);

    // 3. Seed Products
    console.log(`\n[3/5] Seeding products catalog (${INITIAL_PRODUCTS.length} dishes)...`);
    for (const prod of INITIAL_PRODUCTS) {
      const dietaryArray = Array.isArray(prod.dietary) ? prod.dietary : [];
      // Convert JS array to Postgres TEXT[] array format
      const dietaryPg = '{' + dietaryArray.map((d) => `"${d.replace(/"/g, '\\"')}"`).join(',') + '}';

      await sql`
      INSERT INTO products (
        id, slug, name, description, price, original_price,
        category, badge_category, image, featured, has_modifiers,
        dietary, default_spice, available
      ) VALUES (
        ${prod.id},
        ${prod.slug},
        ${prod.name},
        ${prod.description},
        ${prod.price},
        ${prod.originalPrice ?? null},
        ${prod.category},
        ${prod.badgeCategory},
        ${prod.image},
        ${Boolean(prod.featured)},
        ${prod.hasModifiers !== false},
        ${dietaryPg}::text[],
        ${prod.defaultSpice || 'Medium'},
        ${prod.available !== false}
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        original_price = EXCLUDED.original_price,
        category = EXCLUDED.category,
        badge_category = EXCLUDED.badge_category,
        image = EXCLUDED.image,
        featured = EXCLUDED.featured,
        has_modifiers = EXCLUDED.has_modifiers,
        dietary = EXCLUDED.dietary,
        default_spice = EXCLUDED.default_spice,
        available = EXCLUDED.available;
    `;
    }
    console.log(`  ✓ Seeded ${INITIAL_PRODUCTS.length} products.`);

    // 4. Seed Reservations
    console.log(`\n[4/5] Seeding reservations (${INITIAL_RESERVATIONS.length} bookings)...`);
    for (const res of INITIAL_RESERVATIONS) {
      await sql`
      INSERT INTO reservations (
        id, reference, guest_name, guest_email, guest_phone,
        reservation_date, time_slot, party_size, seating_area,
        occasion, dietary_notes, special_requests, status, created_at
      ) VALUES (
        ${res.id},
        ${res.reference},
        ${res.guestName},
        ${res.guestEmail},
        ${res.guestPhone},
        ${res.date},
        ${res.timeSlot},
        ${res.partySize},
        ${res.seatingArea},
        ${res.occasion ?? null},
        ${res.dietaryNotes ?? null},
        ${res.specialRequests ?? null},
        ${res.status || 'confirmed'},
        ${res.createdAt || new Date().toISOString()}
      )
      ON CONFLICT (id) DO UPDATE SET
        reference = EXCLUDED.reference,
        guest_name = EXCLUDED.guest_name,
        guest_email = EXCLUDED.guest_email,
        guest_phone = EXCLUDED.guest_phone,
        reservation_date = EXCLUDED.reservation_date,
        time_slot = EXCLUDED.time_slot,
        party_size = EXCLUDED.party_size,
        seating_area = EXCLUDED.seating_area,
        occasion = EXCLUDED.occasion,
        dietary_notes = EXCLUDED.dietary_notes,
        special_requests = EXCLUDED.special_requests,
        status = EXCLUDED.status;
    `;
    }
    console.log(`  ✓ Seeded ${INITIAL_RESERVATIONS.length} reservations.`);

    // 5. Seed Orders
    console.log(`\n[5/5] Seeding orders (${INITIAL_ORDERS.length} orders)...`);
    for (const ord of INITIAL_ORDERS) {
      await sql`
      INSERT INTO orders (
        id, order_number, customer_name, customer_email, customer_phone,
        fulfilment, delivery_address, postcode, items, subtotal, discount,
        promo_code, delivery_fee, total, status, estimated_minutes,
        payment_status, created_at
      ) VALUES (
        ${ord.id},
        ${ord.orderNumber},
        ${ord.customerName},
        ${ord.customerEmail},
        ${ord.customerPhone},
        ${ord.fulfilment},
        ${ord.deliveryAddress ?? null},
        ${ord.postcode ?? null},
        ${JSON.stringify(ord.items)},
        ${ord.subtotal},
        ${ord.discount ?? 0},
        ${ord.promoCode ?? null},
        ${ord.deliveryFee ?? 0},
        ${ord.total},
        ${ord.status || 'Preparing'},
        ${ord.estimatedMinutes ?? 25},
        ${ord.paymentStatus || 'paid'},
        ${ord.createdAt || new Date().toISOString()}
      )
      ON CONFLICT (id) DO UPDATE SET
        order_number = EXCLUDED.order_number,
        customer_name = EXCLUDED.customer_name,
        customer_email = EXCLUDED.customer_email,
        customer_phone = EXCLUDED.customer_phone,
        fulfilment = EXCLUDED.fulfilment,
        delivery_address = EXCLUDED.delivery_address,
        postcode = EXCLUDED.postcode,
        items = EXCLUDED.items,
        subtotal = EXCLUDED.subtotal,
        discount = EXCLUDED.discount,
        promo_code = EXCLUDED.promo_code,
        delivery_fee = EXCLUDED.delivery_fee,
        total = EXCLUDED.total,
        status = EXCLUDED.status,
        estimated_minutes = EXCLUDED.estimated_minutes,
        payment_status = EXCLUDED.payment_status;
    `;
    }
    console.log(`  ✓ Seeded ${INITIAL_ORDERS.length} orders.`);

    // Final Verification
    console.log('\n' + '='.repeat(65));
    console.log('  PROVISIONING VERIFICATION & ROW COUNTS');
    console.log('='.repeat(65));

    const tables = ['categories', 'products', 'reservations', 'orders'];
    for (const table of tables) {
      const res = await sql.query(`SELECT COUNT(*)::int as count FROM "${table}";`);
      const count = res[0]?.count || 0;
      console.log(`  📁 ${table.padEnd(20)}: ${count} rows`);
    }

    console.log('\nNeon Database successfully provisioned and populated!\n');
  }

  initAndSeed().catch((err) => {
    console.error('\n❌ Provisioning Failed:', err);
    process.exit(1);
  });
