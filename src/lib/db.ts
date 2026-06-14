import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderLine = {
  productId: string | null;
  name: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  userId: string | null;
  userEmail: string;
  userName: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  lines: OrderLine[];
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: "percent" | "fixed";
  discountValue: number;
  active: boolean;
  expiresAt: string | null;
};

export type Promotion = {
  id: string;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  image: string | null;
  active: boolean;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "open" | "responded" | "closed";
  createdAt: string;
};

export type CustomerSummary = {
  userId: string | null;
  name: string;
  email: string;
  orders: number;
  spend: number;
};

// --- Products ---
type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number | string;
  image: string;
  description: string;
  badge: string | null;
  in_stock: boolean;
  stock_count: number;
  sku: string | null;
  highlights: unknown;
  specs: unknown;
};

function mapProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category as Product["category"],
    price: Number(r.price),
    image: r.image,
    description: r.description,
    badge: r.badge ?? undefined,
    inStock: r.in_stock,
    stockCount: r.stock_count,
    sku: r.sku ?? undefined,
    highlights: Array.isArray(r.highlights) ? (r.highlights as string[]) : [],
    specs: (r.specs && typeof r.specs === "object" ? r.specs : {}) as Record<string, string>,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => mapProduct(r as ProductRow));
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as ProductRow) : null;
}

export async function fetchRelatedProducts(category: string, excludeId: string, limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products").select("*").eq("category", category).neq("id", excludeId).limit(limit);
  if (error) throw error;
  return (data ?? []).map((r) => mapProduct(r as ProductRow));
}

export async function upsertProduct(p: Product, isNew: boolean): Promise<void> {
  const row = {
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.image,
    description: p.description,
    badge: p.badge ?? null,
    in_stock: p.inStock,
    stock_count: p.stockCount ?? 0,
    sku: p.sku ?? null,
    highlights: p.highlights ?? [],
    specs: p.specs ?? {},
  };
  if (isNew) {
    const { error } = await supabase.from("products").insert(row);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("products").update(row).eq("id", p.id);
    if (error) throw error;
  }
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// --- Categories ---
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return (data ?? []).map((r) => ({ id: r.id, slug: r.slug, name: r.name, description: r.description }));
}

export async function upsertCategory(c: Omit<Category, "id"> & { id?: string }): Promise<void> {
  const row = { slug: c.slug, name: c.name, description: c.description };
  if (c.id) {
    const { error } = await supabase.from("categories").update(row).eq("id", c.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("categories").insert(row);
    if (error) throw error;
  }
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// --- Coupons ---
export async function fetchCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    description: r.description,
    discountType: r.discount_type as "percent" | "fixed",
    discountValue: Number(r.discount_value),
    active: r.active,
    expiresAt: r.expires_at,
  }));
}

export async function upsertCoupon(c: Omit<Coupon, "id"> & { id?: string }): Promise<void> {
  const row = {
    code: c.code.toUpperCase(),
    description: c.description,
    discount_type: c.discountType,
    discount_value: c.discountValue,
    active: c.active,
    expires_at: c.expiresAt,
  };
  if (c.id) {
    const { error } = await supabase.from("coupons").update(row).eq("id", c.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("coupons").insert(row);
    if (error) throw error;
  }
}

export async function deleteCoupon(id: string) {
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw error;
}

// --- Promotions ---
export async function fetchPromotions(): Promise<Promotion[]> {
  const { data, error } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    ctaLabel: r.cta_label,
    ctaUrl: r.cta_url,
    image: r.image,
    active: r.active,
  }));
}

