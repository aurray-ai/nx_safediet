import { redirect } from "next/navigation";

type TrackingPageProps = {
  params: {
    orderId: string;
  };
};

export default function OrderTrackingFallbackPage({ params }: TrackingPageProps) {
  const encodedOrderId = encodeURIComponent(params.orderId);
  redirect(`/install-app?target=order-tracking&orderId=${encodedOrderId}`);
}
