"use server";

import { logger } from "@/lib/logger";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function advanceOrderStepAction(orderId: string, currentStep: string, nextStep: string, adminUserId?: string) {
  logger.audit({
    category: "ORDER",
    action: "ADVANCE_ORDER_WORKSHOP_STEP",
    userId: adminUserId || "admin-system",
    details: { orderId, currentStep, nextStep },
  });

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("orders")
      .update({ workshop_status: nextStep, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      logger.error({
        category: "ORDER",
        action: "ADVANCE_ORDER_STEP_FAILED",
        error,
      });
      return { success: false, error: error.message };
    }

    logger.audit({
      category: "ORDER",
      action: "ADVANCE_ORDER_STEP_SUCCESS",
      userId: adminUserId || "admin-system",
      details: { orderId, nextStep },
    });

    return { success: true };
  } catch (err) {
    logger.error({
      category: "ORDER",
      action: "ADVANCE_ORDER_STEP_EXCEPTION",
      error: err,
    });
    return { success: true };
  }
}
