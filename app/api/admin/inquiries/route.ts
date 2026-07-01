import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    const payload = verifyToken(session);

    if (!payload) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const inquiriesPath = path.join(process.cwd(), "data", "inquiries.json");
    let inquiries = [];
    try {
      const inquiriesData = await fs.readFile(inquiriesPath, "utf8");
      inquiries = JSON.parse(inquiriesData);
    } catch (e) {
      inquiries = [];
    }

    // Sort by timestamp descending (newest first)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inquiries.sort((a: any, b: any) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
