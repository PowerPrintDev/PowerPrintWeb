import fs from "fs/promises";
import path from "path";
import WorksClient from "./WorksClient";

export const dynamic = "force-dynamic";

async function getContent() {
  try {
    const filePath = path.join(process.cwd(), "data", "content.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading content.json in Trabajos page, using defaults.", error);
    return null;
  }
}

export default async function TrabajosPage() {
  const content = await getContent();

  return <WorksClient content={content} />;
}
