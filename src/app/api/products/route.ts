import { NextResponse } from "next/server";
import { getNeonSql, getServerProducts } from "@/lib/db";
import { MENU_CATEGORIES } from "@/lib/menu-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT
          id, slug, name, description,
          price::float AS price,
          original_price::float AS "originalPrice",
          category,
          badge_category AS "badgeCategory",
          image, featured,
          has_modifiers AS "hasModifiers",
          dietary,
          default_spice AS "defaultSpice",
          available
        FROM products
        ORDER BY featured DESC, name ASC
      `;
      if (rows && rows.length > 0) {
        return NextResponse.json({
          source: "neon-postgres",
          categories: MENU_CATEGORIES,
          products: rows,
        });
      }
    } catch {
      // Fallback to seeded server products if table is not yet migrated
    }
  }

  let products = getServerProducts();
  if (category && category !== "All") {
    products = products.filter((p) => p.category === category);
  }
  if (featured === "true") {
    products = products.filter((p) => p.featured);
  }

  return NextResponse.json({
    source: "seeded-store",
    categories: MENU_CATEGORIES,
    products,
  });
}
