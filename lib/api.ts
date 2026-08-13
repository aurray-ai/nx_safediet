import { redirect } from "next/navigation";

import { API_BASE_URL } from "@/lib/config";
import { getSession } from "@/lib/session";
import type {
  AdminCustomerAuditListResponse,
  AdminCustomerDetail,
  AdminCustomerListResponse,
  AdminMeal,
  AdminMealListResponse,
  AdminMealMetadata,
  AdminInventoryAdjustmentListResponse,
  AdminInventoryItem,
  AdminInventoryListResponse,
  AdminMetadata,
  AdminOrder,
  AdminOrderListResponse,
  AdminProduct,
  AdminProductListResponse,
  AdminRefundListResponse,
  AdminSurvey,
  AdminSurveyListResponse,
  AdminSurveyResponseListResponse,
  AdminSurveyTemplateListResponse,
  DeliveryFeeRuleListResponse,
  Discount,
  DiscountAuditListResponse,
  DiscountListResponse,
  DiscountProductListResponse,
  FulfillmentOverviewResponse,
  GroceryOrderFulfillment,
  GroceryOrderFulfillmentListResponse,
  LoginResponse,
  MealOrderFulfillment,
  MealOrderFulfillmentListResponse,
  PublicSurvey,
  StaffListResponse,
  SurveyAnalytics,
  SurveySubmission,
  WorkerListResponse,
  WorkerRosterListResponse,
} from "@/lib/types";

class SessionExpiredError extends Error {}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
};

type AdminProductQuery = {
  search?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
};

type AdminInventoryQuery = {
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
};

type AdminOrderQuery = {
  status?: string;
  page?: number;
  pageSize?: number;
};

type AdminSurveyQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
};

