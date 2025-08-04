import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../utils/types';
import { useCart } from '../hooks/useCart';
import { ProductImageManager } from '../utils/imageManager';

interface ProductCardProps {
  product: Product;
  onViewProduct?: (product: Product) => void;
  onTagSearch?: (tag: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewProduct, onTagSearch }) => {
  const { addToCart } = useCart();

  const categoryEmojis = {
    books: '📚',
    candles: '🕯️',
    sachets: '🌿',
    baskets: '🧺'
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="relative">
        <img
          onClick={() => onViewProduct && onViewProduct(product)}
          src={product.imageGallery?.[0]?.url || ProductImageManager.getPrimaryImageUrl(product.id) || product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/4792488/pexels-photo-4792488.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
        />
        
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-sage-600">
          {categoryEmojis[product.category]}
        </div>
        
        {/* Favorite button */}
        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
          <Heart className="h-4 w-4 text-sage-600" />
        </button>
        
        {/* Stock status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 
          onClick={() => onViewProduct && onViewProduct(product)}
          className="font-semibold text-sage-800 mb-2 line-clamp-2 hover:text-sage-600 transition-colors cursor-pointer"
        >
          {product.name}
        </h3>
        
        <p className="text-sm text-sage-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-sage-600 ml-2">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>
        
        {/* New structure for price and buttons */}
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-2xl font-bold text-sage-800">
            {product.price.toLocaleString()} ₽
          </span>
          {onViewProduct && (
            <button
              onClick={() => onViewProduct(product)}
              className="text-sage-600 hover:text-sage-700 text-sm font-medium"
            >
              Подробнее
            </button>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className={`w-full flex items-center justify-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 active:scale-95 ${
              product.inStock
                ? 'bg-sage-600 text-white hover:bg-sage-700 shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm">В корзину</span>
          </button>
          
          {/* Quick cart link */}
          <button
            onClick={() => {
              addToCart(product);
              setTimeout(() => {
                if (window.confirm('Товар добавлен в корзину! Перейти в корзину?')) {
                  // This would need to be passed as a prop in real implementation
                  window.location.hash = 'cart';
                }
              }, 500);
            }}
            disabled={!product.inStock}
            className={`w-full border border-sage-600 text-sage-600 px-3 py-2 rounded-lg hover:bg-sage-50 transition-colors font-medium ${
              !product.inStock ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Купить сейчас
          </button>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {product.tags.slice(0, 3).map((tag, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onTagSearch?.(tag);
              }}
              className="bg-sage-100 text-sage-600 text-xs px-2 py-1 rounded-full hover:bg-sage-200 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};