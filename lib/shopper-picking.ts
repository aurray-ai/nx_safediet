export type ShopperPickingItemStatus = "item_picked";

export function getShopperPickingStorageKey(orderId: string): string {
  return `safediet:shopper-picking:${orderId}`;
}