function buildQueryString(entries: Array<[string, string | number | boolean | null | undefined]>) {
  const params = new URLSearchParams();

  for (const [key, value] of entries) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    params.set(key, String(value));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown network error.";
    throw new Error(`Cannot reach the Safediet API at ${API_BASE_URL}. ${detail}`);
  }

  if (!response.ok) {
    let detail = "Request failed.";

    try {
      const payload = (await response.json()) as { detail?: string };
      detail = payload.detail ?? detail;
    } catch {
      detail = response.statusText || detail;
    }

    if (
      response.status === 401 &&
      (detail === "Invalid or expired access token." ||
        detail === "Authenticated user not found." ||
        detail === "Authentication required.")
    ) {
      throw new SessionExpiredError(detail);
    }

    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function registerCustomer(payload: Record<string, unknown>): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function acceptStaffInvitation(token: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(`/auth/staff-invitations/${encodeURIComponent(token)}/accept`, {
    method: "POST",
    body: { password },
  });
}

export async function fetchAdminProducts(search?: string): Promise<AdminProductListResponse> {
  return fetchAdminProductsPage({ search });
}

export async function fetchAdminProductsPage(query: AdminProductQuery = {}): Promise<AdminProductListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["search", query.search?.trim() || undefined],
    ["category_id", query.categoryId],
    ["page", query.page ?? 1],
    ["page_size", query.pageSize ?? 24],
  ]);

  try {
    return await apiRequest<AdminProductListResponse>(`/admin/groceries/products${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminMetadata(): Promise<AdminMetadata> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<AdminMetadata>("/admin/groceries/metadata", {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminProduct(productId: string): Promise<AdminProduct> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<AdminProduct>(`/admin/groceries/products/${productId}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminMealMetadata(): Promise<AdminMealMetadata> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<AdminMealMetadata>("/admin/meals/metadata", {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminMeals(search?: string): Promise<AdminMealListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["search", search?.trim() || undefined],
    ["page", 1],
    ["page_size", 100],
  ]);

  try {
    return await apiRequest<AdminMealListResponse>(`/admin/meals${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminMeal(mealId: string): Promise<AdminMeal> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<AdminMeal>(`/admin/meals/${mealId}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminInventory(query: AdminInventoryQuery = {}): Promise<AdminInventoryListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["search", query.search?.trim() || undefined],
    ["is_active", query.isActive],
    ["page", query.page ?? 1],
    ["page_size", query.pageSize ?? 20],
  ]);

  try {
    return await apiRequest<AdminInventoryListResponse>(`/admin/groceries/inventory${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminInventoryItem(productId: string): Promise<AdminInventoryItem> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<AdminInventoryItem>(`/admin/groceries/inventory/${productId}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminInventoryAdjustments(
  productId: string,
  page = 1,
  pageSize = 20,
): Promise<AdminInventoryAdjustmentListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["page", page],
    ["page_size", pageSize],
  ]);

  try {
    return await apiRequest<AdminInventoryAdjustmentListResponse>(
      `/admin/groceries/inventory/${productId}/adjustments${queryString}`,
      {
        token: session.accessToken,
      },
    );
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchDeliveryFeeRules(currency?: string): Promise<DeliveryFeeRuleListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([["currency", currency?.trim().toUpperCase() || undefined]]);

  try {
    return await apiRequest<DeliveryFeeRuleListResponse>(
      `/admin/groceries/inventory/delivery-fees/list${queryString}`,
      {
        token: session.accessToken,
      },
    );
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminOrders(query: AdminOrderQuery = {}): Promise<AdminOrderListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["status", query.status],
    ["page", query.page ?? 1],
    ["page_size", query.pageSize ?? 20],
  ]);

  try {
    return await apiRequest<AdminOrderListResponse>(`/admin/grocery-orders${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminOrder(orderId: string): Promise<AdminOrder> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<AdminOrder>(`/admin/grocery-orders/${orderId}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminOrderRefunds(orderId: string): Promise<AdminRefundListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<AdminRefundListResponse>(`/admin/grocery-orders/${orderId}/refunds`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

// --- Order fulfillment (chef + shopper tracks) ---

type FulfillmentListQuery = {
  before?: string;
  limit?: number;
};

type WorkerListQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export async function fetchAdminMealOrders(query: FulfillmentListQuery = {}): Promise<MealOrderFulfillmentListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["before", query.before],
    ["limit", query.limit ?? 20],
  ]);

  try {
    return await apiRequest<MealOrderFulfillmentListResponse>(`/admin/meal-orders${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminMealOrder(orderId: string): Promise<MealOrderFulfillment> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<MealOrderFulfillment>(`/admin/meal-orders/${orderId}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminChefs(query: WorkerListQuery = {}): Promise<WorkerListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["page", query.page ?? 1],
    ["page_size", query.pageSize ?? 50],
    ["search", query.search?.trim() || undefined],
  ]);

  try {
    return await apiRequest<WorkerListResponse>(`/admin/meal-orders/chefs${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminShoppers(query: WorkerListQuery = {}): Promise<WorkerListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["page", query.page ?? 1],
    ["page_size", query.pageSize ?? 50],
    ["search", query.search?.trim() || undefined],
  ]);

  try {
    return await apiRequest<WorkerListResponse>(`/admin/grocery-orders/shoppers${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminChefRoster(query: WorkerListQuery = {}): Promise<WorkerRosterListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["page", query.page ?? 1],
    ["page_size", query.pageSize ?? 50],
    ["search", query.search?.trim() || undefined],
  ]);

  try {
    return await apiRequest<WorkerRosterListResponse>(`/admin/meal-orders/chefs/roster${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminShopperRoster(query: WorkerListQuery = {}): Promise<WorkerRosterListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["page", query.page ?? 1],
    ["page_size", query.pageSize ?? 50],
    ["search", query.search?.trim() || undefined],
  ]);

  try {
    return await apiRequest<WorkerRosterListResponse>(`/admin/grocery-orders/shoppers/roster${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminFulfillmentOverview(): Promise<FulfillmentOverviewResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<FulfillmentOverviewResponse>("/admin/fulfillment/overview", {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

type StaffListQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
};

type AdminCustomerListQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export async function fetchAdminStaff(query: StaffListQuery = {}): Promise<StaffListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["page", query.page ?? 1],
    ["page_size", query.pageSize ?? 20],
    ["search", query.search?.trim() || undefined],
    ["role", query.role],
  ]);

  try {
    return await apiRequest<StaffListResponse>(`/admin/staff${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminCustomers(query: AdminCustomerListQuery = {}): Promise<AdminCustomerListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["page", query.page ?? 1],
    ["page_size", query.pageSize ?? 20],
    ["search", query.search?.trim() || undefined],
  ]);

  try {
    return await apiRequest<AdminCustomerListResponse>(`/admin/customers${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminCustomer(userId: string): Promise<AdminCustomerDetail> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<AdminCustomerDetail>(`/admin/customers/${userId}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminCustomerAuditLog(userId: string): Promise<AdminCustomerAuditListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<AdminCustomerAuditListResponse>(`/admin/customers/${userId}/audit-log`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminDiscounts(): Promise<DiscountListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<DiscountListResponse>("/admin/discounts", {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminDiscount(discountId: string): Promise<Discount> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<Discount>(`/admin/discounts/${discountId}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

type DiscountProductListQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export async function fetchAdminDiscountProducts(
  discountId: string,
  query: DiscountProductListQuery = {},
): Promise<DiscountProductListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["page", query.page ?? 1],
    ["page_size", query.pageSize ?? 20],
    ["search", query.search?.trim() || undefined],
  ]);

  try {
    return await apiRequest<DiscountProductListResponse>(`/admin/discounts/${discountId}/products${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminDiscountAuditLog(discountId: string): Promise<DiscountAuditListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<DiscountAuditListResponse>(`/admin/discounts/${discountId}/audit-log`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchChefMealOrders(query: FulfillmentListQuery = {}): Promise<MealOrderFulfillmentListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["before", query.before],
    ["limit", query.limit ?? 20],
  ]);

  try {
    return await apiRequest<MealOrderFulfillmentListResponse>(`/chef/orders${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchChefMealOrder(orderId: string): Promise<MealOrderFulfillment> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<MealOrderFulfillment>(`/chef/orders/${orderId}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchShopperGroceryOrders(query: FulfillmentListQuery = {}): Promise<GroceryOrderFulfillmentListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["before", query.before],
    ["limit", query.limit ?? 20],
  ]);

  try {
    return await apiRequest<GroceryOrderFulfillmentListResponse>(`/shopper/orders${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchShopperGroceryOrder(orderId: string): Promise<GroceryOrderFulfillment> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<GroceryOrderFulfillment>(`/shopper/orders/${orderId}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminSurveys(query: AdminSurveyQuery = {}): Promise<AdminSurveyListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const queryString = buildQueryString([
    ["search", query.search?.trim() || undefined],
    ["page", query.page ?? 1],
    ["page_size", query.pageSize ?? 24],
  ]);

  try {
    return await apiRequest<AdminSurveyListResponse>(`/admin/surveys${queryString}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminSurvey(surveyId: string): Promise<AdminSurvey> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<AdminSurvey>(`/admin/surveys/${surveyId}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminSurveyTemplates(): Promise<AdminSurveyTemplateListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<AdminSurveyTemplateListResponse>("/admin/surveys/templates", {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminSurveyResponses(surveyId: string): Promise<AdminSurveyResponseListResponse> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<AdminSurveyResponseListResponse>(`/admin/surveys/${surveyId}/responses`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminSurveyResponse(
  surveyId: string,
  responseId: string,
): Promise<SurveySubmission> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<SurveySubmission>(`/admin/surveys/${surveyId}/responses/${responseId}`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchAdminSurveyAnalytics(surveyId: string): Promise<SurveyAnalytics> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  try {
    return await apiRequest<SurveyAnalytics>(`/admin/surveys/${surveyId}/analytics`, {
      token: session.accessToken,
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchPublicSurvey(slug: string): Promise<PublicSurvey> {
  return apiRequest<PublicSurvey>(`/surveys/${slug}`);
}
