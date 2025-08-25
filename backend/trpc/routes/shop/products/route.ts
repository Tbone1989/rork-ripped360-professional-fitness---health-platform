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

async function tryFetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Rip360-Mobile-App/1.0",
        "Accept": "application/json, text/plain, */*",
      },
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return null;
    const data = await res.json();
    return data;
  } catch (e) {
    console.log("shop.products tryFetchJson error", e);
    return null;
  }
}

function parseProductsFromJson(data: any): ShopProduct[] {
  const list = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
  return list.slice(0, 200).map((p: any) => {
    const id = String(p.id ?? p.handle ?? p.title ?? Math.random());
    const image = p.image?.src ?? p.images?.[0]?.src ?? p.featured_image ?? undefined;
    const price = typeof p.price === "number" ? p.price / 100 : typeof p.price_min === "number" ? p.price_min / 100 : typeof p.variants?.[0]?.price === "string" ? Number(p.variants[0].price) : undefined;
    const handle = p.handle ?? undefined;
    const url = handle ? `https://www.rippedcityinc.com/products/${handle}` : `https://www.rippedcityinc.com`;
    const title = String(p.title ?? "");
    return { id, title, url, image, price, handle };
  }).filter((p: ShopProduct) => !!p.title);
}

async function fetchFromSitemap(): Promise<ShopProduct[]> {
  try {
    const res = await fetch("https://www.rippedcityinc.com/sitemap_products_1.xml", {
      headers: { "User-Agent": "Rip360-Mobile-App/1.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const urls: string[] = [];
    const locRegex = /<loc>([^<]+)<\/loc>/g;
    let m: RegExpExecArray | null;
    while ((m = locRegex.exec(xml)) !== null) {
      const u = m[1];
      if (u.includes("/products/")) urls.push(u);
      if (urls.length >= 100) break;
    }
    const items: ShopProduct[] = [];
    for (const url of urls) {
      try {
        const page = await fetch(url, { headers: { "User-Agent": "Rip360-Mobile-App/1.0" } });
        if (!page.ok) continue;
        const html = await page.text();
        const ldMatch = html.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
        if (ldMatch) {
          try {
            const json = JSON.parse(ldMatch[1]);
            const product = Array.isArray(json) ? json.find((j) => j['@type'] === 'Product') : json['@type'] === 'Product' ? json : null;
            const title = String(product?.name ?? "");
            const image = typeof product?.image === 'string' ? product?.image : Array.isArray(product?.image) ? product?.image[0] : undefined;
            const offers = product?.offers as any;
            const price = typeof offers?.price === 'string' ? Number(offers.price) : typeof offers?.price === 'number' ? offers.price : undefined;
            if (title) {
              const handle = url.split("/products/")[1] ?? undefined;
              items.push({ id: url, title, url, image, price, handle });
            }
          } catch (err) {
            console.log("shop.products parse ld+json error", err);
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

function fallbackFromMocks(): ShopProduct[] {
  try {
    return featuredProducts.map((p) => ({
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
      "https://www.rippedcityinc.com/products.json?limit=250",
      "https://www.rippedcityinc.com/collections/all/products.json?limit=250",
    ];

    for (const url of sources) {
      const data = await tryFetchJson(url);
      if (data) {
        const products = parseProductsFromJson(data);
        if (products.length > 0) {
          console.log(`shop.products loaded from ${url}:`, products.length);
          return products;
        }
      }
    }

    const sitemapProducts = await fetchFromSitemap();
    if (sitemapProducts.length > 0) {
      console.log("shop.products loaded from sitemap:", sitemapProducts.length);
      return sitemapProducts;
    }

    const fallback = fallbackFromMocks();
    console.log("shop.products using fallback mocks:", fallback.length);
    return fallback;
  });