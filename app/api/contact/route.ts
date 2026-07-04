import { getContent } from "@/app/lib/content";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: Record<string, any> = {};
    const errors: Record<string, string> = {};

    // 1. Read content.json to get form fields validation rules
    const content = await getContent();
    
    const contactPage = content.contactPage || {};
    const formFields = contactPage.formFields || [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      // Iterate through all fields from formFields config to parse them from formData
      for (const field of formFields) {
        if (field.enabled) {
          if (field.type === "file") {
            const file = formData.get(field.id) as File | null;
            if (file && file.size > 0) {
              // Check file size (limit to 10MB)
              if (file.size > 10 * 1024 * 1024) {
                errors[field.id] = `El archivo supera el tamaño máximo permitido de 10MB.`;
                continue;
              }
              // Prevent uploading executable/dangerous files
              const dangerousExtensions = [".exe", ".bat", ".cmd", ".sh", ".js", ".ts", ".vbs", ".scr", ".html", ".htm"];
              const fileExt = path.extname(file.name).toLowerCase() || ".png";
              if (dangerousExtensions.includes(fileExt)) {
                errors[field.id] = `Tipo de archivo no permitido.`;
                continue;
              }

              // Convert file to buffer
              const bytes = await file.arrayBuffer();
              const buffer = Buffer.from(bytes);
              // Clean file name to prevent directory traversal or invalid characters
              const cleanedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
              const fileName = `${Date.now()}_inquiry_${cleanedName}`;
              
              const uploadsDir = path.join(process.cwd(), "public", "uploads");
              await fs.mkdir(uploadsDir, { recursive: true });
              
              const filePath = path.join(uploadsDir, fileName);
              await fs.writeFile(filePath, buffer);
              
              // Store relative URL
              body[field.id] = `/uploads/${fileName}`;
            } else {
              body[field.id] = "";
            }
          } else {
            const val = formData.get(field.id);
            if (val !== null) {
              body[field.id] = String(val);
            }
          }
        }
      }
    } else {
      body = await request.json();
    }

    // 2. Validate request parameters dynamically
    for (const field of formFields) {
      if (field.enabled) {
        const val = body[field.id];
        // If it was already validated (like file size/extension error), keep that error
        if (errors[field.id]) continue;

        if (field.required && (!val || (typeof val === "string" && val.trim() === ""))) {
          errors[field.id] = `El campo "${field.label}" es obligatorio.`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // 3. Save submission into data/inquiries.json
    const inquiriesPath = path.join(process.cwd(), "data", "inquiries.json");
    let inquiries = [];
    try {
      const inquiriesData = await fs.readFile(inquiriesPath, "utf8");
      inquiries = JSON.parse(inquiriesData);
    } catch {
      // In case the file is missing or corrupted, start clean
      inquiries = [];
    }

    const newInquiry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      data: body
    };

    inquiries.push(newInquiry);
    await fs.writeFile(inquiriesPath, JSON.stringify(inquiries, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing contact form submission:", error);
    return NextResponse.json(
      { error: "Error en el servidor al enviar la consulta" },
      { status: 500 }
    );
  }
}
