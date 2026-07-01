import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Read content.json to get form fields validation rules
    const contentPath = path.join(process.cwd(), "data", "content.json");
    const contentData = await fs.readFile(contentPath, "utf8");
    const content = JSON.parse(contentData);
    
    const contactPage = content.contactPage || {};
    const formFields = contactPage.formFields || [];

    // 2. Validate request parameters dynamically
    const errors: Record<string, string> = {};
    for (const field of formFields) {
      if (field.enabled) {
        const val = body[field.id];
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
    } catch (e) {
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
