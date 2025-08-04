import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Services } from './pages/Services';
import { Constructor } from './pages/Constructor';
import Cart from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { ProductDetail } from './pages/ProductDetail';
import { Wishlist } from './pages/Wishlist';
import { About } from './pages/About';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleTagSearch = (tag: string) => {
    setSearchQuery(tag);
    setCurrentPage('catalog');
    setSelectedCategory('all'); // Сбрасываем категорию при поиске по тегу
  };
  
  const handlePageChange = (page: string, category?: string) => {
    setCurrentPage(page);
    if (category) {
      setSelectedCategory(category);
    } else if (page !== 'catalog') {
      setSelectedCategory('all');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPageChange={handlePageChange} onTagSearch={handleTagSearch} />;
      case 'catalog':
        return <Catalog onViewProduct={(product) => {
          setSelectedProductId(product.id);
          setCurrentPage('product-detail');
        }} searchQuery={searchQuery} onTagSearch={handleTagSearch} selectedCategory={selectedCategory} />;
      case 'services':
        return <Services />;
      case 'constructor':
        return <Constructor />;
      case 'cart':
        return <Cart onPageChange={handlePageChange} />;
      case 'checkout':
        return <Checkout onBack={() => setCurrentPage('cart')} />;
      case 'product-detail':
        return selectedProductId ? (
          <ProductDetail 
            productId={selectedProductId} 
            onBack={() => setCurrentPage('catalog')} 
            onTagSearch={handleTagSearch}
          />
        ) : <Home onPageChange={handlePageChange} onTagSearch={handleTagSearch} />;
      case 'wishlist':
        return <Wishlist onPageChange={handlePageChange} onTagSearch={handleTagSearch} />;
      case 'about':
        return <About />;
      case 'blog':
        return <div className="min-h-screen bg-cream-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-sage-800 mb-4">Блог</h2>
            <p className="text-sage-600">Раздел в разработке</p>
          </div>
        </div>;
      case 'account':
        return <div className="min-h-screen bg-cream-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-sage-800 mb-4">Личный кабинет</h2>
            <p className="text-sage-600">Раздел в разработке</p>
          </div>
        </div>;
      default:
        return <Home onPageChange={handlePageChange} onTagSearch={handleTagSearch} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  )
}

export default App;