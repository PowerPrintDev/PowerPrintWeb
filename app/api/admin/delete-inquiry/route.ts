import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    const payload = verifyToken(session);

    if (!payload) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID de consulta no provisto" }, { status: 400 });
    }

    const inquiriesPath = path.join(process.cwd(), "data", "inquiries.json");
    let inquiries = [];
    try {
      const inquiriesData = await fs.readFile(inquiriesPath, "utf8");
      inquiries = JSON.parse(inquiriesData);
    } catch (e) {
      inquiries = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedInquiries = inquiries.filter((inquiry: any) => inquiry.id !== id);

    await fs.writeFile(inquiriesPath, JSON.stringify(updatedInquiries, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al borrar la consulta" },
      { status: 500 }
    );
  }
}
