import type { ProductSummary } from './product';

export interface CartItem extends ProductSummary {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: ProductSummary) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}