export async function upsertPromotion(p: Omit<Promotion, "id"> & { id?: string }): Promise<void> {
  const row = {
    title: p.title,
    subtitle: p.subtitle,
    cta_label: p.ctaLabel,
    cta_url: p.ctaUrl,
    image: p.image,
    active: p.active,
  };
  if (p.id) {
    const { error } = await supabase.from("promotions").update(row).eq("id", p.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("promotions").insert(row);
    if (error) throw error;
  }
}

export async function deletePromotion(id: string) {
  const { error } = await supabase.from("promotions").delete().eq("id", id);
  if (error) throw error;
}

// --- Orders ---
export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r): Order => ({
    id: r.id,
    userId: r.user_id,
    userEmail: r.user_email,
    userName: r.user_name ?? "",
    createdAt: r.created_at,
    status: r.status as OrderStatus,
    total: Number(r.total),
    lines: ((r.order_items ?? []) as Array<{ product_id: string | null; name: string; qty: number; price: number | string }>).map((li) => ({
      productId: li.product_id,
      name: li.name,
      qty: li.qty,
      price: Number(li.price),
    })),
  }));
}

export async function fetchMyOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r): Order => ({
    id: r.id,
    userId: r.user_id,
    userEmail: r.user_email,
    userName: r.user_name ?? "",
    createdAt: r.created_at,
    status: r.status as OrderStatus,
    total: Number(r.total),
    lines: ((r.order_items ?? []) as Array<{ product_id: string | null; name: string; qty: number; price: number | string }>).map((li) => ({
      productId: li.product_id,
      name: li.name,
      qty: li.qty,
      price: Number(li.price),
    })),
  }));
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteOrder(id: string) {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}

export async function createOrder(input: {
  userId: string;
  userEmail: string;
  userName: string;
  total: number;
  shippingAddress: Record<string, string>;
  lines: { productId: string | null; name: string; qty: number; price: number }[];
}): Promise<string> {
  const { data: orderRow, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id: input.userId,
      user_email: input.userEmail,
      user_name: input.userName,
      total: input.total,
      shipping_address: input.shippingAddress,
      status: "pending",
    })
    .select("id")
    .single();
  if (orderErr) throw orderErr;
  const orderId = orderRow.id as string;
  const items = input.lines.map((l) => ({
    order_id: orderId,
    product_id: l.productId,
    name: l.name,
    qty: l.qty,
    price: l.price,
  }));
  const { error: itemsErr } = await supabase.from("order_items").insert(items);
  if (itemsErr) throw itemsErr;
  return orderId;
}

// --- Customers (admin) ---
export async function fetchCustomers(): Promise<CustomerSummary[]> {
  const [{ data: profiles, error: pErr }, orders] = await Promise.all([
    supabase.from("profiles").select("id, name, email"),
    fetchOrders(),
  ]);
  if (pErr) throw pErr;
  const stats = new Map<string, { orders: number; spend: number }>();
  for (const o of orders) {
    const key = (o.userId ?? o.userEmail.toLowerCase());
    const cur = stats.get(key) ?? { orders: 0, spend: 0 };
    cur.orders += 1;
    if (o.status !== "cancelled") cur.spend += o.total;
    stats.set(key, cur);
  }
  return (profiles ?? []).map((p) => {
    const s = stats.get(p.id) ?? stats.get((p.email ?? "").toLowerCase()) ?? { orders: 0, spend: 0 };
    return {
      userId: p.id,
      name: p.name ?? (p.email ?? "Unknown"),
      email: p.email ?? "",
      orders: s.orders,
      spend: s.spend,
    };
  }).sort((a, b) => b.spend - a.spend);
}

// --- Inquiries ---
export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    subject: r.subject,
    message: r.message,
    status: r.status as Inquiry["status"],
    createdAt: r.created_at,
  }));
}

export async function createInquiry(input: { name: string; email: string; subject?: string; message: string; userId?: string | null }) {
  const { error } = await supabase.from("inquiries").insert({
    name: input.name,
    email: input.email,
    subject: input.subject ?? null,
    message: input.message,
    user_id: input.userId ?? null,
  });
  if (error) throw error;
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"]) {
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteInquiry(id: string) {
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw error;
}
