import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { orderService } from '../features/orders/services/orderService';
import type { Order } from '../types/order';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyles = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'In Transit':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-stone-50 text-stone-600 border-stone-100';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle2 size={14} />;
      case 'Shipped':
        return <Truck size={14} />;
      case 'In Transit':
        return <Truck size={14} />;
      case 'Processing':
        return <Clock size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-[3px] border-solid border-green-600 border-r-transparent" />
        <p className="mt-4 text-xs font-black uppercase tracking-widest text-stone-400">
          Loading Order History
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#fbfbf9] min-h-screen pb-20">
      <div className="bg-stone-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-500 mb-6">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Order History</span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.8]">
            Your{' '}
            <span className="text-green-500 italic font-serif">Harvest</span>
            <br />
            History
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-10">
        <div className="max-w-4xl">
          {orders.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-16 text-center border border-stone-100 shadow-xl">
              <div className="h-20 w-20 rounded-full bg-stone-50 flex items-center justify-center mx-auto mb-6 text-stone-300">
                <Package size={40} />
              </div>
              <h3 className="text-2xl font-black text-stone-900 mb-2">
                No orders found
              </h3>
              <p className="text-stone-500 font-medium mb-8">
                You haven't placed any orders yet. Start your organic journey
                today!
              </p>
              <Link to="/shop">
                <Button className="px-10 py-6 font-black rounded-2xl">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-50 bg-stone-50/30">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">
                          Order ID
                        </p>
                        <p className="text-sm font-black text-stone-900">
                          {order.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">
                          Date
                        </p>
                        <p className="text-sm font-black text-stone-900">
                          {order.date}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">
                          Total
                        </p>
                        <p className="text-sm font-black text-green-600">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest w-fit ${getStatusStyles(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-black text-stone-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-black text-stone-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-stone-50 flex items-center justify-between">
                      <button className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-green-600 transition-colors flex items-center gap-2">
                        View Invoice <ExternalLink size={14} />
                      </button>
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-stone-900 group-hover:text-green-600 transition-colors"
                      >
                        Track Harvest <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
