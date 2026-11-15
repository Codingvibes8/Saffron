import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getNeonSql, updateServerOrderPayment } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event: Stripe.Event;

    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err) {
        console.error("⚠️ Stripe webhook signature verification failed:", err);
        return NextResponse.json(
          { error: "Webhook signature verification failed" },
          { status: 400 }
        );
      }
    } else {
      // In development when webhook secret isn't provided, parse event directly
      event = JSON.parse(rawBody) as Stripe.Event;
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          // Update Neon Postgres database
          const sql = getNeonSql();
          if (sql) {
            try {
              await sql`
                UPDATE orders
                SET payment_status = 'paid', status = 'Preparing'
                WHERE id = ${orderId} OR order_number = ${orderId}
              `;
            } catch (dbErr) {
              console.error("Failed to update order payment in Postgres:", dbErr);
            }
          }

          // Update server memory store
          updateServerOrderPayment(orderId, "paid", "Preparing");
          console.log(`✅ Order ${orderId} marked as paid via Stripe Checkout Session`);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;
        if (orderId) {
          const sql = getNeonSql();
          if (sql) {
            try {
              await sql`
                UPDATE orders
                SET payment_status = 'paid'
                WHERE id = ${orderId} OR order_number = ${orderId}
              `;
            } catch {
              // fallback
            }
          }
          updateServerOrderPayment(orderId, "paid");
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;
        if (orderId) {
          const sql = getNeonSql();
          if (sql) {
            try {
              await sql`
                UPDATE orders
                SET payment_status = 'failed'
                WHERE id = ${orderId} OR order_number = ${orderId}
              `;
            } catch {
              // fallback
            }
          }
          updateServerOrderPayment(orderId, "failed");
        }
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook handler failed" },
      { status: 500 }
    );
  }
}
