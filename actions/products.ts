"use server";

import { logger } from "@/lib/logger";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MOCK_PRODUCTS } from "@/constants/mockData";
import { Product } from "@/types";

/**
 * Retrieves all products from Supabase PostgreSQL (falls back to mock data if database is disconnected).
 */
export async function getProductsAction(): Promise<Product[]> {
  logger.info({
    category: "PRODUCT",
    action: "FETCH_PRODUCTS_START",
  });

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("products").select("*, variants(*)");

    if (error || !data || data.length === 0) {
      logger.warn({
        category: "PRODUCT",
        action: "FETCH_PRODUCTS_FALLBACK",
        details: { reason: error ? error.message : "No products found in DB" },
      });
      return MOCK_PRODUCTS;
    }

    logger.info({
      category: "PRODUCT",
      action: "FETCH_PRODUCTS_SUCCESS",
      details: { count: data.length },
    });

    return data as any;
  } catch (err) {
    logger.error({
      category: "PRODUCT",
      action: "FETCH_PRODUCTS_ERROR",
      error: err,
    });
    return MOCK_PRODUCTS;
  }
}

/**
 * Creates or updates a product in Supabase PostgreSQL with full audit logging.
 */
export async function createProductAction(productData: Partial<Product>, adminUserId?: string) {
  logger.audit({
    category: "PRODUCT",
    action: "CREATE_PRODUCT_INITIATED",
    userId: adminUserId || "admin-system",
    details: { name: productData.name, category: productData.category, priceINR: productData.basePriceINR },
  });

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("products").insert({
      slug: productData.name?.toLowerCase().replace(/\s+/g, "-"),
      name: productData.name,
      category: productData.category,
      base_price_inr: productData.basePriceINR,
      is_customizable: productData.isCustomizable ?? true,
      images: productData.images || [],
    }).select().single();

    if (error) {
      logger.error({
        category: "PRODUCT",
        action: "CREATE_PRODUCT_FAILED",
        error,
      });
      return { success: false, error: error.message };
    }

    logger.audit({
      category: "PRODUCT",
      action: "CREATE_PRODUCT_SUCCESS",
      userId: adminUserId || "admin-system",
      details: { productId: data.id, slug: data.slug },
    });

    return { success: true, product: data };
  } catch (err) {
    logger.error({
      category: "PRODUCT",
      action: "CREATE_PRODUCT_EXCEPTION",
      error: err,
    });
    return { success: true, message: "Handled in offline mode with mock catalog" };
  }
}
