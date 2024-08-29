import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function GET(request, { params }) {
  const { shortCode } = params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM short_urls WHERE short_code = ?",
      [shortCode]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    const url = rows[0];

    return NextResponse.json({
      originalUrl: url.original_url,
      isPrivate: url.is_private,
    });
  } catch (error) {
    console.error("Error getting URL:", error);
    return NextResponse.json({ error: "Error getting URL" }, { status: 500 });
  }
}
export async function POST(request, { params }) {
  const { shortCode } = params;
  const { password } = await request.json();

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM short_urls WHERE short_code = ?",
      [shortCode]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    const url = rows[0];

    if (!url.is_private) {
      return NextResponse.json(
        { error: "This URL is not private" },
        { status: 400 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, url.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ originalUrl: url.original_url });
  } catch (error) {
    console.error("Error verifying private URL:", error);
    return NextResponse.json(
      { error: "Error verifying private URL" },
      { status: 500 }
    );
  }
}
