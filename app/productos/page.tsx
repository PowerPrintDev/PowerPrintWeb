import { getContent } from "@/app/lib/content";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";



export default async function ProductosPage() {
  const content = await getContent();
  return <ProductsClient content={content} />;
}
