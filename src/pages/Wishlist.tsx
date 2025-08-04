import React from 'react';
import { Heart, ShoppingCart, X, ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';

interface WishlistProps {
  onPageChange: (page: string) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ onPageChange }) => {
  // В реальном приложении это будет из состояния/localStorage
  const wishlistItems = products.slice(0, 3);

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold text-sage-800 mb-8">Избранное</h1>
          
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-sage-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-sage-800 mb-2">Ваш список избранного пуст</h2>
            <p className="text-sage-600 mb-6">Добавьте товары, которые вам нравятся</p>
            <button
              onClick={() => onPageChange('catalog')}
              className="bg-sage-600 text-white px-6 py-3 rounded-lg hover:bg-sage-700 transition-colors"
            >
              Перейти в каталог
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-sage-800">Избранное</h1>
          <span className="text-sage-600">{wishlistItems.length} товаров</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} onTagSearch={onTagSearch} />
              <button className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onPageChange('catalog')}
            className="inline-flex items-center text-sage-600 hover:text-sage-700 font-medium"
          >
            <span>Продолжить покупки</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};