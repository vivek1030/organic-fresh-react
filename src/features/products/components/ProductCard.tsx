import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import type { ProductSummary } from '../../../types/product';
import { useCartStore } from '../../cart/store/useCartStore';

interface ProductCardProps {
  product: ProductSummary;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const getCategoryStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('fruit')) return 'bg-orange-50 text-orange-600';
    if (cat.includes('veg')) return 'bg-green-50 text-green-600';
    if (cat.includes('bakery')) return 'bg-amber-50 text-amber-600';
    return 'bg-stone-50 text-stone-600';
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-white border border-stone-100 transition-all duration-300 hover:shadow-2xl hover:shadow-stone-200/50 md:hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-50">
        <Link to={`/product/${product.id}`} className="block h-full">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        <div className="absolute left-2 top-2 md:left-4 md:top-4 flex flex-col gap-1.5 md:gap-2">
          {product.isNew && (
            <span className="rounded-full bg-green-600 px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
              New
            </span>
          )}
          {product.discount && (
            <span className="rounded-full bg-red-600 px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
              -{Math.round(product.discount)}%
            </span>
          )}
        </div>

        <div className="hidden md:flex absolute right-4 top-4 flex flex-col gap-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-600 shadow-xl transition-all hover:bg-green-600 hover:text-white">
            <Heart size={18} />
          </button>
        </div>

        <div className="absolute inset-x-2 bottom-2 md:inset-x-4 md:bottom-4 md:translate-y-12 md:opacity-0 transition-all duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="flex w-full items-center justify-center gap-1.5 md:gap-2 rounded-xl md:rounded-2xl bg-white/95 py-2 md:py-3 text-[10px] md:text-sm font-bold text-stone-900 shadow-xl backdrop-blur-sm transition-all active:scale-95 md:hover:bg-green-600 md:hover:text-white"
          >
            <ShoppingCart size={14} className="md:w-4 md:h-4" />
            <span className="hidden xs:inline">Add to Cart</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 md:p-5">
        <div className="mb-1.5 md:mb-2">
          <span
            className={`rounded-lg px-1.5 py-0.5 md:px-2 md:py-1 text-[8px] md:text-[10px] font-black uppercase tracking-wider ${getCategoryStyles(product.category)}`}
          >
            {product.category.replace(/-/g, ' ')}
          </span>
        </div>

        <Link to={`/product/${product.id}`} className="flex-1">
          <h3 className="mb-1 md:mb-2 text-sm md:text-lg font-bold text-stone-900 transition-colors hover:text-green-600 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-1">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[10px] md:text-xs font-medium text-stone-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-base md:text-xl font-black text-stone-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-0.5 md:gap-1 text-amber-400 mb-0.5">
            <StarIcon fill="currentColor" />
            <span className="text-[10px] md:text-xs font-bold text-stone-400">
              4.5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StarIcon = ({ fill = 'none' }: { fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
