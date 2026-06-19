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

    // Parse and validate content JSON
    const newContent = await request.json();
    if (!newContent || typeof newContent !== "object") {
      return NextResponse.json({ error: "Contenido inválido" }, { status: 400 });
    }

    // Write file to filesystem
    const filePath = path.join(process.cwd(), "data", "content.json");
    await fs.writeFile(filePath, JSON.stringify(newContent, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json(
      { error: "Error interno al guardar los cambios" },
      { status: 500 }
    );
  }
}
