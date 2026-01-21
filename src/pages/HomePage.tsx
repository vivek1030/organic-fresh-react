import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../features/products/components/ProductCard';
import { productService } from '../features/products/services/productService';
import type { ProductSummary } from '../types/product';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allProducts, allCategories] = await Promise.all([
          productService.getAllProducts(),
          productService.getAllCategories(),
        ]);
        setFeaturedProducts(allProducts.slice(0, 4));
        setCategories(allCategories.slice(0, 6)); // Show first 6 categories
      } catch (error) {
        console.error('Failed to load data', error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-[#f9f8f4] py-16 lg:py-0">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-100 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-green-700 shadow-sm border border-stone-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="flex h-2 w-2 rounded-full bg-green-600 animate-ping"></span>
                FRESH FROM OUR FARMS
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-stone-900 sm:text-7xl lg:text-8xl leading-[0.9]">
                Purely <span className="text-green-600">Organic</span>,<br />
                Deeply <span className="italic font-serif text-stone-400">Fresh</span>.
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-stone-600 font-medium leading-relaxed">
                Experience the true taste of nature with our hand-picked, pesticide-free produce delivered straight from local sustainable farms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/shop">
                  <Button size="lg" className="px-10 py-8 text-lg shadow-2xl shadow-green-200">Start Shopping</Button>
                </Link>
                <Button size="lg" variant="outline" className="px-10 py-8 text-lg bg-white">Our Story</Button>
              </div>

              <div className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-10">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-black text-stone-900">12k+</span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Happy Clients</span>
                </div>
                <div className="w-px h-10 bg-stone-200 hidden sm:block"></div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-black text-stone-900">100%</span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Natural</span>
                </div>
                <div className="w-px h-10 bg-stone-200 hidden sm:block"></div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-black text-stone-900">24h</span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Fast Delivery</span>
                </div>
              </div>
            </div>
            
            <div className="relative lg:h-[80vh] flex items-center justify-center">
              <div className="relative w-full max-w-2xl aspect-square lg:aspect-auto lg:h-[90%] group">
                <div className="absolute inset-0 bg-green-600 rounded-[3rem] lg:rounded-[4rem] rotate-3 transition-transform group-hover:rotate-1"></div>
                <img
                  src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1000&auto=format&fit=crop"
                  alt="Organic Vegetables"
                  className="relative h-full w-full object-cover rounded-[3rem] lg:rounded-[4rem] shadow-2xl transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2"
                />
                
                {/* Floating Card */}
                <div className="absolute -bottom-10 -left-10 md:left-20 bg-white p-6 rounded-3xl shadow-2xl border border-stone-100 hidden sm:block animate-bounce duration-[3000ms]">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl italic">
                      98%
                    </div>
                    <div>
                      <p className="text-sm font-black text-stone-900">Freshness Rate</p>
                      <p className="text-xs font-bold text-stone-400">Guaranteed quality</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-black text-green-600 uppercase tracking-[0.3em] mb-4 block">Categories</span>
              <h2 className="text-4xl md:text-6xl font-black text-stone-900 leading-[0.8]">
                Browse by <br />
                <span className="text-green-600 italic font-serif">Aisles</span>
              </h2>
            </div>
            <Link to="/shop" className="group flex items-center gap-2 text-stone-900 font-black uppercase tracking-widest text-xs">
              View All Aisles
              <div className="h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all">
                →
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {categories.slice(0, 8).map((cat, idx) => {
              const colors = [
                'bg-emerald-50 text-emerald-700 border-emerald-100',
                'bg-orange-50 text-orange-700 border-orange-100',
                'bg-blue-50 text-blue-700 border-blue-100',
                'bg-amber-50 text-amber-700 border-amber-100',
                'bg-rose-50 text-rose-700 border-rose-100',
                'bg-indigo-50 text-indigo-700 border-indigo-100',
                'bg-teal-50 text-teal-700 border-teal-100',
                'bg-stone-100 text-stone-700 border-stone-200'
              ];
              const colorClass = colors[idx % colors.length];
              
              return (
                <Link
                  key={cat}
                  to={`/shop/category/${cat}`}
                  className={`group relative h-64 md:h-80 rounded-[2.5rem] p-8 flex flex-col justify-between border-2 transition-all duration-500 hover:shadow-2xl hover:shadow-stone-200 hover:-translate-y-2 overflow-hidden ${colorClass.split(' ')[0]} ${colorClass.split(' ')[2]}`}
                >
                  <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2 block">
                      Aisle 0{idx + 1}
                    </span>
                    <h4 className="text-2xl md:text-3xl font-black leading-tight capitalize">
                      {cat.replace(/-/g, ' ')}
                    </h4>
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-70">Explore Items</span>
                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:bg-stone-900 group-hover:text-white transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                  </div>

                  {/* Decorative Abstract Shape */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/40 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className={`absolute -bottom-20 -right-10 w-64 h-64 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700 ${colorClass.split(' ')[1].replace('text', 'bg')}`}></div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-stone-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-[120px]"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="group">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/5 border border-white/10 text-green-500 transition-all group-hover:bg-green-600 group-hover:text-white group-hover:rotate-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.38 18.38a3.5 3.5 0 0 0 5.24 0l6-6A3.5 3.5 0 1 0 12.66 7.42l-1 1-1-1A3.5 3.5 0 1 0 5.38 12.62Z"/><path d="M12 2v20"/></svg>
              </div>
              <h3 className="mb-4 text-2xl font-black italic">Purely Natural.</h3>
              <p className="text-stone-400 font-medium leading-relaxed">
                Zero pesticides. Zero GMOs. Just pure, honest produce grown the way nature intended for your wellness.
              </p>
            </div>
            <div className="group">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/5 border border-white/10 text-green-500 transition-all group-hover:bg-green-600 group-hover:text-white group-hover:rotate-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="mb-4 text-2xl font-black italic">Certified Organic.</h3>
              <p className="text-stone-400 font-medium leading-relaxed">
                Every item is rigorously tested and certified by international standards to ensure the highest organic quality.
              </p>
            </div>
            <div className="group">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/5 border border-white/10 text-green-500 transition-all group-hover:bg-green-600 group-hover:text-white group-hover:rotate-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              <h3 className="mb-4 text-2xl font-black italic">Next Day Farm-to-Door.</h3>
              <p className="text-stone-400 font-medium leading-relaxed">
                We harvest at dawn and deliver by dusk. Experience freshness that is literally unmatched in the city.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-[#fbfbf9]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-black text-green-600 uppercase tracking-[0.3em] mb-4 block">Our Picks</span>
              <h2 className="text-4xl md:text-6xl font-black text-stone-900 leading-[0.8] mb-6">
                Featured <br />
                <span className="text-green-600 italic font-serif">Harvests</span>
              </h2>
              <p className="text-stone-500 font-medium text-lg">
                Hand-selected premium organic produce that our customers are currently loving. Grab them while they are in season!
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="px-8 py-6 rounded-2xl border-stone-200 hover:bg-stone-900 hover:text-white transition-all font-black text-xs uppercase tracking-widest">
                Explore Full Collection
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative rounded-[3rem] bg-green-600 overflow-hidden min-h-[400px] flex items-center">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop" 
                alt="Organic background" 
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              />
            </div>
            <div className="relative z-10 w-full p-8 md:p-16 grid lg:grid-cols-2 gap-12 items-center text-white">
              <div className="space-y-6">
                <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase">
                  Weekly Highlight
                </div>
                <h2 className="text-4xl md:text-6xl font-black leading-tight">
                  Get 30% Off on Your <br />
                  <span className="italic font-serif text-yellow-300 underline underline-offset-8">First Subscription</span>
                </h2>
                <p className="text-lg text-green-50 font-medium max-w-md">
                  Join our weekly harvest club and get the freshest produce delivered to your doorstep every Monday with exclusive member-only discounts.
                </p>
                <Button className="bg-white !text-green-900 hover:bg-yellow-300 hover:!text-green-900 px-10 py-8 text-lg font-black rounded-2xl shadow-2xl transition-all border-none">
                  Claim My Discount
                </Button>
              </div>
              <div className="hidden lg:flex justify-end">
                <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[3rem] border border-white/20 rotate-3 shadow-2xl">
                  <div className="text-center space-y-2">
                    <p className="text-7xl font-black">30%</p>
                    <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Limited Time Offer</p>
                    <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 mt-6">
                      <div><p className="text-xl font-bold">12</p><p className="text-[10px] uppercase opacity-60">Hours</p></div>
                      <div><p className="text-xl font-bold">45</p><p className="text-[10px] uppercase opacity-60">Mins</p></div>
                      <div><p className="text-xl font-bold">08</p><p className="text-[10px] uppercase opacity-60">Secs</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-[#fbfbf9]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-black text-green-600 uppercase tracking-[0.3em] block">Social Proof</span>
            <h2 className="text-4xl md:text-6xl font-black text-stone-900">Loved by <span className="italic font-serif text-green-600">Thousands</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", role: "Nutritionist", text: "The quality of produce here is consistently higher than any supermarket I've visited. The freshness is truly remarkable.", rating: 5 },
              { name: "Mark Wilson", role: "Chef", text: "As a chef, I'm very picky about my ingredients. Organic Ecommerce has become my go-to for seasonal specialty vegetables.", rating: 5 },
              { name: "Elena Rodriguez", role: "Mother of 2", text: "Knowing exactly where my family's food comes from gives me such peace of mind. Plus, the kids love the sweet strawberries!", rating: 5 }
            ].map((review, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex gap-1 mb-6 text-amber-400">
                  {[...Array(review.rating)].map((_, j) => <svg key={j} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                </div>
                <p className="text-stone-600 font-medium text-lg leading-relaxed mb-8 italic">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-stone-100"></div>
                  <div>
                    <p className="font-black text-stone-900">{review.name}</p>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Improved */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-[4rem] bg-stone-900 px-8 py-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 w-64 h-64 bg-green-500 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-600 rounded-full blur-[120px]"></div>
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-10">
              <h2 className="text-5xl md:text-7xl font-black leading-[0.9]">
                Ready to <span className="text-green-500">Transform</span> Your Kitchen?
              </h2>
              <p className="text-xl text-stone-400 font-medium">
                Join our newsletter today for expert nutrition tips, seasonal recipes, and a 20% discount on your first organic box.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
                <Button className="bg-green-600 hover:bg-green-500 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-green-900/40">
                  Join Now
                </Button>
              </form>
              
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em]">
                No spam. Only fresh updates. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
