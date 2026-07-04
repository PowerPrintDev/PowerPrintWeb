import { getContent } from "@/app/lib/content";
import ContactClient from "./ContactClient";

export const dynamic = "force-dynamic";



export default async function ContactoPage() {
  const content = await getContent();
  return <ContactClient content={content} />;
}
