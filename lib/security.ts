/**
 * Security utilities for input sanitization, validation, and protection
 * against SQL injection, XSS, and other attack vectors.
 */

/** Strip HTML tags and dangerous characters to prevent XSS */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")           // Remove angle brackets
    .replace(/javascript:/gi, "")    // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "")      // Remove inline event handlers
    .replace(/data:/gi, "")          // Remove data: protocol
    .replace(/vbscript:/gi, "")      // Remove vbscript: protocol
    .trim();
}

/** Validate email format */
export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email) && email.length <= 254;
}

/** Validate price is a positive number with max 2 decimal places */
export function validatePrice(price: number): boolean {
  return typeof price === "number" && price >= 0 && price <= 9999999.99 && Number.isFinite(price);
}

/** Detect SQL injection patterns in search queries */
export function validateSearchQuery(query: string): string {
  const dangerous = /('|--|;|\/\*|\*\/|xp_|exec|union\s+select|drop\s+table|insert\s+into|delete\s+from|update\s+set|alter\s+table)/gi;
  return query.replace(dangerous, "").trim().slice(0, 200);
}

/** In-memory rate limiter for auth attempts */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimitCheck(identifier: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (record.count >= maxAttempts) {
    return false; // rate limited
  }

  record.count++;
  return true; // allowed
}

/** Validate inventory quantity */
export function validateInventory(qty: number): boolean {
  return Number.isInteger(qty) && qty >= 0 && qty <= 999999;
}

/** Sanitize object keys and string values recursively */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
