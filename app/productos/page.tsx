import fs from "fs/promises";
import path from "path";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

async function getContent() {
  try {
    const filePath = path.join(process.cwd(), "data", "content.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading content.json in Productos page, using defaults.", error);
    return null;
  }
}

export default async function ProductosPage() {
  const content = await getContent();
  return <ProductsClient content={content} />;
}
