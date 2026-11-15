"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIAL_RESERVATIONS = exports.INITIAL_ORDERS = exports.NEON_SCHEMA_SQL = void 0;
exports.getNeonSql = getNeonSql;
exports.getServerProducts = getServerProducts;
exports.getServerOrders = getServerOrders;
exports.addServerOrder = addServerOrder;
exports.updateServerOrderStatus = updateServerOrderStatus;
exports.updateServerOrderPayment = updateServerOrderPayment;
exports.getServerReservations = getServerReservations;
exports.addServerReservation = addServerReservation;
const serverless_1 = require("@neondatabase/serverless");
const menu_data_1 = require("./menu-data");
/**
 * Neon Serverless Postgres connection helper.
 * Automatically queries Neon Postgres when DATABASE_URL is configured,
 * and gracefully falls back to the seeded store in local/serverless preview environments.
 */
function getNeonSql() {
    const url = process.env.DATABASE_URL;
    if (!url || url.includes("user:password")) {
        return null;
    }
    try {
        return (0, serverless_1.neon)(url);
    }
    catch {
        return null;
    }
}
exports.NEON_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0
);

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
`;
// Server-side in-memory store for API routes when DATABASE_URL is not set
const globalForDb = globalThis;
exports.INITIAL_ORDERS = [
    {
        id: "SE-8492",
        orderNumber: "#SE-8492",
        customerName: "Aarav Mehta",
        customerEmail: "aarav.mehta@london.co.uk",
        customerPhone: "07700 900412",
        fulfilment: "delivery",
        deliveryAddress: "42 Dean Street, Soho, London",
        postcode: "W1D 4PZ",
        items: [
            {
                cartItemId: "seed-item-1",
                product: menu_data_1.INITIAL_PRODUCTS[0],
                quantity: 2,
                spiceLevel: "Medium",
                upgrade: {
                    id: "garlic-coriander-naan",
                    name: "Garlic & Coriander Naan",
                    price: 3.95,
                },
                extras: [
                    {
                        id: "poppadoms-chutney",
                        name: "Poppadoms & Artisanal Chutney Tray",
                        price: 4.5,
                    },
                ],
                unitTotal: 25.4,
            },
            {
                cartItemId: "seed-item-2",
                product: menu_data_1.INITIAL_PRODUCTS[5],
                quantity: 1,
                spiceLevel: "Mild",
                upgrade: {
                    id: "pilau-rice",
                    name: "Aged Saffron Pilau Rice",
                    price: 3.75,
                },
                extras: [],
                unitTotal: 17.7,
            },
        ],
        subtotal: 68.5,
        discount: 6.85,
        promoCode: "SAFFRON10",
        deliveryFee: 2.95,
        total: 64.6,
        status: "In the Tandoor",
        createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        estimatedMinutes: 25,
        notes: "Extra crispy garlic naan please, ring buzzer #4.",
        paymentStatus: "paid",
    },
    {
        id: "SE-8491",
        orderNumber: "#SE-8491",
        customerName: "Charlotte Kensington",
        customerEmail: "charlotte@sohouse.com",
        customerPhone: "07700 900881",
        fulfilment: "delivery",
        deliveryAddress: "88 Chichele Road, Cricklewood, London",
        postcode: "NW2 3BX",
        items: [
            {
                cartItemId: "seed-item-3",
                product: menu_data_1.INITIAL_PRODUCTS[1],
                quantity: 1,
                spiceLevel: "Madras Hot",
                upgrade: {
                    id: "peshwari-naan",
                    name: "Peshwari Sweet Almond Naan",
                    price: 4.5,
                },
                extras: [
                    {
                        id: "mango-lassi",
                        name: "Alphonso Mango & Cardamom Lassi",
                        price: 4.95,
                    },
                ],
                unitTotal: 34.4,
            },
        ],
        subtotal: 34.4,
        discount: 0,
        deliveryFee: 2.95,
        total: 37.35,
        status: "Out for Delivery",
        createdAt: new Date(Date.now() - 21 * 60 * 1000).toISOString(),
        estimatedMinutes: 15,
        paymentStatus: "paid",
    },
    {
        id: "SE-8493",
        orderNumber: "#SE-8493",
        customerName: "Rohan & Priya Kapoor",
        customerEmail: "rohan.kapoor@gmail.com",
        customerPhone: "07700 900219",
        fulfilment: "collection",
        items: [
            {
                cartItemId: "seed-item-4",
                product: menu_data_1.INITIAL_PRODUCTS[4],
                quantity: 1,
                spiceLevel: "Medium",
                upgrade: {
                    id: "truffle-cheese-naan",
                    name: "Black Truffle & Keen's Cheddar Naan",
                    price: 5.5,
                },
                extras: [],
                unitTotal: 55.45,
            },
        ],
        subtotal: 55.45,
        discount: 0,
        deliveryFee: 0,
        total: 55.45,
        status: "Preparing",
        createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
        estimatedMinutes: 20,
        notes: "Collecting from Soho Street / NW2 counter at 8:45 PM.",
        paymentStatus: "paid",
    },
];
exports.INITIAL_RESERVATIONS = [
    {
        id: "res-101",
        reference: "SE-TBL-904",
        guestName: "Lord Julian Vance",
        guestEmail: "jvance@mayfaircapital.co.uk",
        guestPhone: "020 7946 0821",
        date: new Date().toISOString().split("T")[0],
        timeSlot: "19:30",
        partySize: 4,
        seatingArea: "Soho Velvet Booths",
        occasion: "Anniversary Dinner",
        dietaryNotes: "1 guest gluten-free, no peanuts",
        specialRequests: "Corner booth near the brass tandoor window if possible.",
        status: "confirmed",
        createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    },
    {
        id: "res-102",
        reference: "SE-TBL-905",
        guestName: "Ananya Chatterjee",
        guestEmail: "ananya.c@arts.ac.uk",
        guestPhone: "07911 234567",
        date: new Date().toISOString().split("T")[0],
        timeSlot: "20:15",
        partySize: 2,
        seatingArea: "Chef's Counter",
        occasion: "Date Night",
        dietaryNotes: "Pure Vegetarian & Jain-Friendly options requested",
        specialRequests: "Would love the Sommelier spice pairing menu.",
        status: "confirmed",
        createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    },
    {
        id: "res-103",
        reference: "SE-TBL-906",
        guestName: "Marcus Sterling",
        guestEmail: "m.sterling@sohofilms.uk",
        guestPhone: "07822 998877",
        date: new Date().toISOString().split("T")[0],
        timeSlot: "18:45",
        partySize: 6,
        seatingArea: "Private Spice Vault",
        occasion: "Client Celebration",
        dietaryNotes: "Halal meats only",
        status: "seated",
        createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
    },
];
function getServerProducts() {
    if (!globalForDb.saffronProducts) {
        globalForDb.saffronProducts = [...menu_data_1.INITIAL_PRODUCTS];
    }
    return globalForDb.saffronProducts;
}
function getServerOrders() {
    if (!globalForDb.saffronOrders) {
        globalForDb.saffronOrders = [...exports.INITIAL_ORDERS];
    }
    return globalForDb.saffronOrders;
}
function addServerOrder(order) {
    const orders = getServerOrders();
    globalForDb.saffronOrders = [order, ...orders.filter((o) => o.id !== order.id)];
    return order;
}
function updateServerOrderStatus(id, status) {
    const orders = getServerOrders();
    const idx = orders.findIndex((o) => o.id === id || o.orderNumber.replace("#", "") === id.replace("#", ""));
    if (idx === -1)
        return null;
    orders[idx] = { ...orders[idx], status };
    return orders[idx];
}
function updateServerOrderPayment(id, paymentStatus, status) {
    const orders = getServerOrders();
    const idx = orders.findIndex((o) => o.id === id || o.orderNumber.replace("#", "") === id.replace("#", ""));
    if (idx === -1)
        return null;
    orders[idx] = {
        ...orders[idx],
        paymentStatus,
        ...(status ? { status } : {}),
    };
    return orders[idx];
}
function getServerReservations() {
    if (!globalForDb.saffronReservations) {
        globalForDb.saffronReservations = [...exports.INITIAL_RESERVATIONS];
    }
    return globalForDb.saffronReservations;
}
function addServerReservation(reservation) {
    const list = getServerReservations();
    globalForDb.saffronReservations = [reservation, ...list];
    return reservation;
}
