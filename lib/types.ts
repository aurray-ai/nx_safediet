import type { DashboardRole } from "@/lib/roles";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  user_types: string[];
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: AdminUser;
};

export type AdminSession = {
  accessToken: string;
  tokenType: string;
  user: AdminUser;
  activeRole: DashboardRole;
  defaultDashboardHref: string;
};

export type GroceryCategory = {
  id: string;
  slug: string;
  name: string;
  icon_name: string;
  img_url: string;
  description: string;
  sort_order: number;
};

export type CultureOption = {
  value: string;
  display_name: string;
};

export type NutrientOption = {
  id: number;
  slug: string;
  display_name: string;
  default_unit: string;
};

export type SupportedCountry = {
  country_code: string;
  currency_code: string;
  display_name: string;
};

export type AdminMetadata = {
  categories: GroceryCategory[];
  cultures: CultureOption[];
  nutrients: NutrientOption[];
  supported_countries: SupportedCountry[];
};

export type MealCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  img_url: string;
  sort_order: number;
};

export type MealTypeOption = {
  value: string;
  display_name: string;
};

export type MealDifficultyOption = {
  value: string;
  display_name: string;
};

export type MealProductOption = {
  id: string;
  name: string;
  category_id: string;
  img_url: string;
};

export type MealNutritionSummary = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type MealEstimatedCost = {
  country_code: string;
  currency_code: string;
  amount: number;
};

export type MealIngredient = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  optional: boolean;
  linked_product_ids: string[];
};

export type AdminMealRecipeStep = {
  instruction: string;
  ingredient_ids: string[];
  image_url?: string | null;
};

export type AdminMealMetadata = {
  categories: MealCategory[];
  cultures: CultureOption[];
  meal_types: MealTypeOption[];
  difficulties: MealDifficultyOption[];
  supported_countries: SupportedCountry[];
  products: MealProductOption[];
};

export type NutritionSpec = {
  nutrient_id: number;
  amount: number;
  unit: string;
};

export type CountryPrice = {
  country_code: string;
  currency_code: string;
  amount: number;
  price_unit: string;
  source?: string;
  is_active?: boolean;
  region?: string | null;
  city?: string | null;
};

