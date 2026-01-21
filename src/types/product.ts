export interface ProductSummary {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  isNew?: boolean;
}

export interface ProductDetails extends ProductSummary {
  images: string[];
  description: string;
  sku?: string;
  weight?: string;
  harvestDate?: string;
}
