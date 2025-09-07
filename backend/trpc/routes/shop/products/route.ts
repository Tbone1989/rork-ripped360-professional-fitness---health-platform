import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { featuredProducts } from "@/mocks/products";

type ShopProduct = {
  id: string;
  title: string;
  url: string;
  image?: string;
  price?: number;
  handle?: string;
};

function normalizeImageUrl(src?: string): string | undefined {
  if (!src || typeof src !== "string") return undefined;
  let s = src.trim();
  if (!s) return undefined;
  if (s.startsWith("//")) return `https:${s}`;
  if (s.startsWith("/")) return `https://www.rippedcityinc.com${s}`;
  try {
    const u = new URL(s);
    return u.toString();
  } catch {
    return undefined;
  }
}

function normalizeProduct(p: ShopProduct): ShopProduct {
  return {
    ...p,
    image: normalizeImageUrl(p.image),
    url: p.url.startsWith("http") ? p.url : `https://www.rippedcityinc.com${p.url.startsWith("/") ? "" : "/"}${p.url}`,
    price: typeof p.price === "number" && isFinite(p.price) ? p.price : undefined,
  };
}

async function tryFetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Rip360-Mobile-App/1.0",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://www.rippedcityinc.com/",
      },
      // Cache buster to avoid stale/protected responses
      cache: "no-store" as RequestCache,
    } as RequestInit);
    if (!res.ok) return null;
    // Don't strictly require application/json; some CDNs return text/javascript
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.log("shop.products tryFetchJson parse error", e);
      return null;
    }
  } catch (e) {
    console.log("shop.products tryFetchJson error", e);
    return null;
  }
}

function parseProductsFromJson(data: any): ShopProduct[] {
  const list = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
  return list
    .slice(0, 250)
    .map((p: any) => {
      const id = String(p.id ?? p.handle ?? p.title ?? Math.random());
      const image = normalizeImageUrl(p.image?.src ?? p.images?.[0]?.src ?? p.featured_image ?? undefined);
      const price =
        typeof p.price === "number"
          ? // Some Shopify endpoints return cents as integer
            (p.price > 1000 ? p.price / 100 : p.price)
          : typeof p.price_min === "number"
          ? p.price_min / 100
          : typeof p.variants?.[0]?.price === "string"
          ? Number(p.variants[0].price)
          : undefined;
      const handle = p.handle ?? undefined;
      const url = handle
        ? `https://www.rippedcityinc.com/products/${handle}`
        : typeof p.url === "string"
        ? p.url
        : `https://www.rippedcityinc.com`;
      const title = String(p.title ?? "");
      return normalizeProduct({ id, title, url, image, price, handle }) as ShopProduct;
    })
    .filter((p: ShopProduct) => !!p.title);
}

async function fetchFromSitemap(): Promise<ShopProduct[]> {
  try {
    // Try main sitemap first to discover product sitemaps
    const sitemapIndex = await fetch("https://www.rippedcityinc.com/sitemap.xml", {
      headers: { "User-Agent": "Rip360-Mobile-App/1.0" },
    });
    const productSitemaps: string[] = [];
    if (sitemapIndex.ok) {
      const indexXml = await sitemapIndex.text();
      const re = /<loc>([^<]+)<\/loc>/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(indexXml)) !== null) {
        const loc = m[1];
        if (loc.includes("sitemap_products")) productSitemaps.push(loc);
      }
    }

    if (productSitemaps.length === 0) {
      productSitemaps.push("https://www.rippedcityinc.com/sitemap_products_1.xml");
    }

    const urls: string[] = [];
    for (const sm of productSitemaps.slice(0, 3)) {
      try {
        const r = await fetch(sm, { headers: { "User-Agent": "Rip360-Mobile-App/1.0" } });
        if (!r.ok) continue;
        const xml = await r.text();
        const locRegex = /<loc>([^<]+)<\/loc>/g;
        let m: RegExpExecArray | null;
        while ((m = locRegex.exec(xml)) !== null) {
          const u = m[1];
          if (u.includes("/products/")) urls.push(u);
          if (urls.length >= 120) break;
        }
      } catch (e) {
        console.log("shop.products sitemap fetch error", e);
      }
    }

    const items: ShopProduct[] = [];
    for (const url of urls.slice(0, 100)) {
      try {
        const page = await fetch(url, { headers: { "User-Agent": "Rip360-Mobile-App/1.0" } });
        if (!page.ok) continue;
        const html = await page.text();
        // Find all ld+json blocks and pick Product
        const scripts = Array.from(html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
        for (const s of scripts) {
          try {
            const jsonText = s[1].trim();
            const parsed = JSON.parse(jsonText);
            const arr = Array.isArray(parsed) ? parsed : [parsed];
            const product = arr.find((j: any) => j && j["@type"] === "Product");
            if (product && product.name) {
              const title = String(product.name);
              const img = normalizeImageUrl(typeof product.image === "string" ? product.image : Array.isArray(product.image) ? product.image[0] : undefined);
              const offers = product.offers as any;
              const price = typeof offers?.price === "string" ? Number(offers.price) : typeof offers?.price === "number" ? offers.price : undefined;
              const handle = url.split("/products/")[1] ?? undefined;
              items.push(normalizeProduct({ id: url, title, url, image: img, price, handle }));
              break;
            }
          } catch (err) {
            // continue
          }
        }
      } catch (err) {
        console.log("shop.products fetch product page error", err);
      }
    }
    return items;
  } catch (err) {
    console.log("shop.products fetchFromSitemap error", err);
    return [];
  }
}