export type AdminProduct = {
  id: string;
  category_id: string;
  img_url: string;
  product: string;
  description: string;
  product_tags: string[];
  culture_tags: string[];
  nutritional_specs: NutritionSpec[];
  prices: CountryPrice[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminProductListResponse = {
  items: AdminProduct[];
  total: number;
  page: number;
  page_size: number;
};

export type AdminProductBulkDeleteResponse = {
  deleted_product_ids: string[];
  missing_product_ids: string[];
  deleted_count: number;
};

export type AdminMeal = {
  id: string;
  name: string;
  hero_image_url: string;
  image_urls: string[];
  description: string;
  meal_type: string;
  meal_types: string[];
  category_ids: string[];
  culture_tags: string[];
  diet_rules_supported: string[];
  allergy_exclusions: string[];
  prep_time_minutes: number;
  cook_time_minutes: number;
  difficulty: string;
  servings: number;
  nutrition_summary: MealNutritionSummary;
  estimated_costs: MealEstimatedCost[];
  recipe_steps: string[];
  recipe_step_items: AdminMealRecipeStep[];
  ingredient_items: MealIngredient[];
  linked_product_ids: string[];
  chef_available: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminMealListResponse = {
  items: AdminMeal[];
  total: number;
  page: number;
  page_size: number;
};

export type AdminMealBulkDeleteResponse = {
  deleted_meal_ids: string[];
  missing_meal_ids: string[];
  deleted_count: number;
};

export type AdminMealUploadAsset = {
  url: string;
  storage_backend: string;
  content_type: string;
  original_filename: string;
};

export type AdminMealUploadResponse = {
  items: AdminMealUploadAsset[];
};

export type AdminMealPayload = Omit<
  AdminMeal,
  "id" | "linked_product_ids" | "created_at" | "updated_at"
>;

export type AdminMealCreatePayload = AdminMealPayload & {
  meal_id?: string;
};

export type AdminProductPayload = Omit<AdminProduct, "id" | "created_at" | "updated_at">;

export type AdminProductCreatePayload = AdminProductPayload & {
  product_id?: string;
};

export type InventoryAdjustmentType =
  | "manual_set"
  | "manual_increment"
  | "manual_decrement"
  | "order_capture"
  | "order_restock";

export type AdminInventoryItem = {
  id: string;
  store_id: string;
  product_id: string;
  product_name?: string | null;
  category_id?: string | null;
  img_url?: string | null;
  sku: string;
  is_active: boolean;
  available_quantity: number;
  reserved_quantity: number;
  unit_label: string;
  unit_weight_grams: number;
  max_per_order: number;
  allow_substitutions: boolean;
  substitution_group?: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminInventoryListResponse = {
  items: AdminInventoryItem[];
  total: number;
  page: number;
  page_size: number;
};

export type AdminInventoryItemUpsertPayload = {
  sku: string;
  is_active: boolean;
  available_quantity: number;
  reserved_quantity: number;
  unit_label: string;
  unit_weight_grams: number;
  max_per_order: number;
  allow_substitutions: boolean;
  substitution_group?: string | null;
};

export type AdminInventoryAdjustment = {
  id: string;
  inventory_item_id: string;
  product_id: string;
  store_id: string;
  adjustment_type: InventoryAdjustmentType;
  delta_quantity: number;
  reason: string;
  actor_user_id?: string | null;
  reference_type?: string | null;
  reference_id?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type AdminInventoryAdjustmentListResponse = {
  items: AdminInventoryAdjustment[];
  total: number;
  page: number;
  page_size: number;
};

export type AdminInventoryAdjustmentPayload = {
  adjustment_type: InventoryAdjustmentType;
  quantity: number;
  reason: string;
  reference_type?: string | null;
  reference_id?: string | null;
  metadata?: Record<string, unknown>;
};

export type DeliveryFeeRule = {
  id: string;
  store_id: string;
  currency: string;
  min_weight_grams: number;
  max_weight_grams: number;
  fee_minor: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DeliveryFeeRuleListResponse = {
  items: DeliveryFeeRule[];
};

export type DeliveryFeeRulePayload = {
  currency: string;
  min_weight_grams: number;
  max_weight_grams: number;
  fee_minor: number;
  is_active: boolean;
};

export type OrderStatus =
  | "pending_payment"
  | "payment_processing"
  | "confirmed"
  | "picking"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "partially_refunded"
  | "refunded"
  | "canceled"
  | "payment_failed";

export type SubstitutionResolution = "none" | "user_approved" | "admin_replaced" | "removed";

export type AdminOrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  img_url: string;
  quantity: number;
  unit_label: string;
  unit_weight_grams: number;
  unit_price_minor: number;
  line_total_minor: number;
  currency: string;
  allow_substitutions: boolean;
  substitution_resolution: SubstitutionResolution;
  substituted_product_id?: string | null;
};

export type AdminOrderPricingSummary = {
  currency: string;
  subtotal_minor: number;
  delivery_fee_minor: number;
  service_fee_minor: number;
  total_minor: number;
  total_weight_grams: number;
};

export type AdminOrderPaymentSummary = {
  currency: string;
  wallet_amount_minor: number;
  card_amount_minor: number;
  total_paid_minor: number;
  provider?: string | null;
  provider_payment_intent_id?: string | null;
};

export type AdminOrderStatusHistoryEntry = {
  status: OrderStatus;
  note: string;
  actor_user_id?: string | null;
  created_at: string;
};

export type AdminOrder = {
  id: string;
  order_number: string;
  user_id: string;
  store_id: string;
  status: OrderStatus;
  currency: string;
  items: AdminOrderItem[];
  pricing_summary: AdminOrderPricingSummary;
  address_snapshot: Record<string, unknown>;
  substitution_policy: Record<string, unknown>;
  payment_summary: AdminOrderPaymentSummary;
  cancellation_window_expires_at?: string | null;
  status_history: AdminOrderStatusHistoryEntry[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type AdminOrderListResponse = {
  items: AdminOrder[];
  next_cursor?: string | null;
};

export type RefundLineItem = {
  item_id: string;
  quantity: number;
};

export type AdminRefund = {
  id: string;
  order_id: string;
  user_id: string;
  status: string;
  currency: string;
  refund_type: string;
  reason: string;
  wallet_refund_minor: number;
  card_refund_minor: number;
  line_items: Array<Record<string, unknown>>;
  provider?: string | null;
  provider_refund_id?: string | null;
  idempotency_key: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type AdminRefundListResponse = {
  items: AdminRefund[];
};

export type AdminOrderStatusUpdatePayload = {
  status: OrderStatus;
  note: string;
};

export type AdminOrderSubstitutionPayload = {
  replacement_product_id?: string | null;
  note?: string | null;
};

export type AdminRefundCreatePayload = {
  reason: string;
  amount_minor?: number;
  line_items?: RefundLineItem[];
  idempotency_key: string;
};

export type AdminUploadAsset = {
  url: string;
  storage_backend: string;
  content_type: string;
  original_filename: string;
};

export type AdminUploadResponse = {
  items: AdminUploadAsset[];
};
