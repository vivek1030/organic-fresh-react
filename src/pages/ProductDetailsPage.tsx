import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RefreshCcw,
  Star,
} from 'lucide-react';
import { productService } from '../features/products/services/productService';
import { useCartStore } from '../features/cart/store/useCartStore';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../features/products/components/ProductCard';
import type { ProductDetails, ProductSummary } from '../types/product';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productService.getProductById(Number(id));
        if (data) {
          setProduct(data);
          setActiveImage(data.image);

          // Fetch related products from same category
          const related = await productService.getProductsByCategory(
            data.category,
            5
          );
          setRelatedProducts(
            related.filter((p) => p.id !== data.id).slice(0, 4)
          );
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-stone-500 font-medium">
          Gathering product details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">
          Oops! Product not found
        </h2>
        <p className="text-stone-600 mb-8">
          The product you are looking for doesn't exist or has been removed.
        </p>
        <Link to="/shop">
          <Button size="lg">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const allImages = product.images || [product.image];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-stone-50 bg-stone-50/30">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm font-medium text-stone-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="hover:text-green-600 transition-colors">
              Shop
            </Link>
            <ChevronRight size={14} />
            <Link
              to={`/shop/category/${product.category}`}
              className="hover:text-green-600 transition-colors capitalize"
            >
              {product.category}
            </Link>
            <ChevronRight size={14} />
            <span className="text-stone-900 truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-4 md:space-y-6">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-stone-50 border border-stone-100 shadow-xl relative group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              {product.discount && (
                <div className="absolute top-8 left-8 bg-red-600 text-white px-5 py-2 rounded-2xl text-sm font-black shadow-2xl shadow-red-200 animate-bounce">
                  -{Math.round(product.discount)}% OFF
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-4 px-2 scrollbar-hide">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`relative h-20 w-20 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-[1.5rem] border-2 transition-all duration-300 ${
                      activeImage === img
                        ? 'border-green-600 scale-105 ring-4 ring-green-50 shadow-lg'
                        : 'border-stone-100 hover:border-green-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                {product.isNew && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    New Arrival
                  </span>
                )}
                <div className="flex items-center gap-1 text-amber-400 ml-auto">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i <= 4 ? 'currentColor' : 'none'}
                    />
                  ))}
                  <span className="text-xs text-stone-400 ml-1 font-medium">
                    (4.8 / 120 Reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 leading-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-black text-green-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-stone-300 line-through font-medium">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-lg text-stone-600 leading-relaxed mb-8 border-l-4 border-green-100 pl-6 italic">
                {product.description ||
                  "Grown with love and care, our organic produce represents the best of nature's bounty. Fresh, clean, and delivered from farm to your table."}
              </p>
            </div>

            {/* Action Section */}
            <div className="bg-stone-50 rounded-3xl p-8 mb-10 border border-stone-100">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center bg-white border border-stone-200 rounded-2xl p-1 shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-stone-50 rounded-xl transition-colors text-stone-600"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-bold text-xl text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 hover:bg-stone-50 rounded-xl transition-colors text-stone-600"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <Button
                  size="lg"
                  className="w-full sm:flex-1 py-8 text-lg shadow-xl shadow-green-100"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) addItem(product);
                  }}
                >
                  Add to Cart — ${(product.price * quantity).toFixed(2)}
                </Button>
              </div>
            </div>

            {/* Features & Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center text-center p-4 rounded-2xl border border-stone-50 hover:bg-stone-50 transition-colors">
                <Truck className="text-green-600 mb-3" size={24} />
                <span className="text-xs font-bold text-stone-900 uppercase">
                  Free Delivery
                </span>
                <span className="text-[10px] text-stone-500">
                  Orders over $50
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-2xl border border-stone-50 hover:bg-stone-50 transition-colors">
                <ShieldCheck className="text-green-600 mb-3" size={24} />
                <span className="text-xs font-bold text-stone-900 uppercase">
                  100% Organic
                </span>
                <span className="text-[10px] text-stone-500">
                  Certified Nature
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-2xl border border-stone-50 hover:bg-stone-50 transition-colors">
                <RefreshCcw className="text-green-600 mb-3" size={24} />
                <span className="text-xs font-bold text-stone-900 uppercase">
                  Easy Returns
                </span>
                <span className="text-[10px] text-stone-500">
                  7 Days Return
                </span>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-8 grid grid-cols-2 gap-x-8 gap-y-6 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                  SKU
                </span>
                <span className="text-stone-900 font-bold bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100 inline-block w-fit">
                  {product.sku ||
                    `ORG-${product.id.toString().padStart(4, '0')}`}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                  Weight
                </span>
                <span className="text-stone-900 font-bold">
                  {product.weight || '500g'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                  Warranty
                </span>
                <span className="text-stone-900 font-bold">
                  1 Year Manufacturer
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                  Category
                </span>
                <span className="text-stone-900 font-bold capitalize bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100 inline-block w-fit">
                  {product.category.replace(/-/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 md:mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-black text-green-600 uppercase tracking-[0.3em] mb-4 block">
                  You might also like
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-stone-900 leading-[0.8]">
                  Related <br />
                  <span className="text-green-600 italic font-serif">
                    Harvests
                  </span>
                </h2>
              </div>
              <Link
                to={`/shop/category/${product.category}`}
                className="group flex items-center gap-2 text-stone-900 font-black uppercase tracking-widest text-xs"
              >
                View All {product.category.replace(/-/g, ' ')}
                <div className="h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all">
                  →
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
