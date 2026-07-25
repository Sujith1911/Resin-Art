export type LogLevel = "INFO" | "WARN" | "ERROR" | "AUDIT";

export interface LogPayload {
  action: string;
  category: "AUTH" | "PRODUCT" | "ORDER" | "INVENTORY" | "BANNER" | "SECURITY" | "SYSTEM";
  userId?: string;
  userRole?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  error?: Error | unknown;
}

class Logger {
  private formatLog(level: LogLevel, payload: LogPayload) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      category: payload.category,
      action: payload.action,
      userId: payload.userId || "anonymous",
      userRole: payload.userRole || "guest",
      details: payload.details || {},
      errorName: payload.error instanceof Error ? payload.error.name : undefined,
      errorMessage: payload.error instanceof Error ? payload.error.message : payload.error ? String(payload.error) : undefined,
    };
  }

  info(payload: LogPayload) {
    const entry = this.formatLog("INFO", payload);
    console.log(`[INFO] [${entry.timestamp}] [${entry.category}] ${entry.action}:`, entry.details);
  }

  warn(payload: LogPayload) {
    const entry = this.formatLog("WARN", payload);
    console.warn(`[WARN] [${entry.timestamp}] [${entry.category}] ${entry.action}:`, entry.details);
  }

  error(payload: LogPayload) {
    const entry = this.formatLog("ERROR", payload);
    console.error(`[ERROR] [${entry.timestamp}] [${entry.category}] ${entry.action}:`, entry.errorMessage || entry.details);
  }

  /**
   * Records an immutable security audit event into the database audit trail log.
   */
  async audit(payload: LogPayload) {
    const entry = this.formatLog("AUDIT", payload);
    console.log(`🔒 [AUDIT LOG] [${entry.timestamp}] User (${entry.userId}) performed [${entry.action}] on [${entry.category}]:`, entry.details);

    // Persist to database if Supabase environment variables are available
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { createServerSupabaseClient } = await import("./supabase/server");
        const supabase = await createServerSupabaseClient();
        await supabase.from("audit_logs").insert({
          user_id: payload.userId || null,
          category: payload.category,
          action: payload.action,
          details: payload.details || {},
          ip_address: payload.ipAddress || null,
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn("Audit database insert skipped (offline mode):", err);
    }
  }
}

export const logger = new Logger();
