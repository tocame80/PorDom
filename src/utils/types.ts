export interface Product {
  id: string;
  slug?: string; // SEO-friendly URL
  name: string;
  category: 'books' | 'candles' | 'sachets' | 'baskets';
  price: number;
  originalPrice?: number; // цена до скидки
  discountPrice?: number; // цена со скидкой
  discountPercent?: number; // процент скидки
  discountActive?: boolean; // активна ли скидка
  image: string;
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  tags: string[];
  images?: string[];
  characteristics?: { [key: string]: string };
  imageGallery?: {
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
  }[];
  // Для ароматических товаров
  fragrance?: string; // ID аромата
  format?: string; // ID формата
  // Для виртуальных наборов
  isCustomSet?: boolean;
  customSetItems?: {
    product: Product;
    quantity: number;
  }[];
}

export interface Fragrance {
  id: string;
  name: string;
  description?: string;
  availableFormats: string[]; // массив ID доступных форматов
  color?: string; // цветовая кодировка
}

export interface Format {
  id: string;
  name: string;
  type: 'sachet' | 'candle' | 'jar';
  size: string;
  description?: string;
  basePrice: number; // базовая цена для этого формата
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  features: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  orders: Order[];
  favorites: string[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}