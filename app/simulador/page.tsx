import { getContent } from "@/app/lib/content";
import SimuladorClient from "./SimuladorClient";

export const dynamic = "force-dynamic";

export default async function SimuladorPage() {
  const content = await getContent();

  return <SimuladorClient logoWhite={content?.navbar?.logoWhite} />;
}
