import React from 'react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ServiceCard } from '../components/ServiceCard';
import { BlogCard } from '../components/BlogCard';
import { CatalogManager } from '../components/CatalogManager';
import { products } from '../data/products';
import { services } from '../data/services';
import { blogPosts } from '../data/blog';
import { fragrances, formats } from '../data/fragrances';
import { ArrowRight, Sparkles, Gift, Users, Shield, ShoppingCart, Settings } from 'lucide-react';

interface HomeProps {
  onPageChange: (page: string) => void;
  onTagSearch: (tag: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onPageChange, onTagSearch }) => {
  const [showCatalogManager, setShowCatalogManager] = React.useState(false);
  const featuredProducts = products.slice(0, 4);
  const featuredServices = services.slice(0, 3);
  const featuredPosts = blogPosts.slice(0, 3);

  // Подсчет доступных ароматов и форматов
  const getAvailableCounts = () => {
    const totalAromas = fragrances.length;
    const availableAromas = fragrances.filter(f => f.availableFormats.length > 0).length;
    
    const candleFormats = formats.filter(f => f.type === 'candle' || f.type === 'jar');
    const sachetFormats = formats.filter(f => f.type === 'sachet');
    
    const availableCandleFormats = candleFormats.filter(format => 
      fragrances.some(fragrance => fragrance.availableFormats.includes(format.id))
    ).length;
    
    const availableSachetFormats = sachetFormats.filter(format => 
      fragrances.some(fragrance => fragrance.availableFormats.includes(format.id))
    ).length;
    
    return {
      candles: {
        aromas: `${availableAromas}/${totalAromas} ароматов`,
        formats: `${availableCandleFormats}/${candleFormats.length} формата`
      },
      sachets: {
        aromas: `${availableAromas}/${totalAromas} ароматов`, 
        formats: `${availableSachetFormats}/${sachetFormats.length} формата`
      }
    };
  };

  const counts = getAvailableCounts();

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-sage-600" />,
      title: 'Качественные товары',
      description: 'Тщательно отобранные товары от проверенных производителей'
    },
    {
      icon: <Gift className="h-8 w-8 text-sage-600" />,
      title: 'Персональные наборы',
      description: 'Создайте уникальный набор под свои потребности'
    },
    {
      icon: <Users className="h-8 w-8 text-sage-600" />,
      title: 'Профессиональные услуги',
      description: 'Консультации экспертов по организации пространства'
    },
    {
      icon: <Shield className="h-8 w-8 text-sage-600" />,
      title: 'Гарантия качества',
      description: 'Все товары проходят строгий контроль качества'
    }
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Admin Button - только для демонстрации */}
      <button
        onClick={() => setShowCatalogManager(true)}
        className="fixed bottom-4 right-4 bg-sage-600 text-white p-3 rounded-full shadow-lg hover:bg-sage-700 transition-colors z-40"
        title="Управление каталогом"
      >
        <Settings className="h-5 w-5" />
      </button>

      <Hero />

      {/* Quick Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-800 mb-4">
              Выберите категорию
            </h2>
            <p className="text-sage-600 max-w-2xl mx-auto">
              Откройте для себя наши тщательно отобранные товары для создания уютного дома
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                id: 'candles', 
                name: 'Свечи', 
                emoji: '🕯️', 
                color: 'bg-orange-100', 
                count: counts.candles.aromas,
                subcount: counts.candles.formats
              },
              { 
                id: 'sachets', 
                name: 'Саше', 
                emoji: '🌿', 
                color: 'bg-green-100', 
                count: counts.sachets.aromas,
                subcount: counts.sachets.formats
              },
              { 
                id: 'books', 
                name: 'Книги', 
                emoji: '📚', 
                color: 'bg-blue-100', 
                count: '3/3 книги',
                subcount: 'все доступны'
              },
              { 
                id: 'baskets', 
                name: 'Корзины', 
                emoji: '🧺', 
                color: 'bg-yellow-100', 
                count: '5/5 моделей',
                subcount: '3 корзины + 2 подставки'
              }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => onPageChange('catalog', category.id)}
                className={`${category.color} hover:scale-105 transition-all duration-300 p-6 rounded-xl text-center group`}
              >
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h3 className="font-semibold text-sage-800 mb-1">{category.name}</h3>
                <p className="text-sm text-sage-600 font-medium">{category.count}</p>
                <p className="text-xs text-sage-500">{category.subcount}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-sage-800 mb-4">
                Рекомендуемые товары
              </h2>
              <p className="text-sage-600">
                Популярные товары, которые помогут создать уют в вашем доме
              </p>
            </div>
            <button
              onClick={() => onPageChange('catalog')}
              className="flex items-center text-sage-600 hover:text-sage-700 font-medium transition-colors group"
            >
              <span>Смотреть все</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewProduct={(product) => {
                  // Здесь можно добавить логику просмотра товара
                  console.log('View product:', product.name);
                }}
                onTagSearch={(tag) => {
                  console.log('🏷️ Tag search from Home:', tag);
                  onPageChange('catalog');
                  // Устанавливаем поисковый запрос
                  setTimeout(() => {
                    const searchInput = document.querySelector('input[placeholder="Поиск товаров..."]') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.value = tag;
                      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }, 100);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-800 mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-sage-600 max-w-2xl mx-auto">
              Мы создаем не просто товары, а атмосферу уюта и гармонии для вашего дома
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-sage-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sage-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-sage-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sage-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-sage-800 mb-4">
                Наши услуги
              </h2>
              <p className="text-sage-600">
                Профессиональная помощь в создании идеального дома
              </p>
            </div>
            <button
              onClick={() => onPageChange('services')}
              className="flex items-center text-sage-600 hover:text-sage-700 font-medium transition-colors group"
            >
              <span>Все услуги</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-sage-800 mb-4">
                Полезные статьи
              </h2>
              <p className="text-sage-600">
                Советы и секреты создания уютного дома
              </p>
            </div>
            <button
              onClick={() => onPageChange('blog')}
              className="flex items-center text-sage-600 hover:text-sage-700 font-medium transition-colors group"
            >
              <span>Читать блог</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} onTagSearch={onTagSearch} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-sage-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Готовы создать дом своей мечты?
          </h2>
          <p className="text-sage-100 mb-8 max-w-2xl mx-auto">
            Начните с персональной консультации или соберите свой уникальный набор товаров
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onPageChange('services')}
              className="bg-white text-sage-600 px-8 py-3 rounded-lg hover:bg-sage-50 transition-colors font-medium"
            >
              Записаться на консультацию
            </button>
            <button
              onClick={() => onPageChange('constructor')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-sage-600 transition-colors font-medium"
            >
              Создать набор
            </button>
          </div>
        </div>
      </section>

      {/* Catalog Manager Modal */}
      {showCatalogManager && (
        <CatalogManager onClose={() => setShowCatalogManager(false)} />
      )}
    </div>
  );
};