import { notFound } from "next/navigation";

import { InventoryEditor } from "@/components/dashboard/inventory-editor";
import { fetchAdminInventoryAdjustments, fetchAdminInventoryItem, fetchAdminProduct } from "@/lib/api";

export default async function InventoryDetailPage({
  params,
}: {
  params: { role: string; productId: string };
}) {
  try {
    const product = await fetchAdminProduct(params.productId);
    let inventory = null;
    try {
      inventory = await fetchAdminInventoryItem(params.productId);
    } catch (error) {
      if (!(error instanceof Error) || !/not found/i.test(error.message)) {
        throw error;
      }
      inventory = null;
    }
    const adjustments = await fetchAdminInventoryAdjustments(params.productId, 1, 25);

    return (
      <InventoryEditor
        role={params.role}
        product={product}
        initialInventory={inventory}
        adjustments={adjustments.items}
      />
    );
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      notFound();
    }
    throw error;
  }
}
