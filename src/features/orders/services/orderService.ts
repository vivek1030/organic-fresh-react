import type { Order } from '../../../types/order';

const mockOrders: Order[] = [
  {
    id: 'ORD-2026-8821',
    date: 'Jan 15, 2026',
    status: 'Delivered',
    total: 84.50,
    recipient: 'Vivek Kumar',
    shippingAddress: '45 Fresh Lane, Green Park, London, SE1 4GF',
    phone: '+44 7700 900551',
    items: [
      { id: 1, name: 'Essence Mascara Lash Princess', price: 9.99, quantity: 3, image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.jpg' },
      { id: 5, name: 'Red Lipstick', price: 12.99, quantity: 1, image: 'https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.jpg' }
    ],
    tracking: [
      { status: 'Order Placed', date: 'Jan 14, 2026', time: '10:30 AM', location: 'Organic Hub, Central', isCompleted: true, isCurrent: false },
      { status: 'Harvesting', date: 'Jan 14, 2026', time: '12:45 PM', location: 'Green Valley Farm', isCompleted: true, isCurrent: false },
      { status: 'Delivered', date: 'Jan 15, 2026', time: '02:00 PM', location: 'Your Doorstep', isCompleted: true, isCurrent: true },
    ]
  },
  {
    id: 'ORD-2026-7712',
    date: 'Jan 18, 2026',
    status: 'In Transit',
    total: 42.15,
    recipient: 'Vivek Kumar',
    shippingAddress: '45 Fresh Lane, Green Park, London, SE1 4GF',
    phone: '+44 7700 900551',
    items: [
      { id: 10, name: 'Gucci Bloom Eau de', price: 150.00, quantity: 1, image: 'https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/thumbnail.jpg' }
    ],
    tracking: [
      { status: 'Order Placed', date: 'Jan 18, 2026', time: '09:00 AM', location: 'Organic Hub, Central', isCompleted: true, isCurrent: false },
      { status: 'Harvesting', date: 'Jan 18, 2026', time: '11:30 AM', location: 'Eco-Farm Distribution', isCompleted: true, isCurrent: false },
      { status: 'In Transit', date: 'Jan 19, 2026', time: '08:00 AM', location: 'On the way to your city', isCompleted: true, isCurrent: true },
      { status: 'Delivered', date: 'Estimated: Jan 19, 2026', time: 'By 06:00 PM', location: 'Your Doorstep', isCompleted: false, isCurrent: false },
    ]
  }
];

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockOrders), 800);
    });
  },
  getOrderById: async (id: string): Promise<Order | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockOrders.find(o => o.id === id)), 800);
    });
  }
};
