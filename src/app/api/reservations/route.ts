import { NextResponse } from "next/server";
import {
  addServerReservation,
  getNeonSql,
  getServerReservations,
} from "@/lib/db";
import { Reservation } from "@/lib/types";

export async function GET() {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT
          id,
          reference,
          guest_name AS "guestName",
          guest_email AS "guestEmail",
          guest_phone AS "guestPhone",
          reservation_date AS "date",
          time_slot AS "timeSlot",
          party_size AS "partySize",
          seating_area AS "seatingArea",
          occasion,
          dietary_notes AS "dietaryNotes",
          special_requests AS "specialRequests",
          status,
          created_at AS "createdAt"
        FROM reservations
        ORDER BY created_at DESC
        LIMIT 50
      `;
      if (rows.length > 0) {
        return NextResponse.json({ reservations: rows, source: "neon" });
      }
    } catch {
      // Fallback to in-memory store
    }
  }
  return NextResponse.json({
    reservations: getServerReservations(),
    source: "memory",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reference = `SE-TBL-${Math.floor(100 + Math.random() * 900)}`;
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      reference,
      guestName: body.guestName || "London Guest",
      guestEmail: body.guestEmail || "guest@london.co.uk",
      guestPhone: body.guestPhone || "020 8452 1234",
      date: body.date || new Date().toISOString().split("T")[0],
      timeSlot: body.timeSlot || "19:30",
      partySize: Number(body.partySize) || 2,
      seatingArea: body.seatingArea || "Main Tandoor Dining Room",
      occasion: body.occasion || undefined,
      dietaryNotes: body.dietaryNotes || undefined,
      specialRequests: body.specialRequests || undefined,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO reservations (
            id, reference, guest_name, guest_email, guest_phone,
            reservation_date, time_slot, party_size, seating_area,
            occasion, dietary_notes, special_requests, status
          ) VALUES (
            ${newReservation.id}, ${newReservation.reference},
            ${newReservation.guestName}, ${newReservation.guestEmail},
            ${newReservation.guestPhone}, ${newReservation.date},
            ${newReservation.timeSlot}, ${newReservation.partySize},
            ${newReservation.seatingArea}, ${newReservation.occasion || null},
            ${newReservation.dietaryNotes || null},
            ${newReservation.specialRequests || null}, 'confirmed'
          )
        `;
      } catch {
        // Fallback to server memory
      }
    }

    addServerReservation(newReservation);
    return NextResponse.json({ reservation: newReservation }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create table reservation" },
      { status: 400 }
    );
  }
}
