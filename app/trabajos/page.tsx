import { getContent } from "@/app/lib/content";
import WorksClient from "./WorksClient";

export const dynamic = "force-dynamic";



export default async function TrabajosPage() {
  const content = await getContent();

  return <WorksClient content={content} />;
}
