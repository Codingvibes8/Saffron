/**
 * Saffron & Ember - Stripe Account Provisioning Script
 * Provisions Account acct_1RzHmBBQWEiOaxED with menu products, prices, upgrades, extras, and promo codes.
 */

const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

// Read environment variables from .env
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

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('ERROR: STRIPE_SECRET_KEY is not defined in .env');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey);

const { execSync } = require('child_process');

// Ensure dist/menu-data.js exists
const distMenuDataPath = path.resolve(__dirname, '..', 'dist', 'menu-data.js');
if (!fs.existsSync(distMenuDataPath)) {
  console.log('Compiling TypeScript menu data...');
  execSync('npx tsc src/lib/menu-data.ts src/lib/types.ts --outDir ./dist --module commonjs --target es2020 --skipLibCheck', {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
  });
}

// Load menu data
const menuData = require('../dist/menu-data.js');
const { INITIAL_PRODUCTS, UPGRADE_OPTIONS, EXTRA_OPTIONS, PROMO_CODES } = menuData;

async function provision() {
  console.log('='.repeat(70));
  console.log('  SAFFRON & EMBER - STRIPE ACCOUNT PROVISIONING');
  console.log('='.repeat(70));

  // 1. Verify account
  const account = await stripe.accounts.retrieve();
  console.log(`\nConnected Account: ${account.id}`);
  console.log(`Business Name:     ${account.business_profile?.name || 'N/A'}`);
  console.log(`Default Currency:  ${account.default_currency?.toUpperCase() || 'GBP'}`);
  console.log(`Charges Enabled:   ${account.charges_enabled}`);

  if (account.id !== 'acct_1RzHmBBQWEiOaxED') {
    console.warn(`\n[WARNING] Target acct was acct_1RzHmBBQWEiOaxED, but current is ${account.id}`);
  }

  // 2. Fetch existing Stripe products to ensure idempotency
  console.log('\n[1/4] Checking existing Stripe products...');
  const existingProducts = [];
  let hasMore = true;
  let startingAfter = undefined;
  while (hasMore) {
    const res = await stripe.products.list({ limit: 100, starting_after: startingAfter });
    existingProducts.push(...res.data);
    hasMore = res.has_more;
    if (res.data.length > 0) {
      startingAfter = res.data[res.data.length - 1].id;
    }
  }
  console.log(`Found ${existingProducts.length} existing products in Stripe.`);
  const productMapBySlug = new Map();
  for (const p of existingProducts) {
    if (p.metadata?.slug) {
      productMapBySlug.set(p.metadata.slug, p);
    } else if (p.metadata?.id) {
      productMapBySlug.set(p.metadata.id, p);
    }
  }

  const catalogSummary = {
    accountId: account.id,
    provisionedAt: new Date().toISOString(),
    currency: 'gbp',
    products: [],
    upgrades: [],
    extras: [],
    coupons: [],
  };

  // 3. Provision Core Menu Products
  console.log(`\n[2/4] Provisioning ${INITIAL_PRODUCTS.length} Menu Dishes...`);
  for (const item of INITIAL_PRODUCTS) {
    const existing = productMapBySlug.get(item.slug) || productMapBySlug.get(item.id);
    let stripeProduct;

    // Filter valid image URLs (Stripe requires absolute HTTP/HTTPS URLs)
    const images = [];
    if (item.image && (item.image.startsWith('https://') || item.image.startsWith('http://'))) {
      images.push(item.image);
    }

    const productPayload = {
      name: item.name,
      description: item.description,
      images: images.length > 0 ? images : undefined,
      metadata: {
        id: item.id,
        slug: item.slug,
        category: item.category,
        badgeCategory: item.badgeCategory,
        dietary: (item.dietary || []).join(', '),
        defaultSpice: item.defaultSpice || '',
        calories: String(item.calories || ''),
        prepTimeMins: String(item.prepTimeMins || ''),
        featured: String(item.featured || false),
        type: 'menu_dish',
      },
    };

    if (existing) {
      console.log(`  Updating existing dish: ${item.name} (${existing.id})`);
      stripeProduct = await stripe.products.update(existing.id, productPayload);
    } else {
      console.log(`  Creating dish: ${item.name} (£${item.price.toFixed(2)})`);
      stripeProduct = await stripe.products.create({
        ...productPayload,
        default_price_data: {
          currency: 'gbp',
          unit_amount: Math.round(item.price * 100),
        },
      });
    }

    // Retrieve default price if needed
    let priceId = stripeProduct.default_price;
    if (typeof priceId === 'object' && priceId !== null) {
      priceId = priceId.id;
    } else if (!priceId) {
      // Find or create price
      const prices = await stripe.prices.list({ product: stripeProduct.id, active: true });
      if (prices.data.length > 0) {
        priceId = prices.data[0].id;
      } else {
        const newPrice = await stripe.prices.create({
          product: stripeProduct.id,
          currency: 'gbp',
          unit_amount: Math.round(item.price * 100),
        });
        priceId = newPrice.id;
      }
    }

    catalogSummary.products.push({
      localId: item.id,
      slug: item.slug,
      name: item.name,
      category: item.category,
      priceGbp: item.price,
      stripeProductId: stripeProduct.id,
      stripePriceId: priceId,
    });
  }

  // 4. Provision Side Upgrades
  console.log(`\n[3/4] Provisioning Upgrade Options and Extras...`);
  for (const up of UPGRADE_OPTIONS) {
    if (up.price <= 0) continue; // Skip free upgrade "none"
    const existing = productMapBySlug.get(`upgrade-${up.id}`);
    let stripeProduct;
    const payload = {
      name: `Upgrade: ${up.name}`,
      description: `Gourmet side accompaniment: ${up.name}`,
      metadata: {
        id: up.id,
        slug: `upgrade-${up.id}`,
        type: 'upgrade_option',
      },
    };

    if (existing) {
      stripeProduct = await stripe.products.update(existing.id, payload);
    } else {
      console.log(`  Creating upgrade: ${up.name} (£${up.price.toFixed(2)})`);
      stripeProduct = await stripe.products.create({
        ...payload,
        default_price_data: {
          currency: 'gbp',
          unit_amount: Math.round(up.price * 100),
        },
      });
    }

    let priceId = typeof stripeProduct.default_price === 'object' ? stripeProduct.default_price?.id : stripeProduct.default_price;
    if (!priceId) {
      const prices = await stripe.prices.list({ product: stripeProduct.id, active: true });
      priceId = prices.data[0]?.id;
    }

    catalogSummary.upgrades.push({
      id: up.id,
      name: up.name,
      priceGbp: up.price,
      stripeProductId: stripeProduct.id,
      stripePriceId: priceId,
    });
  }

  // 5. Provision Extras
  for (const ext of EXTRA_OPTIONS) {
    const existing = productMapBySlug.get(`extra-${ext.id}`);
    let stripeProduct;
    const payload = {
      name: `Extra: ${ext.name}`,
      description: `Artisanal extra accompaniment: ${ext.name}`,
      metadata: {
        id: ext.id,
        slug: `extra-${ext.id}`,
        type: 'extra_option',
      },
    };

    if (existing) {
      stripeProduct = await stripe.products.update(existing.id, payload);
    } else {
      console.log(`  Creating extra: ${ext.name} (£${ext.price.toFixed(2)})`);
      stripeProduct = await stripe.products.create({
        ...payload,
        default_price_data: {
          currency: 'gbp',
          unit_amount: Math.round(ext.price * 100),
        },
      });
    }

    let priceId = typeof stripeProduct.default_price === 'object' ? stripeProduct.default_price?.id : stripeProduct.default_price;
    if (!priceId) {
      const prices = await stripe.prices.list({ product: stripeProduct.id, active: true });
      priceId = prices.data[0]?.id;
    }

    catalogSummary.extras.push({
      id: ext.id,
      name: ext.name,
      priceGbp: ext.price,
      stripeProductId: stripeProduct.id,
      stripePriceId: priceId,
    });
  }

  // 6. Provision Coupons and Promotion Codes
  console.log(`\n[4/4] Provisioning Promo Codes & Coupons...`);
  const existingCoupons = await stripe.coupons.list({ limit: 100 });
  const existingCouponIds = new Set(existingCoupons.data.map(c => c.id));

  for (const [codeKey, promo] of Object.entries(PROMO_CODES)) {
    const couponId = `COUPON_${promo.code}`;
    let coupon;
    if (existingCouponIds.has(couponId)) {
      console.log(`  Coupon ${couponId} already exists.`);
      coupon = await stripe.coupons.retrieve(couponId);
    } else {
      const couponName = `${promo.code} (${promo.discountPercent}% Off)`.slice(0, 40);
      console.log(`  Creating Coupon: ${couponName}`);
      coupon = await stripe.coupons.create({
        id: couponId,
        name: couponName,
        percent_off: promo.discountPercent,
        duration: 'forever',
        metadata: {
          code: promo.code,
          description: promo.description.slice(0, 500),
        },
      });
    }

    // Check promotion codes
    const promoCodes = await stripe.promotionCodes.list({ code: promo.code, limit: 1 });
    let stripePromoCode;
    if (promoCodes.data.length > 0) {
      stripePromoCode = promoCodes.data[0];
      console.log(`  Promotion code ${promo.code} already exists (${stripePromoCode.id}).`);
    } else {
      console.log(`  Creating customer promotion code: ${promo.code}`);
      stripePromoCode = await stripe.promotionCodes.create({
        coupon: coupon.id,
        code: promo.code,
        active: true,
      });
    }

    catalogSummary.coupons.push({
      code: promo.code,
      discountPercent: promo.discountPercent,
      description: promo.description,
      stripeCouponId: coupon.id,
      stripePromoCodeId: stripePromoCode.id,
    });
  }

  // Save catalog mapping to JSON file
  const outputPath = path.resolve(__dirname, '..', 'stripe-catalog.json');
  fs.writeFileSync(outputPath, JSON.stringify(catalogSummary, null, 2), 'utf8');
  console.log(`\nCatalog summary successfully exported to: ${outputPath}`);

  console.log('\n' + '='.repeat(70));
  console.log('  PROVISIONING COMPLETE');
  console.log(`  Dishes Provisioned:   ${catalogSummary.products.length}`);
  console.log(`  Upgrades Provisioned: ${catalogSummary.upgrades.length}`);
  console.log(`  Extras Provisioned:   ${catalogSummary.extras.length}`);
  console.log(`  Coupons Provisioned:  ${catalogSummary.coupons.length}`);
  console.log('='.repeat(70));
}

provision().catch((err) => {
  console.error('\nProvisioning failed:', err);
  process.exit(1);
});
