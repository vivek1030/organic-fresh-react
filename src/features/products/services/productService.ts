import type { ProductSummary, ProductDetails } from '../../../types/product';

const BASE_URL = 'https://dummyjson.com/products';

const mapToSummary = (product: any): ProductSummary => {
  const discount = product.discountPercentage;
  const price = product.price;
  const originalPrice = discount ? parseFloat((price / (1 - discount / 100)).toFixed(2)) : undefined;

  return {
    id: product.id,
    name: product.title,
    price: price,
    originalPrice: originalPrice,
    discount: discount,
    image: product.thumbnail,
    category: product.category,
    isNew: product.rating > 4.8,
  };
};

const mapToDetails = (product: any): ProductDetails => {
  const summary = mapToSummary(product);
  return {
    ...summary,
    description: product.description,
    images: product.images,
    sku: product.sku,
    weight: `${product.weight}g`,
  };
};

export const productService = {
  getAllProducts: async (limit = 100, skip = 0, sortBy = '', order = ''): Promise<ProductSummary[]> => {
    let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;
    if (sortBy) url += `&sortBy=${sortBy}&order=${order}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.products.map(mapToSummary);
  },

  getProductById: async (id: number): Promise<ProductDetails | undefined> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) return undefined;
      const data = await response.json();
      return mapToDetails(data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return undefined;
    }
  },

  getProductsByCategory: async (category: string, limit = 10, skip = 0, sortBy = '', order = ''): Promise<ProductSummary[]> => {
    let url = `${BASE_URL}/category/${category}?limit=${limit}&skip=${skip}`;
    if (sortBy) url += `&sortBy=${sortBy}&order=${order}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.products.map(mapToSummary);
  },

  getAllCategories: async (): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/categories`);
    const data = await response.json();
    if (Array.isArray(data) && typeof data[0] === 'object') {
      return data.map((c: any) => c.slug);
    }
    return data;
  },

  searchProducts: async (query: string): Promise<ProductSummary[]> => {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.products.map(mapToSummary);
  },
};
