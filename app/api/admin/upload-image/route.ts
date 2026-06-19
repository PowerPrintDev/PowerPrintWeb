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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const fileExt = path.extname(file.name) || ".png";
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${fileExt}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Write file
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);

    // Return the public path
    const publicPath = `/uploads/${fileName}`;
    return NextResponse.json({ success: true, url: publicPath });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Error interno al subir la imagen" },
      { status: 500 }
    );
  }
}
