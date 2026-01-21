import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../features/products/components/ProductCard';
import { productService } from '../features/products/services/productService';
import type { ProductSummary } from '../types/product';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<ProductSummary[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const sortBy = searchParams.get('sortBy') || '';
  const order = searchParams.get('order') || '';
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(ITEMS_PER_PAGE, 0, sortBy, order),
          productService.getAllCategories(),
        ]);
        setDisplayedProducts(productsData);
        setCategories(categoriesData);
        setHasMore(productsData.length === ITEMS_PER_PAGE);
        
        const total = await productService.getAllProducts();
        setAllProducts(total);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortBy, order]);

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
  }, [loadingMore, hasMore, displayedProducts.length, sortBy, order]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const moreProducts = await productService.getAllProducts(
        ITEMS_PER_PAGE, 
        displayedProducts.length,
        sortBy,
        order
      );
      setDisplayedProducts((prev) => [...prev, ...moreProducts]);
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
        <p className="mt-4 text-stone-600">Loading fresh products...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fbfbf9] min-h-screen pb-20">
      {/* Shop Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center overflow-hidden bg-stone-900 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop" 
            alt="Fresh produce" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl">
            <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-500 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Shop</span>
            </nav>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.8] mb-6">
              The <span className="text-green-500 italic font-serif">Organic</span><br />
              Marketplace
            </h1>
            <p className="text-lg text-stone-300 font-medium max-w-md leading-relaxed">
              Discover over 100+ premium organic products sourced directly from sustainable local farms.
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-600 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 opacity-30"></div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Mobile Category Slider */}
        <div className="md:hidden mb-12 -mx-4 px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-stone-900">Aisles</h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Scroll to explore</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
            <Link
              to="/shop"
              className="whitespace-nowrap rounded-2xl px-6 py-4 text-sm font-black bg-green-600 text-white shadow-xl shadow-green-100"
            >
              All Harvests
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                to={`/shop/category/${category}`}
                className="whitespace-nowrap rounded-2xl px-6 py-4 text-sm font-black bg-white text-stone-900 border border-stone-100 shadow-sm capitalize"
              >
                {category.replace(/-/g, ' ')}
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
                        className="flex items-center justify-between group rounded-2xl px-5 py-4 text-sm font-black text-green-700 bg-green-50/50 border border-green-100 transition-all"
                      >
                        All Products
                        <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full">{allProducts.length}</span>
                      </Link>
                    </li>
                    {categories.map((category) => (
                      <li key={category}>
                        <Link
                          to={`/shop/category/${category}`}
                          className="block rounded-2xl px-5 py-4 text-sm font-bold text-stone-600 hover:bg-stone-50 hover:text-green-600 hover:translate-x-1 transition-all capitalize border border-transparent hover:border-stone-100"
                        >
                          {category.replace(/-/g, ' ')}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Promo Widget */}
              <div className="rounded-[2.5rem] bg-stone-900 p-8 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-2 block">Weekly Special</span>
                  <h3 className="text-2xl font-black mb-4 leading-tight">Fresh<br />Avocados</h3>
                  <p className="text-xs text-stone-400 font-bold mb-6 italic">Save 20% this week only on all Mexican imports.</p>
                  <Button className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-xl text-xs">Shop Deal</Button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12 transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-stone-900 leading-[0.8]">
                  Daily <span className="text-green-600 italic font-serif">Harvest</span>
                </h2>
                <p className="text-stone-500 font-bold text-sm mt-4 uppercase tracking-widest">
                  Showing {displayedProducts.length} of {allProducts.length} premium items
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
                  <option>Most Popular</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {loadingMore && (
              <div className="py-20 text-center">
                <div className="inline-flex h-12 w-12 animate-spin rounded-full border-[3px] border-solid border-green-600 border-r-transparent" />
                <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-stone-400">Loading More Items</p>
              </div>
            )}

            {!loadingMore && displayedProducts.length < allProducts.length && (
              <div className="mt-20 text-center">
                <div className="h-px bg-stone-100 w-full mb-10"></div>
                <p className="text-sm font-bold text-stone-400 mb-6 uppercase tracking-widest">You've seen {displayedProducts.length} products</p>
                <div className="w-48 h-1 bg-stone-100 mx-auto rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 transition-all duration-500" 
                    style={{ width: `${(displayedProducts.length / allProducts.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges Section */}
      <section className="py-20 bg-white border-y border-stone-100 mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-[2rem] hover:bg-stone-50 transition-colors">
              <div className="h-16 w-16 rounded-3xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h4 className="text-lg font-black text-stone-900 mb-2">100% Secure</h4>
              <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">Payments protected</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-[2rem] hover:bg-stone-50 transition-colors">
              <div className="h-16 w-16 rounded-3xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.58 16.11a5 5 0 0 1 6.84 0"/><circle cx="12" cy="20" r="2"/></svg>
              </div>
              <h4 className="text-lg font-black text-stone-900 mb-2">Live Tracking</h4>
              <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">Real-time delivery</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-[2rem] hover:bg-stone-50 transition-colors">
              <div className="h-16 w-16 rounded-3xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-9"/><path d="M5 8.9V5a3 3 0 0 1 6 0v3.9"/><path d="M13 8.9V5a3 3 0 0 1 6 0v3.9"/><path d="M3 13h18l-2 9H5l-2-9Z"/></svg>
              </div>
              <h4 className="text-lg font-black text-stone-900 mb-2">Farm Direct</h4>
              <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">No middle man</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-[2rem] hover:bg-stone-50 transition-colors">
              <div className="h-16 w-16 rounded-3xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h4 className="text-lg font-black text-stone-900 mb-2">7 Day Return</h4>
              <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">Quality guaranteed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
