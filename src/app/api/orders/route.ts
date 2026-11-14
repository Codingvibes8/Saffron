import { NextResponse } from "next/server";
import {
  addServerOrder,
  getNeonSql,
  getServerOrders,
  updateServerOrderStatus,
} from "@/lib/db";
import { Order, OrderStatus } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const sql = getNeonSql();
  if (sql) {
    try {
      if (id) {
        const cleanId = id.replace("#", "");
        const rows = await sql`
          SELECT
            id,
            order_number AS "orderNumber",
            customer_name AS "customerName",
            customer_email AS "customerEmail",
            customer_phone AS "customerPhone",
            fulfilment,
            delivery_address AS "deliveryAddress",
            postcode,
            items,
            subtotal::float AS subtotal,
            discount::float AS discount,
            promo_code AS "promoCode",
            delivery_fee::float AS "deliveryFee",
            total::float AS total,
            status,
            estimated_minutes AS "estimatedMinutes",
            payment_status AS "paymentStatus",
            created_at AS "createdAt"
          FROM orders
          WHERE id = ${cleanId} OR order_number = ${`#${cleanId}`}
          LIMIT 1
        `;
        if (rows && rows.length > 0) {
          return NextResponse.json({ order: rows[0] });
        }
      } else {
        const rows = await sql`
          SELECT
            id,
            order_number AS "orderNumber",
            customer_name AS "customerName",
            customer_email AS "customerEmail",
            customer_phone AS "customerPhone",
            fulfilment,
            delivery_address AS "deliveryAddress",
            postcode,
            items,
            subtotal::float AS subtotal,
            discount::float AS discount,
            promo_code AS "promoCode",
            delivery_fee::float AS "deliveryFee",
            total::float AS total,
            status,
            estimated_minutes AS "estimatedMinutes",
            payment_status AS "paymentStatus",
            created_at AS "createdAt"
          FROM orders
          ORDER BY created_at DESC
        `;
        if (rows && rows.length > 0) {
          return NextResponse.json({ orders: rows });
        }
      }
    } catch {
      // Fallback to server store
    }
  }

  const orders = getServerOrders();
  if (id) {
    const cleanId = id.replace("#", "").toUpperCase();
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === cleanId ||
        o.orderNumber.replace("#", "").toUpperCase() === cleanId
    );
    if (!found) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order: found });
  }

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const randNum = Math.floor(8500 + Math.random() * 1400);
    const id = body.id || `SE-${randNum}`;
    const orderNumber = body.orderNumber || `#${id}`;

    const newOrder: Order = {
      id,
      orderNumber,
      customerName: body.customerName || "Soho Guest",
      customerEmail: body.customerEmail || "guest@saffronandember.co.uk",
      customerPhone: body.customerPhone || "020 8452 1234",
      fulfilment: body.fulfilment === "collection" ? "collection" : "delivery",
      deliveryAddress: body.deliveryAddress || undefined,
      postcode: body.postcode || undefined,
      items: Array.isArray(body.items) ? body.items : [],
      subtotal: Number(body.subtotal || 0),
      discount: Number(body.discount || 0),
      promoCode: body.promoCode || undefined,
      deliveryFee: Number(body.deliveryFee || 0),
      total: Number(body.total || 0),
      status: (body.status as OrderStatus) || "Preparing",
      createdAt: new Date().toISOString(),
      estimatedMinutes: body.fulfilment === "collection" ? 20 : 25,
      notes: body.notes || undefined,
      paymentStatus: body.paymentStatus || "paid",
    };

    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO orders (
            id, order_number, customer_name, customer_email, customer_phone,
            fulfilment, delivery_address, postcode, items, subtotal, discount,
            promo_code, delivery_fee, total, status, estimated_minutes, payment_status
          ) VALUES (
            ${newOrder.id},
            ${newOrder.orderNumber},
            ${newOrder.customerName},
            ${newOrder.customerEmail},
            ${newOrder.customerPhone},
            ${newOrder.fulfilment},
            ${newOrder.deliveryAddress ?? null},
            ${newOrder.postcode ?? null},
            ${JSON.stringify(newOrder.items)},
            ${newOrder.subtotal},
            ${newOrder.discount},
            ${newOrder.promoCode ?? null},
            ${newOrder.deliveryFee},
            ${newOrder.total},
            ${newOrder.status},
            ${newOrder.estimatedMinutes},
            ${newOrder.paymentStatus}
          )
        `;
      } catch {
        // Fallback to server memory store
      }
    }

    addServerOrder(newOrder);
    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body as { id: string; status: OrderStatus };

    if (!id || !status) {
      return NextResponse.json(
        { error: "Order id and status are required" },
        { status: 400 }
      );
    }

    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          UPDATE orders
          SET status = ${status}
          WHERE id = ${id} OR order_number = ${`#${id.replace("#", "")}`}
        `;
      } catch {
        // Fallback to in-memory update
      }
    }

    const updated = updateServerOrderStatus(id, status);
    return NextResponse.json({
      order: updated ?? { id, status },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 400 }
    );
  }
}
