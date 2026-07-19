import AppRoot from "@/components/AppRoot";
import { loadAppData } from "@/lib/data";

// Bookings change; don't statically cache the page.
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await loadAppData();
  return <AppRoot data={data} />;
}
