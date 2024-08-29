import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { shortCode } = params;

  try {
    const connection = await pool.getConnection();
    console.log("Suma de clics");
    await connection.execute(
      "UPDATE short_urls SET clicks = clicks + 1 WHERE short_code = ?",
      [shortCode]
    );
    connection.release();
    return NextResponse.json({ message: "Click count incremented" });
  } catch (error) {
    console.error("Error incrementing click count:", error);
    return NextResponse.json(
      { error: "Error incrementing click count" },
      { status: 500 }
    );
  }
}
