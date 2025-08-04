import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Heart, Home } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, getTotalItems } = useCart();

  // Принудительно пересчитываем количество товаров
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  console.log('🔢 Header: Cart state (length):', cart.length);
  console.log('🔢 Header: Cart items:', cart.map(item => `${item.product.name} x${item.quantity}`));
  console.log('🔢 Header: Total items calculated:', totalItems);

  const navigation = [
    { name: 'Главная', page: 'home' },
    { name: 'Каталог', page: 'catalog' },
    { name: 'Услуги', page: 'services' },
    { name: 'О нас', page: 'about' },
    { name: 'Конструктор', page: 'constructor' }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-sage-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => onPageChange('home')}
          >
            <Home className="h-8 w-8 text-sage-600 group-hover:text-sage-700 transition-colors" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-sage-800">Порядочный Дом</h1>
              <p className="text-xs text-sage-600 hidden sm:block">Порядок в доме — порядок в жизни</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => onPageChange(item.page)}
                className={`text-sm font-medium transition-colors hover:text-sage-600 ${
                  currentPage === item.page
                    ? 'text-sage-600 border-b-2 border-sage-600'
                    : 'text-sage-800'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center max-w-md mx-8 flex-1">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-400" />
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 text-sage-600 hover:text-sage-700 transition-colors"
              onClick={() => onPageChange('wishlist')}
            >
              <Heart className="h-5 w-5" />
            </button>
            <button 
              className="p-2 text-sage-600 hover:text-sage-700 transition-colors relative"
              onClick={() => onPageChange('cart')}
              title="Корзина"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              className="p-2 text-sage-600 hover:text-sage-700 transition-colors"
              onClick={() => onPageChange('account')}
            >
              <User className="h-5 w-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-sage-600 hover:text-sage-700 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-sage-200">
            <div className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onPageChange(item.page);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors hover:bg-sage-50 rounded-lg ${
                    currentPage === item.page
                      ? 'text-sage-600 bg-sage-50'
                      : 'text-sage-800'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            
            {/* Mobile Search */}
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-400" />
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};