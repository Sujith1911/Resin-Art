import { createClient } from "@/lib/supabase/client";

// ====================================================================
// PRODUCTS
// ====================================================================

export interface DbProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  category_id: string | null;
  base_price_inr: number;
  compare_at_price_inr: number | null;
  rating: number;
  review_count: number;
  is_customizable: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  status: "Draft" | "Published" | "Archived";
  flower_details: string | null;
  resin_type: string | null;
  materials: string[];
  care_guide: string[];
  images: string[];
  created_at: string;
  updated_at: string;
  // Joined
  category?: { id: string; name: string; slug: string } | null;
  product_variants?: DbProductVariant[];
}

export interface DbProductVariant {
  id: string;
  product_id: string;
  sku: string;
  title: string;
  price_inr: number;
  compare_at_price_inr: number | null;
  inventory_quantity: number;
  metal_color: string | null;
  size: string | null;
  shape: string | null;
  weight_grams: number | null;
  dimensions_cm: string | null;
  images: string[];
}

export async function getProducts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), product_variants(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as DbProduct[];
}

export async function getPublishedProducts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), product_variants(*)")
    .eq("status", "Published")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as DbProduct[];
}

export async function getProductBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), product_variants(*)")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as DbProduct;
}

export async function createProduct(product: {
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  category_id?: string;
  base_price_inr: number;
  compare_at_price_inr?: number;
  is_customizable?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  status?: string;
  flower_details?: string;
  resin_type?: string;
  materials?: string[];
  images?: string[];
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data as DbProduct;
}

export async function updateProduct(id: string, updates: Partial<DbProduct>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as DbProduct;
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// Product Variants
export async function createProductVariant(variant: {
  product_id: string;
  sku: string;
  title: string;
  price_inr: number;
  inventory_quantity?: number;
  metal_color?: string;
  size?: string;
  shape?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("product_variants")
    .insert(variant)
    .select()
    .single();

  if (error) throw error;
  return data as DbProductVariant;
}

export async function updateVariantStock(id: string, quantity: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("product_variants")
    .update({ inventory_quantity: quantity })
    .eq("id", id);

  if (error) throw error;
}

// ====================================================================
// CATEGORIES
// ====================================================================

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

export async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return (data || []) as DbCategory[];
}

// ====================================================================
// BANNERS
// ====================================================================

export interface DbBanner {
  id: string;
  type: string;
  title: string;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  desktop_image_url: string;
  mobile_image_url: string | null;
  is_active: boolean;
  status: "Draft" | "Scheduled" | "Active" | "Archived";
  priority: number;
  click_count: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export async function getBanners() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("priority", { ascending: true });

  if (error) throw error;
  return (data || []) as DbBanner[];
}

export async function getActiveBanners() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("priority", { ascending: true });

  if (error) throw error;
  return (data || []) as DbBanner[];
}

export async function createBanner(banner: {
  type: string;
  title: string;
  subtitle?: string;
  cta_text?: string;
  cta_link?: string;
  desktop_image_url: string;
  mobile_image_url?: string;
  is_active?: boolean;
  status?: string;
  priority?: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("banners")
    .insert(banner)
    .select()
    .single();

  if (error) throw error;
  return data as DbBanner;
}

export async function updateBanner(id: string, updates: Partial<DbBanner>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("banners")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as DbBanner;
}

export async function deleteBanner(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;
}

// ====================================================================
// ORDERS
// ====================================================================

export interface DbOrder {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Record<string, any>;
  subtotal_inr: number;
  discount_inr: number;
  shipping_inr: number;
  cgst_inr: number;
  sgst_inr: number;
  total_inr: number;
  payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  workshop_status: string;
  tracking_number: string | null;
  payment_screenshot_url?: string | null;
  payment_uploaded_at?: string | null;
  payment_verification_status?: string | null;
  delivery_partner?: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function getOrders() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as DbOrder[];
}

export async function getUserOrders(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as DbOrder[];
}

export async function updateOrderStatus(id: string, workshopStatus: string, trackingNumber?: string) {
  const supabase = createClient();
  const updates: Record<string, any> = { workshop_status: workshopStatus };
  if (trackingNumber !== undefined) updates.tracking_number = trackingNumber;
  
  // Auto-set payment_status based on workshop stage
  if (workshopStatus.startsWith("2.")) updates.payment_status = "PAID";

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as DbOrder;
}

export async function createOrder(order: {
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Record<string, any>;
  subtotal_inr: number;
  discount_inr?: number;
  shipping_inr?: number;
  cgst_inr: number;
  sgst_inr: number;
  total_inr: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data as DbOrder;
}

// ====================================================================
// COUPONS / DISCOUNTS
// ====================================================================

export interface DbCoupon {
  id: string;
  code: string;
  type: "Percentage" | "Flat INR" | "Free Shipping" | "Free Packaging" | "BOGO";
  discount_value: string;
  min_purchase_inr: number;
  max_usage: number;
  used_count: number;
  is_active: boolean;
  categories: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export async function getCoupons() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as DbCoupon[];
}

export async function createCoupon(coupon: {
  code: string;
  type: string;
  discount_value: string;
  min_purchase_inr?: number;
  max_usage?: number;
  is_active?: boolean;
  categories?: string;
  start_date?: string;
  end_date?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("coupons")
    .insert(coupon)
    .select()
    .single();

  if (error) throw error;
  return data as DbCoupon;
}

export async function updateCoupon(id: string, updates: Partial<DbCoupon>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("coupons")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as DbCoupon;
}

export async function deleteCoupon(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw error;
}

// ====================================================================
// AUDIT LOGS
// ====================================================================

export async function logAudit(category: string, action: string, details?: Record<string, any>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("audit_logs").insert({
    user_id: user?.id || null,
    category,
    action,
    details: details || {},
  });
}

// ====================================================================
// ADMIN PAYMENT QR CODES
// ====================================================================

export interface DbPaymentQr {
  id: string;
  name: string;
  upi_id: string;
  qr_image_url: string;
  is_active: boolean;
  notes: string | null;
  updated_at: string;
  created_at: string;
}

export async function getPaymentQrs() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payment_qrs")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data || []) as DbPaymentQr[];
}

export async function getActivePaymentQr() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payment_qrs")
    .select("*")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as DbPaymentQr | null;
}

export async function createPaymentQr(qr: {
  name: string;
  upi_id: string;
  qr_image_url: string;
  is_active?: boolean;
  notes?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payment_qrs")
    .insert(qr)
    .select()
    .single();

  if (error) throw error;
  return data as DbPaymentQr;
}

export async function updatePaymentQr(id: string, updates: Partial<DbPaymentQr>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payment_qrs")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as DbPaymentQr;
}

export async function deletePaymentQr(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("payment_qrs").delete().eq("id", id);
  if (error) throw error;
}

// ====================================================================
// ORDER PAYMENT PROOF & VERIFICATION
// ====================================================================

export async function submitOrderPaymentProof(orderId: string, screenshotUrl: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_screenshot_url: screenshotUrl,
      payment_uploaded_at: new Date().toISOString(),
      payment_verification_status: "PENDING_VERIFICATION",
      workshop_status: "1. Pending Verification",
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data as DbOrder;
}

export async function verifyOrderPayment(orderId: string, isApproved: boolean) {
  const supabase = createClient();
  const updates: Record<string, any> = {
    payment_verification_status: isApproved ? "VERIFIED" : "REJECTED",
    payment_status: isApproved ? "PAID" : "FAILED",
    workshop_status: isApproved ? "2. Paid" : "1. Rejected",
  };

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data as DbOrder;
}

// ====================================================================
// CUSTOMER ADDRESSES
// ====================================================================

export interface DbCustomerAddress {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line: string;
  pincode: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  created_at: string;
}

export async function getUserAddresses(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("customer_addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });

  if (error) throw error;
  return (data || []) as DbCustomerAddress[];
}

export async function createAddress(addr: Omit<DbCustomerAddress, "id" | "created_at">) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("customer_addresses")
    .insert(addr)
    .select()
    .single();

  if (error) throw error;
  return data as DbCustomerAddress;
}

export async function deleteAddress(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("customer_addresses").delete().eq("id", id);
  if (error) throw error;
}

// ====================================================================
// REALTIME CHAT (1-Month Retention)
// ====================================================================

export interface DbChatMessage {
  id: string;
  order_id: string | null;
  sender_id: string | null;
  sender_name: string;
  sender_role: "Customer" | "Admin" | "Support Agent";
  message: string;
  is_read: boolean;
  created_at: string;
}

export async function getOrderChatMessages(orderId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []) as DbChatMessage[];
}

export async function sendChatMessage(msg: {
  order_id?: string;
  sender_id?: string;
  sender_name: string;
  sender_role: "Customer" | "Admin" | "Support Agent";
  message: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .insert(msg)
    .select()
    .single();

  if (error) throw error;
  return data as DbChatMessage;
}

// ====================================================================
// SHIPROCKET LOGISTICS INTEGRATION STUB
// ====================================================================

export async function calculateShiprocketFare(destinationPincode: string, weightKg: number = 0.5) {
  // Calculated zone fare logic (Ready to connect with live Shiprocket Token API)
  const isSouthIndia = ["560", "570", "600", "400", "500"].some(prefix => destinationPincode.startsWith(prefix));
  const baseRate = isSouthIndia ? 99 : 149;
  const weightCharge = Math.max(0, Math.ceil(weightKg - 0.5)) * 40;
  
  return {
    courierName: "Shiprocket (Air Express)",
    estimatedFareINR: baseRate + weightCharge,
    estimatedDays: isSouthIndia ? "2-3 Days" : "4-5 Days",
  };
}

