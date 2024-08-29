import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function POST(request) {
  const { url, isPrivate, password } = await request.json();
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const shortCode = nanoid(6);
  let hashedPassword = null;

  if (isPrivate && password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // Get the IP address from the request
  const ipAddress = request.headers.get("x-forwarded-for") || request.ip;

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      "INSERT INTO short_urls (short_code, original_url, is_private, password, ip_address) VALUES (?, ?, ?, ?, ?)",
      [shortCode, url, isPrivate, hashedPassword, ipAddress] // Save the IP
    );
    connection.release();

    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`;
    return NextResponse.json({ shortUrl, isPrivate });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return NextResponse.json(
      { error: "Error creating short URL" },
      { status: 500 }
    );
  }
}
