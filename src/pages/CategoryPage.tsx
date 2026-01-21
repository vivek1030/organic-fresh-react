import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../features/products/components/ProductCard';
import { productService } from '../features/products/services/productService';
import type { ProductSummary } from '../types/product';

export const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const sortBy = searchParams.get('sortBy') || '';
  const order = searchParams.get('order') || '';
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!category) return;
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getProductsByCategory(category, ITEMS_PER_PAGE, 0, sortBy, order),
          productService.getAllCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setHasMore(productsData.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [category, sortBy, order]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 500 &&
        !loadingMore &&
        hasMore
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, products.length, category, sortBy, order]);

  const loadMore = async () => {
    if (!category || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const moreProducts = await productService.getProductsByCategory(
        category, 
        ITEMS_PER_PAGE, 
        products.length,
        sortBy,
        order
      );
      setProducts((prev) => [...prev, ...moreProducts]);
      setHasMore(moreProducts.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    switch (value) {
      case 'Price: Low to High':
        setSearchParams({ sortBy: 'price', order: 'asc' });
        break;
      case 'Price: High to Low':
        setSearchParams({ sortBy: 'price', order: 'desc' });
        break;
      case 'Newest First':
        setSearchParams({ sortBy: 'id', order: 'desc' });
        break;
      default:
        setSearchParams({});
    }
  };

  const getCurrentSortValue = () => {
    if (sortBy === 'price' && order === 'asc') return 'Price: Low to High';
    if (sortBy === 'price' && order === 'desc') return 'Price: High to Low';
    if (sortBy === 'id' && order === 'desc') return 'Newest First';
    return 'Default Sorting';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-stone-600">Loading {category}...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fbfbf9] min-h-screen pb-20">
      {/* Category Hero Section */}
      <section className="relative h-[250px] md:h-[350px] flex items-center overflow-hidden bg-stone-900 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop" 
            alt={category} 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl">
            <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-500 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
              <span>/</span>
              <span className="text-white capitalize">{category?.replace(/-/g, ' ')}</span>
            </nav>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.8] mb-6 capitalize">
              {category?.replace(/-/g, ' ')} <br />
              <span className="text-green-500 italic font-serif">Harvest</span>
            </h1>
            <p className="text-lg text-stone-300 font-medium max-w-md leading-relaxed">
              Explore our hand-picked selection of premium organic {category?.replace(/-/g, ' ')} delivered fresh to your door.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-600 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2 opacity-20"></div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Mobile Category Slider */}
        <div className="md:hidden mb-12 -mx-4 px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-stone-900">Aisles</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
            <Link
              to="/shop"
              className="whitespace-nowrap rounded-2xl px-6 py-4 text-sm font-black bg-white text-stone-600 border border-stone-100 shadow-sm"
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/shop/category/${cat}`}
                className={`whitespace-nowrap rounded-2xl px-6 py-4 text-sm font-black border transition-all capitalize shadow-sm ${
                  cat === category
                    ? 'bg-green-600 text-white border-green-600 shadow-xl shadow-green-100'
                    : 'bg-white text-stone-900 border-stone-100'
                }`}
              >
                {cat.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="hidden md:block w-72 shrink-0">
            <div className="sticky top-28 space-y-8">
              <div className="rounded-[2.5rem] border border-stone-100 bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-xl font-black text-stone-900 flex items-center gap-3">
                  <div className="h-6 w-1.5 bg-green-600 rounded-full"></div>
                  Categories
                </h2>
                <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2 scrollbar-thin">
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/shop"
                        className="block rounded-2xl px-5 py-4 text-sm font-bold text-stone-600 hover:bg-stone-50 hover:text-green-600 transition-all border border-transparent hover:border-stone-100"
                      >
                        All Products
                      </Link>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat}>
                        <Link
                          to={`/shop/category/${cat}`}
                          className={`block rounded-2xl px-5 py-4 text-sm font-black transition-all capitalize border ${
                            cat === category
                              ? 'bg-green-50/50 text-green-700 border-green-100'
                              : 'text-stone-600 hover:bg-stone-50 hover:text-green-600 hover:translate-x-1 border-transparent hover:border-stone-100'
                          }`}
                        >
                          {cat.replace(/-/g, ' ')}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Back to Shop Widget */}
              <Link to="/shop" className="group block rounded-[2.5rem] bg-stone-100 p-8 border border-stone-200 transition-all hover:bg-stone-900 hover:text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover:text-green-500 mb-2 block">Navigation</span>
                <h3 className="text-xl font-black mb-2">Back to Full Shop</h3>
                <p className="text-xs font-bold opacity-60 mb-0">Browse all 100+ premium organic products.</p>
              </Link>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-stone-900 leading-[0.8] capitalize">
                  {category?.replace(/-/g, ' ')}
                </h2>
                <p className="text-stone-500 font-bold text-sm mt-4 uppercase tracking-widest">
                  Found {products.length} organic selections
                </p>
              </div>

              <div className="relative group min-w-[200px]">
                <div className="absolute inset-0 bg-green-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <select 
                  onChange={handleSortChange}
                  value={getCurrentSortValue()}
                  className="relative w-full bg-white border-2 border-stone-100 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-stone-900 focus:outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/5 shadow-sm appearance-none cursor-pointer pr-12 transition-all hover:border-stone-200"
                >
                  <option>Default Sorting</option>
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[3rem] border border-stone-100 border-dashed">
                <div className="h-20 w-20 rounded-full bg-stone-50 flex items-center justify-center mx-auto mb-6 text-stone-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                </div>
                <h3 className="text-2xl font-black text-stone-900 mb-2">No results yet</h3>
                <p className="text-stone-500 font-medium mb-8">We're currently restocking our {category?.replace(/-/g, ' ')} aisle.</p>
                <Link to="/shop">
                  <Button className="px-10 py-6 font-black rounded-2xl shadow-xl shadow-green-100">Browse All Items</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {loadingMore && (
                  <div className="py-20 text-center">
                    <div className="inline-flex h-12 w-12 animate-spin rounded-full border-[3px] border-solid border-green-600 border-r-transparent" />
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-stone-400">Loading More Items</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

