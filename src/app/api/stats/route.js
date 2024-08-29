import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [totalClicks] = await connection.execute(
      "SELECT SUM(clicks) as total_clicks FROM short_urls"
    );
    const [totalLinks] = await connection.execute(
      "SELECT COUNT(*) as total_links FROM short_urls"
    );
    const [uniqueIPs] = await connection.execute(
      "SELECT COUNT(DISTINCT ip_address) as unique_ips FROM short_urls"
    );
    connection.release();

    return NextResponse.json({
      totalClicks: totalClicks[0].total_clicks || 0,
      totalLinks: totalLinks[0].total_links || 0,
      uniqueIPs: uniqueIPs[0].unique_ips || 0,
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    return NextResponse.json({ error: "Error getting stats" }, { status: 500 });
  }
}
