import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const SITE_URL = "https://rio.lovable.app";

async function buildSitemap() {
  const today = new Date().toISOString().split("T")[0];
  const staticUrls = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/products", priority: "0.9", changefreq: "daily" },
    { loc: "/about", priority: "0.6", changefreq: "monthly" },
    { loc: "/services", priority: "0.6", changefreq: "monthly" },
    { loc: "/projects", priority: "0.6", changefreq: "monthly" },
    { loc: "/contact", priority: "0.6", changefreq: "monthly" },
    { loc: "/login", priority: "0.3", changefreq: "yearly" },
    { loc: "/signup", priority: "0.3", changefreq: "yearly" },
  ];
  const { data } = await supabase.from("products").select("slug");
  const productUrls = (data ?? []).map((p) => ({
    loc: `/products/${p.slug}`,
    priority: "0.8",
    changefreq: "weekly",
  }));
  const all = [...staticUrls, ...productUrls];
  const body = all
    .map((u) => `  <url>\n    <loc>${SITE_URL}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(await buildSitemap(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
