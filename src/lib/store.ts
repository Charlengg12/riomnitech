import type { Product } from "@/data/products";
import { products as seedProducts } from "@/data/products";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderLine = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  userEmail: string;
  userName: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  lines: OrderLine[];
};

const PRODUCTS_KEY = "rio.products";
const ORDERS_KEY = "rio.orders";

const sampleOrders = (): Order[] => {
  const now = Date.now();
  const day = 86_400_000;
  return [
    {
      id: "ORD-1042",
      userEmail: "ada@lovelace.io",
      userName: "Ada Lovelace",
      createdAt: new Date(now - day * 1).toISOString(),
      status: "processing",
      total: 303,
      lines: [
        { productId: "1", name: "RIO Arm v2 — 6DOF Robotic Arm", qty: 1, price: 289 },
        { productId: "2", name: "ESP32-S3 DevKit", qty: 1, price: 14 },
      ],
    },
    {
      id: "ORD-1041",
      userEmail: "alan@turing.dev",
      userName: "Alan Turing",
      createdAt: new Date(now - day * 3).toISOString(),
      status: "shipped",
      total: 56,
      lines: [{ productId: "2", name: "ESP32-S3 DevKit", qty: 4, price: 14 }],
    },
    {
      id: "ORD-1040",
      userEmail: "grace@hopper.dev",
      userName: "Grace Hopper",
      createdAt: new Date(now - day * 6).toISOString(),
      status: "delivered",
      total: 289,
      lines: [{ productId: "1", name: "RIO Arm v2 — 6DOF Robotic Arm", qty: 1, price: 289 }],
    },
    {
      id: "ORD-1039",
      userEmail: "ada@lovelace.io",
      userName: "Ada Lovelace",
      createdAt: new Date(now - day * 10).toISOString(),
      status: "delivered",
      total: 42,
      lines: [{ productId: "2", name: "ESP32-S3 DevKit", qty: 3, price: 14 }],
    },
  ];
};

export function getProducts(): Product[] {
  if (typeof window === "undefined") return seedProducts;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) return JSON.parse(raw) as Product[];
  } catch {
    /* ignore */
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seedProducts));
  return seedProducts;
}

export function saveProducts(p: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(p));
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) return JSON.parse(raw) as Order[];
  } catch {
    /* ignore */
  }
  const seed = sampleOrders();
  localStorage.setItem(ORDERS_KEY, JSON.stringify(seed));
  return seed;
}

export function saveOrders(o: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(o));
}
