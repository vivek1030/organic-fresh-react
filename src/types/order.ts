export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface TrackingStep {
  status: string;
  date: string;
  time: string;
  location: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'In Transit';
  total: number;
  items: OrderItem[];
  tracking: TrackingStep[];
  shippingAddress: string;
  recipient: string;
  phone: string;
}
