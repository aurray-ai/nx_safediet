import { redirect } from "next/navigation";

import { API_BASE_URL } from "@/lib/config";
import { getSession } from "@/lib/session";
import type {
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
  DeliveryFeeRuleListResponse,
  LoginResponse,
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
  before?: string;
  limit?: number;
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
    throw new Error(`Cannot reach the SafeDaet API at ${API_BASE_URL}. ${detail}`);
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
    ["before", query.before],
    ["limit", query.limit ?? 20],
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
