export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url?: string; 
  category: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  name?: string;
  image_url?: string;
  stock_quantity?: number;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
