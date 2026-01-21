import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ChevronRight, Truck, User, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../features/cart/store/useCartStore';

export const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate order processing
    setTimeout(() => {
      setLoading(false);
      clearCart();
      alert('Order placed successfully! Thank you for shopping with Organic.');
      navigate('/');
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">Your cart is empty</h2>
        <p className="text-stone-600 mb-8">Add some fresh products before checking out.</p>
        <Link to="/shop">
          <Button size="lg">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-stone-100 bg-white">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm font-medium text-stone-500">
            <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="hover:text-green-600 transition-colors">Shop</Link>
            <ChevronRight size={14} />
            <span className="text-stone-900 font-bold">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-6">
            <form id="checkout-form" onSubmit={handlePlaceOrder}>
              {/* Shipping Information */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input required type="text" placeholder="John Doe" className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input required type="email" placeholder="john@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input required type="tel" placeholder="+1 (555) 000-0000" className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-stone-700 ml-1">Shipping Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-stone-400" size={18} />
                      <textarea required rows={3} placeholder="123 Organic Lane, Fresh City, 90210" className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">Payment Method</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-stone-700 ml-1">Card Number</label>
                      <input required type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-stone-700 ml-1">Expiry Date</label>
                      <input required type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-stone-700 ml-1">CVV</label>
                      <input required type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-800 text-sm">
                    <ShieldCheck size={20} className="shrink-0" />
                    <p>Your payment information is encrypted and processed securely. We never store your full card details.</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-stone-100 sticky top-24">
              <h2 className="text-xl font-bold text-stone-900 mb-6 pb-4 border-b border-stone-50">Order Summary</h2>
              
              <div className="max-h-60 overflow-y-auto pr-2 scrollbar-thin mb-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-14 w-14 rounded-xl overflow-hidden border border-stone-100 shrink-0 bg-stone-50">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-900 truncate">{item.name}</p>
                      <p className="text-xs text-stone-500">{item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <span className="text-sm font-bold text-stone-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-stone-50 pt-6 mb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span className="font-bold text-green-600">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-stone-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-stone-900 pt-3 border-t border-stone-50">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form"
                size="lg" 
                className="w-full py-8 text-lg shadow-xl shadow-green-100"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </Button>
              
              <p className="text-[10px] text-center text-stone-400 mt-4">
                By placing this order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>

            {/* Support Info */}
            <div className="bg-green-600 rounded-3xl p-6 text-white text-center">
              <p className="text-sm font-bold mb-1">Need help with your order?</p>
              <p className="text-xs text-green-100">Contact our support team 24/7</p>
              <p className="mt-3 font-black text-lg">1-800-ORGANIC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
