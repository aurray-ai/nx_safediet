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

export type HouseholdInvitationResponse = {
  id: string;
  household_id: string;
  invited_by_user_id: string;
  invitee_email: string;
  invitee_user_id?: string | null;
  display_name: string;
  role: string;
  status: string;
  share_weight: number;
  expires_at: string;
  accepted_at?: string | null;
  accepted_by_user_id?: string | null;
  created_at: string;
  updated_at: string;
};

export type HouseholdInvitationDetailResponse = {
  invitation: HouseholdInvitationResponse;
  household_name: string;
  inviter_name: string;
  requires_registration: boolean;
  is_existing_user: boolean;
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

export type AdminMeasurementUnitOption = {
  code: string;
  display_name: string;
  measurement_type: string;
  canonical_unit: string;
  multiplier_to_canonical: number;
  is_fractional_allowed: boolean;
  default_rounding_rule: string;
  aliases: string[];
};

export type AdminIngredientConversionProfileOption = {
  id: string;
  name: string;
  ingredient_name: string;
  linked_product_ids: string[];
  unit_code: string;
  canonical_quantity: number;
  canonical_unit: string;
  notes: string;
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
  measurement_type?: string | null;
  unit_code?: string | null;
  canonical_quantity?: number | null;
  canonical_unit?: string | null;
  conversion_profile_id?: string | null;
  scaling_behavior?: string | null;
  rounding_rule?: string | null;
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
  measurement_units: AdminMeasurementUnitOption[];
  ingredient_conversion_profiles: AdminIngredientConversionProfileOption[];
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
  fulfillment_status: "unassigned" | "assigned" | "shopping" | "packed";
  assigned_worker_id?: string | null;
  assigned_by?: string | null;
  assigned_at?: string | null;
  assignment_history: Array<{
    action: string;
    worker_id?: string | null;
    actor_user_id?: string | null;
    note: string;
    created_at: string;
  }>;
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

export type SurveyStatus = "draft" | "published" | "closed";

export type SurveyQuestionType =
  | "short_text"
  | "paragraph"
  | "single_choice"
  | "multiple_choice"
  | "dropdown"
  | "linear_scale"
  | "email"
  | "number"
  | "date"
  | "time";

export type SurveyReportKey =
  | "planning_frequency"
  | "planning_difficulty"
  | "planning_challenge"
  | "household_size"
  | "budget_cadence"
  | "budget_overrun_frequency"
  | "overspend_causes"
  | "feature_demand"
  | "total_time_spent"
  | "open_feedback";

export type SurveySettings = {
  is_public: boolean;
  collect_email: boolean;
  require_auth: boolean;
  limit_one_response_per_user: boolean;
  limit_one_response_per_email: boolean;
  show_progress_bar: boolean;
  shuffle_question_order: boolean;
  confirmation_message: string;
  accepting_responses: boolean;
};

export type SurveyTheme = {
  accent_color: string;
  header_image_url: string;
  font_family: string;
};

export type SurveySection = {
  id: string;
  title: string;
  description: string;
  position: number;
};

export type SurveyQuestionOption = {
  id: string;
  label: string;
  value: string;
  position: number;
};

export type SurveyQuestionValidation = {
  min_length?: number | null;
  max_length?: number | null;
  min_value?: number | null;
  max_value?: number | null;
  max_selections?: number | null;
  regex?: string | null;
};

export type SurveyQuestionConfig = {
  placeholder?: string | null;
  allow_other: boolean;
  scale_min?: number | null;
  scale_max?: number | null;
  scale_min_label?: string | null;
  scale_max_label?: string | null;
};

export type SurveyQuestion = {
  id: string;
  section_id: string;
  position: number;
  type: SurveyQuestionType;
  report_key?: SurveyReportKey | null;
  title: string;
  description: string;
  required: boolean;
  options: SurveyQuestionOption[];
  validation: SurveyQuestionValidation;
  config: SurveyQuestionConfig;
};

export type AdminSurvey = {
  id: string;
  owner_user_id: string;
  slug: string;
  title: string;
  description: string;
  status: SurveyStatus;
  settings: SurveySettings;
  theme: SurveyTheme;
  sections: SurveySection[];
  questions: SurveyQuestion[];
  version: number;
  response_count: number;
  published_at?: string | null;
  closed_at?: string | null;
  last_response_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminSurveyListResponse = {
  items: AdminSurvey[];
  total: number;
  page: number;
  page_size: number;
};

export type PublicSurvey = Omit<AdminSurvey, "owner_user_id">;

export type SurveyAnswerSubmission = {
  question_id: string;
  value: unknown;
};

export type SurveyResponseSubmissionPayload = {
  respondent_email?: string | null;
  respondent_name?: string | null;
  answers: SurveyAnswerSubmission[];
};

export type SurveySubmissionAnswer = {
  question_id: string;
  type: SurveyQuestionType;
  value: unknown;
};

export type SurveyRespondent = {
  user_id?: string | null;
  email?: string | null;
  name?: string | null;
  user_agent?: string | null;
};

export type SurveySubmission = {
  id: string;
  survey_id: string;
  survey_slug: string;
  survey_version: number;
  respondent: SurveyRespondent;
  answers: SurveySubmissionAnswer[];
  submitted_at: string;
  created_at: string;
};

export type AdminSurveyResponseListResponse = {
  items: SurveySubmission[];
  total: number;
  survey_id: string;
};

export type SurveyQuestionAnalytics = {
  question_id: string;
  title: string;
  type: SurveyQuestionType;
  response_count: number;
  choice_counts: Record<string, number>;
};

export type SurveyReportMetric = {
  label: string;
  value: string;
  detail: string;
};

export type SurveyRankedItem = {
  label: string;
  count: number;
  percent: number;
};

export type SurveySegmentDemand = {
  segment: string;
  top_feature: string;
  top_feature_percent: number;
  response_count: number;
};

export type SurveyFeedbackSnippet = {
  text: string;
  tags: string[];
  tone: string;
  urgency: string;
};

export type SurveyThemeShare = {
  label: string;
  count: number;
  percent: number;
};

export type SurveyCoreReportOverview = {
  top_blocker: string;
  top_feature: string;
  dominant_theme: string;
  top_issue_share: number;
  feature_demand_share: number;
  theme_share: number;
};

export type SurveyMealPlanningReport = {
  metrics: SurveyReportMetric[];
  frequency: SurveyRankedItem[];
  challenges: SurveyRankedItem[];
  segments: SurveyRankedItem[];
};

export type SurveyBudgetRiskReport = {
  metrics: SurveyReportMetric[];
  cadence: SurveyRankedItem[];
  overspend_frequency: SurveyRankedItem[];
  overspend_causes: SurveyRankedItem[];
};

export type SurveyFeatureDemandReport = {
  metrics: SurveyReportMetric[];
  features: SurveyRankedItem[];
  time_bands: SurveyRankedItem[];
  segment_demand: SurveySegmentDemand[];
};

export type SurveyOpenFeedbackReport = {
  metrics: SurveyReportMetric[];
  themes: SurveyThemeShare[];
  sentiment: SurveyThemeShare[];
  urgency: SurveyThemeShare[];
  snippets: SurveyFeedbackSnippet[];
};

export type SurveyCoreReports = {
  has_responses: boolean;
  response_count: number;
  overview: SurveyCoreReportOverview;
  meal_planning: SurveyMealPlanningReport;
  budget_risk: SurveyBudgetRiskReport;
  feature_demand: SurveyFeatureDemandReport;
  open_feedback: SurveyOpenFeedbackReport;
};

export type SurveyAnalytics = {
  survey_id: string;
  total_responses: number;
  latest_response_at?: string | null;
  question_stats: SurveyQuestionAnalytics[];
  core_reports: SurveyCoreReports;
};

export type SurveyTemplate = {
  template_id: string;
  name: string;
  description: string;
  survey: {
    title: string;
    slug: string;
    description: string;
    settings: SurveySettings;
    theme: SurveyTheme;
    sections: SurveySection[];
    questions: SurveyQuestion[];
  };
};

export type AdminSurveyTemplateListResponse = {
  items: SurveyTemplate[];
};

// --- Order fulfillment (chef + shopper tracks) ---

export type ChefFulfillmentStatus = "unassigned" | "assigned" | "preparing" | "ready_for_delivery";
export type ShopperFulfillmentStatus = "unassigned" | "assigned" | "shopping" | "packed";

export type FulfillmentAssignmentHistoryEntry = {
  action: string;
  worker_id?: string | null;
  actor_user_id?: string | null;
  note: string;
  created_at: string;
};

export type WorkerSummary = {
  id: string;
  name: string;
  email: string;
};

export type WorkerListResponse = {
  items: WorkerSummary[];
  total: number;
};

export type MealOrderFulfillmentItem = {
  id: string;
  meal_id: string;
  meal_name: string;
  img_url: string;
  servings: number;
  unit_price_minor: number;
  line_total_minor: number;
  currency: string;
  delivery_date?: string | null;
  slot: string;
};

export type MealOrderFulfillment = {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  currency: string;
  items: MealOrderFulfillmentItem[];
  total_minor: number;
  fulfillment_status: ChefFulfillmentStatus;
  assigned_worker_id?: string | null;
  assigned_by?: string | null;
  assigned_at?: string | null;
  assignment_history: FulfillmentAssignmentHistoryEntry[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type MealOrderFulfillmentListResponse = {
  items: MealOrderFulfillment[];
  next_cursor?: string | null;
};

export type GroceryOrderFulfillmentItem = {
  id: string;
  product_id: string;
  product_name: string;
  img_url: string;
  quantity: number;
  unit_label: string;
  unit_price_minor: number;
  line_total_minor: number;
  currency: string;
  source_meal_id?: string | null;
};

export type GroceryOrderFulfillment = {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  currency: string;
  items: GroceryOrderFulfillmentItem[];
  total_minor: number;
  fulfillment_status: ShopperFulfillmentStatus;
  assigned_worker_id?: string | null;
  assigned_by?: string | null;
  assigned_at?: string | null;
  assignment_history: FulfillmentAssignmentHistoryEntry[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type GroceryOrderFulfillmentListResponse = {
  items: GroceryOrderFulfillment[];
  next_cursor?: string | null;
};

export type AssignWorkerPayload = {
  worker_id: string;
  note?: string;
};

export type FulfillmentStatusUpdatePayload = {
  status: string;
  note?: string;
};

export type DeclineOrderPayload = {
  reason_code: string;
  note?: string;
};

export type RealtimeSessionResponse = {
  accessToken: string;
  wsUrl: string;
  locations: string[];
};

export type WorkerRosterEntry = {
  id: string;
  name: string;
  email: string;
  active_count: number;
  completed_this_week: number;
};

export type WorkerRosterListResponse = {
  items: WorkerRosterEntry[];
  total: number;
};

export type TrackOverview = {
  unassigned: number;
  in_progress: number;
  completed_this_week: number;
};

export type FulfillmentOverviewResponse = {
  chef: TrackOverview;
  shopper: TrackOverview;
};

// --- Staff management ---

export type StaffType = "contractor" | "full_time" | "part_time";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  user_types: string[];
  staff_type: StaffType | null;
  created_at: string;
};

export type StaffListResponse = {
  items: StaffUser[];
  total: number;
  page: number;
  page_size: number;
};

export type CreateStaffPayload = {
  name: string;
  email: string;
  user_types: string[];
  staff_type?: StaffType | null;
};

export type UpdateStaffRolesPayload = {
  user_types: string[];
  staff_type?: StaffType | null;
};
