import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Home } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-sage-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Home className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Порядочный Дом</h3>
            </div>
            <p className="text-sage-300 mb-4 text-sm leading-relaxed">
              Создаем гармоничные пространства для комфортной жизни. 
              Порядок в доме — порядок в жизни.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sage-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-sage-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-sage-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-sage-300 hover:text-white transition-colors">
                  Каталог товаров
                </a>
              </li>
              <li>
                <a href="#" className="text-sage-300 hover:text-white transition-colors">
                  Услуги
                </a>
              </li>
              <li>
                <a href="#" className="text-sage-300 hover:text-white transition-colors">
                  Конструктор наборов
                </a>
              </li>
              <li>
                <a href="#" className="text-sage-300 hover:text-white transition-colors">
                  Блог
                </a>
              </li>
              <li>
                <a href="#" className="text-sage-300 hover:text-white transition-colors">
                  О нас
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Категории</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-sage-300 hover:text-white transition-colors">
                  📚 Книги
                </a>
              </li>
              <li>
                <a href="#" className="text-sage-300 hover:text-white transition-colors">
                  🕯️ Свечи
                </a>
              </li>
              <li>
                <a href="#" className="text-sage-300 hover:text-white transition-colors">
                  🌿 Саше
                </a>
              </li>
              <li>
                <a href="#" className="text-sage-300 hover:text-white transition-colors">
                  🧺 Корзины
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-sage-400" />
                <span className="text-sage-300">+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-sage-400" />
                <span className="text-sage-300">info@poryadochnydom.ru</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-sage-400 mt-0.5" />
                <span className="text-sage-300">
                  Москва, ул. Гармонии, 15
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="font-medium mb-2">Рабочие часы:</h5>
              <div className="text-sm text-sage-300">
                <p>Пн-Пт: 10:00 - 19:00</p>
                <p>Сб: 10:00 - 17:00</p>
                <p>Вс: выходной</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-sage-700 mt-8 pt-8 text-center text-sm text-sage-400">
          <p>&copy; 2024 Порядочный Дом. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};