async function parseFromCollectionsHtml(): Promise<ShopProduct[]> {
  try {
    const urls = [
      "https://www.rippedcityinc.com/collections/all",
      "https://www.rippedcityinc.com/collections/all?page=2",
    ];
    const out: ShopProduct[] = [];
    for (const url of urls) {
      try {
        const res = await fetch(url, { headers: { "User-Agent": "Rip360-Mobile-App/1.0" } });
        if (!res.ok) continue;
        const html = await res.text();
        // Very loose parsing of product cards
        const productRegex = /<a[^>]+href=\"(\/products\/[^\"?#]+)[^>]*>([\s\S]*?)<\/a>/gi;
        let m: RegExpExecArray | null;
        const seen = new Set<string>();
        while ((m = productRegex.exec(html)) !== null) {
          const href = m[1];
          const block = m[2];
          const urlFull = `https://www.rippedcityinc.com${href}`;
          if (seen.has(urlFull)) continue;
          seen.add(urlFull);
          const imgMatch = block.match(/<img[^>]+src=\"([^\"]+)/i);
          const titleMatch = block.match(/alt=\"([^\"]+)/i) || block.match(/<h2[^>]*>([^<]+)/i) || block.match(/<span[^>]*class=\"[^\"]*(title|name)[^\"]*\"[^>]*>([^<]+)/i);
          const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : undefined;
          if (title) {
            out.push(normalizeProduct({ id: urlFull, title, url: urlFull, image: normalizeImageUrl(imgMatch?.[1]) }));
          }
          if (out.length >= 60) break;
        }
      } catch (e) {
        console.log("shop.products parseFromCollectionsHtml error", e);
      }
    }
    return out;
  } catch (e) {
    console.log("shop.products parseFromCollectionsHtml outer error", e);
    return [];
  }
}

function fallbackFromMocks(): ShopProduct[] {
  try {
    return featuredProducts.map((p) => normalizeProduct({
      id: p.id,
      title: p.name,
      url: "https://www.rippedcityinc.com/",
      image: p.images?.[0],
      price: typeof p.price === "number" ? p.price : undefined,
      handle: undefined,
    }));
  } catch (e) {
    console.log("shop.products fallbackFromMocks error", e);
    return [];
  }
}

export default publicProcedure
  .input(z.object({}).optional())
  .query(async () => {
    const sources: string[] = [
      "https://www.rippedcityinc.com/products.json?limit=250&_v=" + Date.now(),
      "https://www.rippedcityinc.com/collections/all/products.json?limit=250&_v=" + Date.now(),
    ];

    for (const url of sources) {
      const data = await tryFetchJson(url);
      if (data) {
        const products = parseProductsFromJson(data)
          .map(normalizeProduct)
          .filter((p, idx, arr) => p.title && p.url.includes("rippedcityinc.com") && arr.findIndex(x => x.url === p.url) === idx);
        if (products.length > 0) {
          console.log(`shop.products loaded from ${url}:`, products.length);
          return products;
        }
      }
    }

    const sitemapProducts = (await fetchFromSitemap())
      .map(normalizeProduct)
      .filter((p, idx, arr) => p.title && arr.findIndex(x => x.url === p.url) === idx);
    if (sitemapProducts.length > 0) {
      console.log("shop.products loaded from sitemap:", sitemapProducts.length);
      return sitemapProducts;
    }

    const collectionParsed = (await parseFromCollectionsHtml())
      .map(normalizeProduct)
      .filter((p, idx, arr) => p.title && arr.findIndex(x => x.url === p.url) === idx);
    if (collectionParsed.length > 0) {
      console.log("shop.products loaded from collections HTML:", collectionParsed.length);
      return collectionParsed;
    }

    const fallback = fallbackFromMocks();
    console.log("shop.products using fallback mocks:", fallback.length);
    return fallback;
  });