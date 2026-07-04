import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const cwd = process.cwd();
  
  let filesInCwd: string[] = [];
  try {
    filesInCwd = await fs.readdir(cwd);
  } catch (e: any) {
    filesInCwd = [ "Error listing cwd: " + e.message ];
  }

  const expectedJsonPath = path.join(cwd, "data", "content.json");
  let jsonExists = false;
  let jsonError = "";
  try {
    await fs.access(expectedJsonPath);
    jsonExists = true;
  } catch (e: any) {
    jsonError = e.message;
  }

  // Let's also check if parent contains it or builds folder contains it
  const alternativePath = path.join(cwd, ".builds", "last-source", "data", "content.json");
  let altExists = false;
  try {
    await fs.access(alternativePath);
    altExists = true;
  } catch (e) {}

  if (!pool) {
    return NextResponse.json({
      status: "disconnected",
      message: "Las variables de entorno de la base de datos (DB_HOST, DB_USER, DB_NAME) no están configuradas en el servidor.",
      diagnostics: { cwd, filesInCwd, expectedJsonPath, jsonExists, jsonError, alternativePath, altExists }
    });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rows]: any = await pool.query("SELECT 1 + 1 AS testResult");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tables]: any = await pool.query("SHOW TABLES LIKE 'site_settings'");
    const tableExists = tables && tables.length > 0;

    let dbDataLength = 0;
    let dbDataKeys: string[] = [];
    if (tableExists) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [dataRows]: any = await pool.query("SELECT value FROM site_settings WHERE `key` = 'site_content' LIMIT 1");
      if (dataRows && dataRows.length > 0) {
        try {
          const parsed = JSON.parse(dataRows[0].value);
          dbDataLength = dataRows[0].value.length;
          dbDataKeys = Object.keys(parsed);
        } catch (e) {}
      }
    }

    return NextResponse.json({
      status: "connected",
      message: "¡Base de datos conectada correctamente!",
      details: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        testQuery: rows[0]?.testResult === 2 ? "exitoso" : "fallido",
        tableSettingsExists: tableExists ? "sí" : "no",
        dbDataLength,
        dbDataKeys
      },
      diagnostics: {
        cwd,
        filesInCwd,
        expectedJsonPath,
        jsonExists,
        jsonError,
        alternativePath,
        altExists
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: "Error al intentar conectar a la base de datos.",
      error: {
        code: error.code || "UNKNOWN",
        message: error.message || String(error),
      },
      diagnostics: { cwd, filesInCwd, expectedJsonPath, jsonExists, jsonError, alternativePath, altExists }
    }, { status: 500 });
  }
}
