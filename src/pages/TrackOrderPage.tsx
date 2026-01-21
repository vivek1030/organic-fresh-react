import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, CheckCircle2, Clock, MapPin, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { orderService } from '../features/orders/services/orderService';
import type { Order } from '../types/order';

export const TrackOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data || null);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-[3px] border-solid border-green-600 border-r-transparent" />
        <p className="mt-4 text-xs font-black uppercase tracking-widest text-stone-400">Locating Your Harvest</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-black text-stone-900 mb-4">Harvest not found</h2>
        <p className="text-stone-500 mb-8">We couldn't find any record for ID: {id}</p>
        <Link to="/orders">
          <Button className="px-10 py-6 font-black rounded-2xl">Back to History</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fbfbf9] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-stone-900 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-500 mb-6">
            <Link to="/orders" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft size={12} /> Back to History
            </Link>
            <span>/</span>
            <span className="text-white">Track Harvest</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black leading-[0.8] mb-4">
                Tracking <span className="text-green-500 italic font-serif">Journey</span>
              </h1>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Order ID: {order.id}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-1">Estimated Delivery</p>
              <p className="text-xl font-black italic">
                {order.status === 'Delivered' ? 'Delivered on ' + order.date : 'Jan 19 — by 6:00 PM'}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Timeline */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-stone-100 shadow-xl">
              <div className="space-y-0">
                {order.tracking.map((step, idx) => (
                  <div key={idx} className="relative flex gap-6 pb-12 last:pb-0">
                    {/* Vertical Line */}
                    {idx !== order.tracking.length - 1 && (
                      <div className={`absolute left-[15px] top-[30px] bottom-0 w-0.5 ${step.isCompleted ? 'bg-green-600' : 'bg-stone-100'}`}></div>
                    )}
                    
                    {/* Status Icon */}
                    <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                      step.isCompleted ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-100' : 'bg-white border-stone-100 text-stone-300'
                    } ${step.isCurrent ? 'ring-4 ring-green-50 animate-pulse' : ''}`}>
                      {step.isCompleted ? <CheckCircle2 size={16} /> : <div className="h-2 w-2 rounded-full bg-current" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
                        <h4 className={`text-lg font-black transition-colors ${step.isCurrent ? 'text-green-600' : 'text-stone-900'} ${!step.isCompleted && !step.isCurrent ? 'text-stone-300' : ''}`}>
                          {step.status}
                        </h4>
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-stone-400">
                          <span className="flex items-center gap-1"><Clock size={12} /> {step.time}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {step.location}</span>
                        </div>
                      </div>
                      <p className={`text-sm font-medium ${step.isCompleted || step.isCurrent ? 'text-stone-500' : 'text-stone-300'}`}>
                        {step.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Map Placeholder */}
            <div className="bg-stone-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden group">
              <div className="relative z-10 max-w-sm">
                <h3 className="text-3xl font-black mb-4 italic">Real-Time Map View</h3>
                <p className="text-stone-400 font-medium mb-8 leading-relaxed">
                  Our delivery partner <span className="text-white font-bold">Alex M.</span> is currently 2.4 miles away from your location.
                </p>
                <Button className="bg-white text-stone-900 hover:bg-green-600 hover:text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                  Contact Driver
                </Button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 grayscale group-hover:grayscale-0 transition-all duration-1000">
                 <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" alt="Map" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm">
              <h3 className="text-xl font-black text-stone-900 mb-6 flex items-center gap-2">
                <Package size={20} className="text-green-600" /> Delivery Details
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Recipient</p>
                  <p className="text-sm font-black text-stone-900">{order.recipient}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Shipping Address</p>
                  <p className="text-sm font-black text-stone-900">{order.shippingAddress}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Phone Number</p>
                  <p className="text-sm font-black text-stone-900">{order.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-[2.5rem] p-8 border border-green-100">
              <h3 className="text-xl font-black text-green-700 mb-4 italic">Safe Harvest Guarantee</h3>
              <p className="text-sm text-green-700/70 font-medium leading-relaxed mb-6">
                Your order is being transported in a temperature-controlled organic-certified vehicle to maintain maximum freshness.
              </p>
              <Link to="/shop" className="text-xs font-black uppercase tracking-widest text-green-700 flex items-center gap-2 hover:translate-x-1 transition-transform">
                Browse New Harvests <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
