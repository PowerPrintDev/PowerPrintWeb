import fs from "fs/promises";
import path from "path";
import pool from "./db";

const LOCAL_CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

// Helper to load default fallback content from local JSON
async function getLocalContent() {
  try {
    const fileContent = await fs.readFile(LOCAL_CONTENT_PATH, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading local content.json:", error);
    return null;
  }
}

// Get content: checks DB first, falls back to JSON file
export async function getContent() {
  if (!pool) {
    return getLocalContent();
  }

  try {
    // Check if table exists and retrieve settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rows]: any = await pool.query(
      "SELECT value FROM site_settings WHERE `key` = 'site_content' LIMIT 1"
    ).catch(async (err: any) => {
      // If table does not exist (Error ER_NO_SUCH_TABLE), create it
      if (err.code === "ER_NO_SUCH_TABLE" && pool) {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS site_settings (
            \`key\` VARCHAR(255) PRIMARY KEY,
            \`value\` LONGTEXT NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
      }
      return [[]];
    });

    if (rows && rows.length > 0) {
      return JSON.parse(rows[0].value);
    }

    // If not found in DB (e.g., first run), load from local file and initialize DB
    const localContent = await getLocalContent();
    if (localContent) {
      await pool.query(
        "INSERT INTO site_settings (`key`, `value`) VALUES ('site_content', ?) ON DUPLICATE KEY UPDATE `value` = ?",
        [JSON.stringify(localContent), JSON.stringify(localContent)]
      ).catch(e => console.error("Failed to initialize site_content in DB:", e));
    }
    return localContent;
  } catch (error) {
    console.error("Database error in getContent, falling back to local file:", error);
    return getLocalContent();
  }
}

// Save content: writes to DB (if available) and backs up to local JSON
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveContent(newContent: any) {
  if (!newContent || typeof newContent !== "object") {
    throw new Error("Invalid content data");
  }

  const jsonString = JSON.stringify(newContent, null, 2);

  // 1. Always back up to the local filesystem (so developer has a local copy)
  try {
    await fs.writeFile(LOCAL_CONTENT_PATH, jsonString, "utf8");
  } catch (error) {
    console.error("Failed to write content backup to filesystem:", error);
  }

  // 2. Write to the database if pool is configured
  if (pool) {
    try {
      await pool.query(
        "INSERT INTO site_settings (`key`, `value`) VALUES ('site_content', ?) ON DUPLICATE KEY UPDATE `value` = ?",
        [jsonString, jsonString]
      );
    } catch (error) {
      console.error("Failed to save content to database:", error);
      throw error;
    }
  }
}
