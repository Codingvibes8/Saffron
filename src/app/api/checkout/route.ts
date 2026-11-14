import { NextResponse } from "next/server";
import Stripe from "stripe";
import { addServerOrder, getNeonSql } from "@/lib/db";
import { CartItem, Order } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      fulfilment,
      deliveryAddress,
      postcode,
      items,
      subtotal,
      discount,
      promoCode,
      deliveryFee,
      total,
      notes,
    } = body as {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      fulfilment: "delivery" | "collection";
      deliveryAddress?: string;
      postcode?: string;
      items: CartItem[];
      subtotal: number;
      discount: number;
      promoCode?: string | null;
      deliveryFee: number;
      total: number;
      notes?: string;
    };

    const randNum = Math.floor(8500 + Math.random() * 1400);
    const id = `SE-${randNum}`;
    const orderNumber = `#${id}`;

    const newOrder: Order = {
      id,
      orderNumber,
      customerName: customerName || "London Diner",
      customerEmail: customerEmail || "guest@saffronandember.co.uk",
      customerPhone: customerPhone || "020 8452 1234",
      fulfilment: fulfilment === "collection" ? "collection" : "delivery",
      deliveryAddress:
        fulfilment === "delivery" ? deliveryAddress : "Collection: London Branch",
      postcode: fulfilment === "delivery" ? postcode : "W1D 3DL / NW2 1AB",
      items: Array.isArray(items) ? items : [],
      subtotal: Number(subtotal || 0),
      discount: Number(discount || 0),
      promoCode: promoCode || undefined,
      deliveryFee: Number(deliveryFee || 0),
      total: Number(total || 0),
      status: "Preparing",
      createdAt: new Date().toISOString(),
      estimatedMinutes: fulfilment === "collection" ? 20 : 25,
      notes: notes || undefined,
      paymentStatus: "paid",
    };

    // Persist in Neon Postgres if DATABASE_URL is configured
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
        // Fallback to server store
      }
    }

    addServerOrder(newOrder);

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const isStripeConfigured =
      Boolean(stripeSecretKey) &&
      stripeSecretKey!.startsWith("sk_") &&
      !stripeSecretKey!.includes("placeholder") &&
      !stripeSecretKey!.includes("your_");

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    if (isStripeConfigured && stripeSecretKey) {
      try {
        const stripe = new Stripe(stripeSecretKey);
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: newOrder.customerEmail,
          line_items: newOrder.items.map((item) => {
            const modifierSummary = [
              item.spiceLevel ? `Spice: ${item.spiceLevel}` : null,
              item.upgrade ? `Side: ${item.upgrade.name}` : null,
              item.extras.length > 0
                ? `Extras: ${item.extras.map((e) => e.name).join(", ")}`
                : null,
            ]
              .filter(Boolean)
              .join(" • ");

            return {
              price_data: {
                currency: "gbp",
                product_data: {
                  name: item.product.name,
                  description:
                    modifierSummary || item.product.description.slice(0, 120),
                },
                unit_amount: Math.round(item.unitTotal * 100),
              },
              quantity: item.quantity,
            };
          }),
          metadata: {
            orderId: newOrder.id,
            fulfilment: newOrder.fulfilment,
          },
          success_url: `${origin}/order-confirmation?orderId=${newOrder.id}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/checkout?cancelled=true`,
        });

        if (session.url) {
          return NextResponse.json({
            mode: "stripe",
            checkoutUrl: session.url,
            order: newOrder,
          });
        }
      } catch {
        // If Stripe call fails (e.g., invalid test key or offline), fall through to instant checkout
      }
    }

    return NextResponse.json({
      mode: "instant",
      checkoutUrl: `/order-confirmation?orderId=${newOrder.id}`,
      order: newOrder,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process checkout",
      },
      { status: 400 }
    );
  }
}
