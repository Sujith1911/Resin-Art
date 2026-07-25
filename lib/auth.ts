import { createServerSupabaseClient } from "@/lib/supabase/server";

export type UserRole = "Super Admin" | "Admin" | "Inventory Manager" | "Marketing Manager" | "Support Agent" | "Customer";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

/**
 * Get the current authenticated user with their role.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Fetch user role from user_roles + roles tables
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role_id, roles(name)")
      .eq("user_id", user.id)
      .single();

    const role: UserRole = (roleData as any)?.roles?.name || "Customer";

    return {
      id: user.id,
      email: user.email || "",
      role,
      name: (user.user_metadata as any)?.name || user.email?.split("@")[0],
    };
  } catch {
    return null;
  }
}

/**
 * Get the role of a specific user by ID.
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("user_roles")
      .select("role_id, roles(name)")
      .eq("user_id", userId)
      .single();

    return (data as any)?.roles?.name || "Customer";
  } catch {
    return "Customer";
  }
}

/**
 * Check if a user has admin-level access.
 */
export function isAdminRole(role: UserRole): boolean {
  return ["Super Admin", "Admin"].includes(role);
}

/**
 * Check if a user has permission for a specific module and action.
 * Per RBAC doc: Every module supports View/Create/Edit/Delete/Publish/Archive/Restore/Export
 */
export function hasPermission(
  role: UserRole,
  module: string,
  action: "view" | "create" | "edit" | "delete" | "publish" | "archive" | "export"
): boolean {
  // Super Admin has full access to everything
  if (role === "Super Admin") return true;

  // Admin has full access except role/permission management
  if (role === "Admin") {
    if (module === "roles" || module === "permissions") return action === "view";
    return true;
  }

  // Inventory Manager: products, variants, stock
  if (role === "Inventory Manager") {
    if (["products", "variants", "inventory"].includes(module)) return true;
    if (module === "orders") return action === "view";
    return false;
  }

  // Marketing Manager: banners, coupons, discounts, blogs, SEO
  if (role === "Marketing Manager") {
    if (["banners", "coupons", "discounts", "blogs", "seo", "media"].includes(module)) return true;
    if (["products", "orders"].includes(module)) return action === "view";
    return false;
  }

  // Support Agent: tickets, customer inquiries
  if (role === "Support Agent") {
    if (module === "support") return true;
    if (["orders", "customers"].includes(module)) return action === "view";
    return false;
  }

  // Customer: own orders, profile, wishlist, cart, reviews, support tickets
  if (role === "Customer") {
    if (["profile", "addresses", "wishlist", "cart", "reviews", "support"].includes(module)) {
      return ["view", "create", "edit", "delete"].includes(action);
    }
    if (module === "orders") return action === "view";
    return false;
  }

  return false;
}

/**
 * Server-side guard. Throws if user doesn't have required role.
 */
export async function requireRole(requiredRoles: UserRole[]): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  if (!requiredRoles.includes(user.role)) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}
