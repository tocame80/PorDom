import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, Plus, Minus, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '../utils/types';
import { useCart } from '../hooks/useCart';
import { products } from '../data/products';
import { ProductImageManager } from '../utils/imageManager';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onTagSearch }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  const product = products.find(p => p.id === productId);
  
  // Получаем изображения товара
  const productImages = product?.imageGallery?.map(img => img.url) || 
                       ProductImageManager.getProductImages(productId).map(img => img.url) ||
                       (product?.images && product.images.length > 0 ? product.images : [product?.image || '']);

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-sage-800 mb-4">Товар не найден</h2>
          <button
            onClick={onBack}
            className="bg-sage-600 text-white px-6 py-2 rounded-lg hover:bg-sage-700 transition-colors"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const categoryEmojis = {
    books: '📚',
    candles: '🕯️',
    sachets: '🌿',
    baskets: '🧺'
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-sage-600 hover:text-sage-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Назад к каталогу
          </button>
          
          <nav className="text-sm text-sage-600">
            <span>Главная</span>
            <span className="mx-2">/</span>
            <span>Каталог</span>
            <span className="mx-2">/</span>
            <span className="text-sage-800">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-sage-600' : 'border-sage-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center mb-2">
              <span className="bg-sage-100 text-sage-600 px-2 py-1 rounded-full text-sm mr-2">
                {categoryEmojis[product.category]}
              </span>
              <span className="text-sage-600 text-sm">Артикул: {product.id}</span>
            </div>

            <h1 className="text-3xl font-bold text-sage-800 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sage-600">
                {product.rating} ({product.reviews} отзывов)
              </span>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-sage-800">
                {product.price.toLocaleString()} ₽
              </span>
            </div>

            <p className="text-sage-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-sage-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-sage-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-sage-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all ${
                  product.inStock
                    ? 'bg-sage-600 text-white hover:bg-sage-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Добавить в корзину</span>
              </button>
            </div>

            <div className="flex space-x-4 mb-8">
              <button className="flex items-center space-x-2 text-sage-600 hover:text-sage-700">
                <Heart className="h-5 w-5" />
                <span>В избранное</span>
              </button>
              <button className="flex items-center space-x-2 text-sage-600 hover:text-sage-700">
                <Share2 className="h-5 w-5" />
                <span>Поделиться</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-2 text-sm text-sage-600">
                <Truck className="h-4 w-4" />
                <span>Бесплатная доставка от 2000₽</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-sage-600">
                <Shield className="h-4 w-4" />
                <span>Гарантия качества</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-sage-600">
                <RotateCcw className="h-4 w-4" />
                <span>Возврат 14 дней</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onTagSearch?.(tag);
                  }}
                  className="bg-sage-100 text-sage-600 text-sm px-3 py-1 rounded-full hover:bg-sage-200 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-sage-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', name: 'Описание' },
                { id: 'characteristics', name: 'Характеристики' },
                { id: 'reviews', name: 'Отзывы' },
                { id: 'delivery', name: 'Доставка' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-sage-600 text-sage-600'
                      : 'border-transparent text-sage-500 hover:text-sage-700'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-sage-700 leading-relaxed">
                  {product.description}
                </p>
                <p className="text-sage-700 leading-relaxed mt-4">
                  Этот товар создан с особой заботой о качестве и вашем комфорте. 
                  Мы используем только натуральные материалы и проверенные технологии производства.
                </p>
              </div>
            )}

            {activeTab === 'characteristics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-sage-800 mb-4">Основные характеристики</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sage-600">Категория:</dt>
                      <dd className="text-sage-800">{categoryEmojis[product.category]} {product.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sage-600">Рейтинг:</dt>
                      <dd className="text-sage-800">{product.rating}/5</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sage-600">Наличие:</dt>
                      <dd className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                        {product.inStock ? 'В наличии' : 'Нет в наличии'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="font-semibold text-sage-800 mb-4">Отзывы покупателей</h3>
                <p className="text-sage-600">Отзывы появятся здесь после покупок.</p>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div>
                <h3 className="font-semibold text-sage-800 mb-4">Условия доставки</h3>
                <div className="space-y-4 text-sage-700">
                  <p>• Бесплатная доставка по Москве при заказе от 2000₽</p>
                  <p>• Доставка курьером: 300₽</p>
                  <p>• Самовывоз из магазина: бесплатно</p>
                  <p>• Время доставки: 1-3 рабочих дня</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};