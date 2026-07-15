import { redirect } from "next/navigation";

export default function DeliveryServicePage({
  params,
}: {
  params: { role: string };
}) {
  redirect(`/dashboard/${params.role}/delivery-fees`);
}
