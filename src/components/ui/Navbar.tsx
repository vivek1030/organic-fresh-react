import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, LogOut, Package, Settings, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { useCartStore } from '../../features/cart/store/useCartStore';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { productService } from '../../features/products/services/productService';
import type { ProductSummary } from '../../types/product';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { items, getTotalItems, removeItem } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeAllMenus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await productService.searchProducts(searchQuery);
          setSearchResults(results);
          setIsSearchOpen(true);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-stone-100 bg-white md:bg-white/90 md:backdrop-blur-xl shadow-sm md:shadow-none">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-10">
          <Link to="/" className="flex items-center gap-2 group" onClick={closeAllMenus}>
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl md:rounded-2xl bg-green-600 text-white font-black text-lg md:text-xl shadow-lg shadow-green-200 group-hover:rotate-6 transition-transform">
              O
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-stone-900">
              Organic<span className="text-green-600">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-stone-400">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="hover:text-green-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </Link>
            ))}
            <Link to="/shop?sortBy=id&order=desc" className="hover:text-green-600 transition-colors relative group">
              New Arrivals
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1 md:gap-6">
          {/* Search Bar - Desktop */}
          <div className="relative hidden xl:block w-72 xl:w-96" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="text"
                placeholder="Search premium harvest..."
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-3 pl-12 pr-12 text-sm font-bold placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:bg-white focus:border-green-200 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-green-600 transition-colors"
                aria-label="Submit search"
              >
                {!isSearching && searchQuery.trim().length >= 2 && <Search size={16} />}
              </button>
              {isSearching && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 animate-spin" size={16} />
              )}
            </form>

            {/* Desktop Results */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] shadow-2xl border border-stone-100 p-4 z-[70] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="max-h-[450px] overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                  {searchResults.slice(0, 5).map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        navigate(`/product/${result.id}`);
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-stone-50 transition-all text-left group"
                    >
                      <div className="h-14 w-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                        <img src={result.image} alt={result.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-stone-900 truncate">{result.name}</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{result.category.replace(/-/g, ' ')}</p>
                      </div>
                      <div className="text-sm font-black text-green-600">
                        ${result.price.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
                {searchResults.length > 5 && (
                  <button
                    onClick={handleSearch}
                    className="w-full mt-4 p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-green-600 hover:bg-green-50 rounded-2xl transition-all border-t border-stone-50"
                  >
                    View All {searchResults.length} Results
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {/* Search Toggle - Mobile/Tablet */}
            <button 
              className="xl:hidden text-stone-900 hover:text-green-600 transition-colors p-2 md:p-3 rounded-xl md:rounded-2xl bg-stone-50"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search size={20} className="md:w-[22px] md:h-[22px]" />
            </button>
            
            <div className="relative" ref={cartRef}>
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="text-stone-900 hover:text-green-600 transition-colors relative p-2 md:p-3 rounded-xl md:rounded-2xl bg-stone-50 group"
              >
                <span className="sr-only">Cart</span>
                <ShoppingCart size={20} className="md:w-[22px] md:h-[22px] group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-green-600 text-[8px] md:text-[10px] font-black text-white shadow-lg border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Cart Dropdown - Desktop & Mobile */}
              {isCartOpen && (
                <>
                  {/* Backdrop for mobile */}
                  <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] md:hidden animate-in fade-in duration-300" 
                    onClick={() => setIsCartOpen(false)}
                  ></div>
                  
                  <div className="fixed md:absolute top-0 right-0 md:top-full h-full md:h-auto w-full md:w-[400px] origin-top-right rounded-none md:rounded-[2.5rem] bg-white p-6 md:p-8 shadow-2xl border-l md:border border-stone-100 animate-in slide-in-from-right md:slide-in-from-top-4 md:zoom-in-95 duration-300 z-[60]">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl md:text-2xl font-black text-stone-900">Your <span className="text-green-600 italic font-serif">Bag</span></h3>
                      <button onClick={() => setIsCartOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-stone-50 text-stone-400 hover:text-stone-900 transition-colors">
                        <X size={20} />
                      </button>
                    </div>

                    {items.length === 0 ? (
                      <div className="py-12 md:py-20 text-center flex flex-col items-center justify-center h-[60vh] md:h-auto">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-stone-50 text-stone-200 mb-6">
                          <ShoppingCart size={32} />
                        </div>
                        <p className="text-stone-500 font-bold mb-6">Your bag is currently empty.</p>
                        <Link 
                          to="/shop" 
                          className="inline-block bg-stone-900 text-white font-black px-8 py-4 rounded-2xl shadow-xl hover:bg-green-600 transition-all"
                          onClick={closeAllMenus}
                        >
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col h-[calc(100%-100px)] md:h-auto">
                        <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2 scrollbar-thin">
                          {items.map((item) => (
                            <div key={item.id} className="flex gap-4 group">
                              <div className="h-20 w-20 shrink-0 rounded-2xl bg-stone-50 overflow-hidden border border-stone-100">
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm md:text-base font-black text-stone-900 truncate">{item.name}</h4>
                                <p className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">{item.quantity} × ${item.price.toFixed(2)}</p>
                                <button 
                                  onClick={() => removeItem(item.id)}
                                  className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase mt-2 tracking-widest border-b border-transparent hover:border-red-700 transition-all"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="text-sm md:text-base font-black text-stone-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-stone-100 pt-6 md:pt-8 space-y-4 bg-white mt-auto">
                          <div className="flex items-center justify-between">
                            <span className="text-stone-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">Total Amount</span>
                            <span className="text-2xl md:text-3xl font-black text-stone-900">${totalPrice.toFixed(2)}</span>
                          </div>
                          <Link to="/checkout" onClick={closeAllMenus} className="block">
                            <Button className="w-full py-6 md:py-8 text-base md:text-lg font-black shadow-2xl shadow-green-100 rounded-2xl md:rounded-3xl">
                              Proceed to Checkout
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 pl-4 border-l border-stone-100 group"
                  >
                    <div className="h-11 w-11 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-900 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-all">
                      <User size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Account</span>
                      <span className="text-sm font-black text-stone-900">{user?.name}</span>
                    </div>
                  </button>

                  {/* Profile Dropdown - Desktop */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-4 w-64 origin-top-right rounded-[2rem] bg-white p-4 shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95 duration-300">
                      <div className="px-4 py-4 border-b border-stone-50 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Authenticated as</p>
                        <p className="text-sm font-black text-stone-900 truncate">{user?.email}</p>
                      </div>
                      
                      <Link to="/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-stone-600 hover:bg-stone-50 hover:text-green-600 transition-all" onClick={closeAllMenus}>
                        <User size={18} />
                        My Profile
                      </Link>
                      
                      <Link to="/orders" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-stone-600 hover:bg-stone-50 hover:text-green-600 transition-all" onClick={closeAllMenus}>
                        <Package size={18} />
                        Order History
                      </Link>
                      
                      <Link to="/settings" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-stone-600 hover:bg-stone-50 hover:text-green-600 transition-all" onClick={closeAllMenus}>
                        <Settings size={18} />
                        Settings
                      </Link>
                      
                      <div className="my-2 border-t border-stone-50" />
                      
                      <button 
                        onClick={() => {
                          logout();
                          closeAllMenus();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signin" className="pl-4 border-l border-stone-100">
                  <Button size="sm" className="px-8 py-6 font-black text-xs uppercase tracking-widest">Sign In</Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-stone-900 hover:text-green-600 transition-colors p-2 md:p-3 rounded-xl md:rounded-2xl bg-stone-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Toggle menu</span>
              {isMenuOpen ? <X size={20} className="md:w-6 md:h-6" /> : <Menu size={20} className="md:w-6 md:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-top duration-300 flex flex-col">
          <div className="flex items-center gap-3 p-6 border-b border-stone-100 shrink-0">
            <button onClick={() => setIsMobileSearchOpen(false)} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-stone-50 text-stone-500">
              <ArrowLeft size={24} />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                autoFocus
                type="text"
                placeholder="Search premium harvest..."
                className="w-full bg-stone-50 rounded-2xl py-4 pl-12 pr-12 text-base font-bold focus:outline-none focus:ring-4 focus:ring-green-500/5 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                onClick={() => handleSearch()}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 font-black text-xs uppercase tracking-widest"
              >
                {!isSearching && searchQuery.trim().length >= 2 && "Search"}
              </button>
              {isSearching && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 animate-spin" size={18} />
              )}
            </div>
          </div>
          
          <div className="flex-1 pb-20 bg-white min-h-screen overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 px-2">
                  <span className="text-xs font-black text-stone-400 uppercase tracking-[0.2em]">Harvest Results ({searchResults.length})</span>
                </div>
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        navigate(`/product/${result.id}`);
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-5 p-4 rounded-3xl bg-stone-50 active:scale-[0.98] transition-all text-left"
                    >
                      <div className="h-28 w-28 rounded-2xl overflow-hidden bg-white shrink-0 border border-stone-100 shadow-sm">
                        <img src={result.image} alt={result.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
                            {result.category.replace(/-/g, ' ')}
                          </span>
                        </div>
                        <p className="font-black text-stone-900 truncate text-xl">{result.name}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <p className="text-2xl font-black text-stone-900">${result.price.toFixed(2)}</p>
                          {result.discount && (
                            <span className="text-xs font-black text-red-500 bg-red-50 px-2 py-1 rounded-lg">-{Math.round(result.discount)}%</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : searchQuery.trim().length >= 2 && !isSearching ? (
              <div className="p-16 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-stone-50 text-stone-200 mb-6">
                  <Search size={40} />
                </div>
                <p className="text-stone-900 text-2xl font-black">No matches found</p>
                <p className="text-stone-500 font-medium mt-2">Try different keywords or browse our categories.</p>
              </div>
            ) : (
              <div className="p-8">
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-6 px-2">Popular Searches</h3>
                <div className="flex flex-wrap gap-3">
                  {['Avocado', 'Berries', 'Organic Kale', 'Fresh Dairy', 'Whole Grain'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-6 py-3 rounded-2xl bg-stone-50 border border-stone-100 text-sm font-bold text-stone-600 active:bg-green-600 active:text-white active:border-green-600 transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                
                <div className="mt-12 p-8 rounded-[2.5rem] bg-stone-900 text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-2">Exclusive Offer</p>
                    <h4 className="text-3xl font-black mb-4 leading-tight">20% Off on Your <br /><span className="text-green-500 italic font-serif">First Harvest</span></h4>
                    <Button 
                      onClick={() => {
                        navigate('/shop');
                        closeAllMenus();
                      }}
                      className="bg-green-600 hover:bg-green-500 text-white font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-widest shadow-2xl shadow-green-900/40"
                    >
                      Explore Shop
                    </Button>
                  </div>
                  <div className="absolute -right-8 -bottom-8 opacity-20 transition-transform group-hover:scale-110">
                    <Search size={160} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-white animate-in slide-in-from-top duration-300 overflow-y-auto">
          <div className="p-6 space-y-10">
            <nav className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 px-4 mb-4">Main Menu</p>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-3xl font-black text-stone-900 px-4 py-4 active:text-green-600 transition-colors"
                  onClick={closeAllMenus}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/shop?sortBy=id&order=desc" 
                className="text-3xl font-black text-stone-900 px-4 py-4 active:text-green-600 transition-colors"
                onClick={closeAllMenus}
              >
                New Arrivals
              </Link>
            </nav>
            
            <div className="pt-10 border-t border-stone-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 px-4 mb-6">User Account</p>
              {isAuthenticated ? (
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-5 px-4">
                    <div className="h-16 w-16 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-900 shadow-sm">
                      <User size={32} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-stone-900">{user?.name}</span>
                      <span className="text-sm text-stone-500 font-medium">{user?.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      to="/profile"
                      className="flex items-center gap-4 rounded-2xl px-6 py-5 text-base font-black text-stone-700 bg-stone-50 active:bg-stone-100"
                      onClick={closeAllMenus}
                    >
                      <User size={20} />
                      Your Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-4 rounded-2xl px-6 py-5 text-base font-black text-stone-700 bg-stone-50 active:bg-stone-100"
                      onClick={closeAllMenus}
                    >
                      <Package size={20} />
                      My Orders
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-4 rounded-2xl px-6 py-5 text-base font-black text-stone-700 bg-stone-50 active:bg-stone-100"
                      onClick={closeAllMenus}
                    >
                      <Settings size={20} />
                      Settings
                    </Link>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full justify-center gap-3 text-red-600 border-red-100 bg-red-50/50 py-8 text-lg font-black rounded-3xl"
                    onClick={() => {
                      logout();
                      closeAllMenus();
                    }}
                  >
                    <LogOut size={20} />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/signin" onClick={closeAllMenus} className="block px-4">
                  <Button className="w-full py-8 text-xl font-black shadow-2xl shadow-green-100 rounded-3xl">Sign In to Bag</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
