import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../features/products/components/ProductCard';
import { productService } from '../features/products/services/productService';
import type { ProductSummary } from '../types/product';
import { Search } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await productService.searchProducts(query);
        setProducts(results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-stone-600">Searching for "{query}"...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Search Results
        </h1>
        <p className="text-stone-500">
          {products.length > 0
            ? `Found ${products.length} results for "${query}"`
            : `No results found for "${query}"`}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-stone-50 text-stone-300 mb-6">
            <Search size={40} />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            No matches found
          </h2>
          <p className="text-stone-500 max-w-md mx-auto">
            We couldn't find any products matching "{query}". Try checking your
            spelling or using more general terms.
          </p>
        </div>
      )}
    </div>
  );
};
