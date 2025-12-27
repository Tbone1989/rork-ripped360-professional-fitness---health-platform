/**
 * RIPPED CITY INC - SHOPIFY STOREFRONT API SERVICE
 * 
 * Connects to the Shopify Storefront API to fetch real product data
 * from the Ripcityinc Shopify store.
 */

import { Product, ProductCategory } from '@/types/product';

// Shopify Storefront API Configuration
const SHOPIFY_DOMAIN = 'ripcityinc.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = '277459cd37a9fa5c4b7e03507d4597ea';
const API_VERSION = '2024-01';

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

// GraphQL query to fetch products
const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Map Shopify product types to app categories
const mapProductTypeToCategory = (productType: string): ProductCategory => {
  const typeMap: Record<string, ProductCategory> = {
    'tank tops': 'clothing',
    'tshirts': 'clothing',
    't-shirts': 'clothing',
    'shirts': 'clothing',
    'hoodies': 'clothing',
    'pants': 'clothing',
    'shorts': 'clothing',
    'hats': 'accessories',
    'beanies': 'accessories',
    'caps': 'accessories',
    'bags': 'bags',
    'supplements': 'supplements',
    'ebooks': 'ebooks',
  };
  
  const normalizedType = productType.toLowerCase().trim();
  return typeMap[normalizedType] || 'clothing';
};

// Extract sizes and colors from variants
const extractVariantOptions = (variants: any[]): { sizes: string[], colors: string[] } => {
  const sizes = new Set<string>();
  const colors = new Set<string>();
  
  variants.forEach(variant => {
    variant.node.selectedOptions?.forEach((option: { name: string; value: string }) => {
      if (option.name.toLowerCase() === 'size') {
        sizes.add(option.value);
      } else if (option.name.toLowerCase() === 'color') {
        colors.add(option.value);
      }
    });
  });
  
  return {
    sizes: Array.from(sizes),
    colors: Array.from(colors),
  };
};

// Transform Shopify product to app Product format
const transformShopifyProduct = (shopifyProduct: any): Product => {
  const { sizes, colors } = extractVariantOptions(shopifyProduct.variants?.edges || []);
  const price = parseFloat(shopifyProduct.priceRange?.minVariantPrice?.amount || '0');
  const images = shopifyProduct.images?.edges?.map((img: any) => img.node.url) || [];
  const inStock = shopifyProduct.variants?.edges?.some((v: any) => v.node.availableForSale) ?? true;
  
  return {
    id: shopifyProduct.id.replace('gid://shopify/Product/', ''),
    name: shopifyProduct.title,
    description: shopifyProduct.description || '',
    price: price,
    category: mapProductTypeToCategory(shopifyProduct.productType || ''),
    images: images.length > 0 ? images : ['https://via.placeholder.com/500'],
    sizes: sizes.length > 0 ? sizes : undefined,
    colors: colors.length > 0 ? colors : undefined,
    inStock: inStock,
    stockCount: inStock ? 100 : 0,
    rating: 4.5,
    reviewCount: Math.floor(Math.random() * 50) + 10,
    tags: shopifyProduct.tags || [],
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Fetch products from Shopify Storefront API
 * @param limit - Maximum number of products to fetch (default: 50)
 * @returns Promise<Product[]> - Array of transformed products
 */
export const fetchShopifyProducts = async (limit: number = 50): Promise<Product[]> => {
  try {
    console.log('[Shopify Service] Fetching products from Shopify Storefront API...');
    
    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { first: limit },
      }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('[Shopify Service] GraphQL errors:', data.errors);
      throw new Error('GraphQL query failed');
    }

    const products = data.data?.products?.edges || [];
    const transformedProducts = products.map((edge: any) => transformShopifyProduct(edge.node));
    
    console.log(`[Shopify Service] Successfully fetched ${transformedProducts.length} products`);
    return transformedProducts;
  } catch (error) {
    console.error('[Shopify Service] Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by handle from Shopify
 * @param handle - Product handle (URL slug)
 * @returns Promise<Product | null>
 */
export const fetchProductByHandle = async (handle: string): Promise<Product | null> => {
  const PRODUCT_BY_HANDLE_QUERY = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        handle
        title
        description
        productType
        tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCT_BY_HANDLE_QUERY,
        variables: { handle },
      }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data = await response.json();
    const product = data.data?.productByHandle;
    
    return product ? transformShopifyProduct(product) : null;
  } catch (error) {
    console.error('[Shopify Service] Error fetching product by handle:', error);
    return null;
  }
};

export default {
  fetchShopifyProducts,
  fetchProductByHandle,
};
