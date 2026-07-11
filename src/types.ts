export interface Perfume {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  price100ml: number;
  price50ml: number;
  image: string;
  olfactoryFamily: string;
  concentration: string; // e.g. Extrait de Parfum, Eau de Parfum
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  longevity: string; // e.g. 8-10 Hours
  sillage: string; // e.g. Strong
  gender: 'Unisex' | 'Men' | 'Women';
  ingredients: string[];
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  perfume: Perfume;
  size: '50ml' | '100ml';
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'UPI' | 'Stripe' | 'COD';
  paymentStatus: 'Paid' | 'Pending';
  totalAmount: number;
  shippingCharge: number;
  taxAmount: number;
  orderStatus: 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  invoiceNumber: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}
