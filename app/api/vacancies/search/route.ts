import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ data: [] });

  const data = await db.$queryRaw<Array<{ id: string; title: string; location: string }>>`
    SELECT id, title, location
    FROM "Vacancy"
    WHERE to_tsvector('simple', title || ' ' || description) @@ plainto_tsquery('simple', ${q})
    ORDER BY "createdAt" DESC
    LIMIT 20
  `;

  return NextResponse.json({ data });
}
