import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!pool) {
    return NextResponse.json({
      status: "disconnected",
      message: "Las variables de entorno de la base de datos (DB_HOST, DB_USER, DB_NAME) no están configuradas en el servidor.",
    });
  }

  try {
    // 1. Test query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rows]: any = await pool.query("SELECT 1 + 1 AS testResult");
    
    // 2. Check table structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tables]: any = await pool.query("SHOW TABLES LIKE 'site_settings'");
    const tableExists = tables && tables.length > 0;

    return NextResponse.json({
      status: "connected",
      message: "¡Base de datos conectada correctamente!",
      details: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        testQuery: rows[0]?.testResult === 2 ? "exitoso" : "fallido",
        tableSettingsExists: tableExists ? "sí" : "no (se creará automáticamente en la primera consulta de lectura)",
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: "Error al intentar conectar a la base de datos.",
      error: {
        code: error.code || "UNKNOWN",
        message: error.message || String(error),
      }
    }, { status: 500 });
  }
}
