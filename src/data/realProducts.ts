import { Product } from '../utils/types';
import { fragrances, formats, generateProductFromFragranceFormat } from './fragrances';

// Базовые товары (книги и корзины)
const baseProducts: Product[] = [
  // КНИГИ ПО ОРГАНИЗАЦИИ ПРОСТРАНСТВА
  {
    id: 'book-001',
    slug: 'fruktovo-yagodnaya-azbuka-ot-a-do-ya',
    name: 'Фруктово-ягодная азбука от А до Я',
    category: 'books',
    price: 890,
    image: 'https://images.pexels.com/photos/4866041/pexels-photo-4866041.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Книга. Полный справочник фруктов и ягод с описанием их свойств, способов выращивания и использования. Книга содержит подробные описания более 100 видов фруктов и ягод, их полезные свойства, рецепты приготовления и советы по хранению. Идеальный помощник для садоводов и любителей здорового питания.',
    inStock: true,
    rating: 4.8,
    reviews: 2847,
    tags: ['книга', 'фрукты', 'ягоды', 'справочник', 'садоводство', 'азбука'],
    images: [
      'https://images.pexels.com/photos/4866041/pexels-photo-4866041.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5711937/pexels-photo-5711937.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    characteristics: {
      'Автор': 'А.В. Садовников',
      'Издательство': 'Природа',
      'Год издания': '2023',
      'Страниц': '280',
      'Размеры': '21×14×2 см',
      'Вес': '450г',
      'Переплет': 'Твердый',
      'ISBN': '978-5-04-116789-1',
      'Язык': 'Русский'
    }
  },
  {
    id: 'book-002',
    slug: 'mechty-prevrashchaem-v-realnye-tseli',
    name: 'Мечты превращаем в реальные цели',
    category: 'books',
    price: 750,
    image: 'https://images.pexels.com/photos/5711937/pexels-photo-5711937.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Книга. Практическое руководство по постановке и достижению целей. Превратите мечты в конкретные планы действий. Книга содержит проверенные методики планирования, техники мотивации и пошаговые алгоритмы достижения любых целей. Подходит для личного и профессионального развития.',
    inStock: true,
    rating: 4.6,
    reviews: 1234,
    tags: ['книга', 'мечты', 'цели', 'планирование', 'мотивация', 'успех'],
    characteristics: {
      'Автор': 'М.П. Целеустремленный',
      'Издательство': 'Успех',
      'Год издания': '2023',
      'Страниц': '220',
      'Размеры': '20×13×1.5 см',
      'Вес': '320г',
      'Переплет': 'Твердый',
      'Язык': 'Русский'
    }
  },
  {
    id: 'book-003',
    slug: 'dnevnik-poryadochnoy-zhenshchiny',
    name: 'Дневник порядочной женщины',
    category: 'books',
    price: 820,
    image: 'https://images.pexels.com/photos/4866041/pexels-photo-4866041.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Книга. Личный дневник для современной женщины. Планирование дня, саморазвитие и создание гармоничной жизни. Включает разделы для целей, благодарностей, рефлексии и планирования. Помогает структурировать мысли и достигать баланса между работой и личной жизнью.',
    inStock: true,
    rating: 4.7,
    reviews: 987,
    tags: ['книга', 'дневник', 'женщина', 'планирование', 'саморазвитие', 'гармония'],
    characteristics: {
      'Автор': 'Е.А. Гармонова',
      'Издательство': 'Женский мир',
      'Год издания': '2023',
      'Страниц': '240',
      'Размеры': '19×12×2 см',
      'Вес': '380г',
      'Переплет': 'Твердый',
      'Язык': 'Русский'
    }
  },

  // КОРЗИНЫ И ОРГАНАЙЗЕРЫ
  {
    id: 'basket-001',
    slug: 'pletenaya-korzina-iz-rotanga-bolshaya',
    name: 'Плетеная корзина из ротанга большая',
    category: 'baskets',
    price: 2890,
    image: 'https://images.pexels.com/photos/6436293/pexels-photo-6436293.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Большая корзина из натурального ротанга для хранения белья, игрушек или декоративных предметов. Ручная работа мастеров Индонезии. Прочная конструкция выдерживает до 15 кг. Экологически чистый материал, безопасный для детей. Подходит для любого интерьера.',
    inStock: true,
    rating: 4.8,
    reviews: 345,
    tags: ['ротанг', 'большая', 'хранение', 'натуральная', 'плетеная'],
    characteristics: {
      'Материал': '100% ротанг',
      'Размеры': '45×35×30 см',
      'Размеры (ДxШxВ)': '45×35×30 см',
      'Объем': '47 литров',
      'Вес': '1200г',
      'Цвет': 'Натуральный',
      'Максимальная нагрузка': '15 кг',
      'Страна производства': 'Индонезия'
    }
  },
  {
    id: 'basket-002',
    slug: 'nabor-korzin-iz-dzhuta-3-sht',
    name: 'Набор корзин из джута 3 шт',
    category: 'baskets',
    price: 1890,
    image: 'https://images.pexels.com/photos/4792484/pexels-photo-4792484.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Комплект из трех корзин разного размера из экологичного джута. Идеально для организации пространства. Прочные ручки для удобного переноса. Можно стирать в машинке при 30°C. Подходят для хранения игрушек, белья, аксессуаров.',
    inStock: true,
    rating: 4.7,
    reviews: 267,
    tags: ['джут', 'набор', 'эко', 'организация', 'разные размеры'],
    characteristics: {
      'Материал': 'Джут',
      'Количество': '3 штуки',
      'Размеры': 'S: 20×15 см, M: 25×20 см, L: 30×25 см',
      'Размеры малой': '20×15×12 см',
      'Размеры средней': '25×20×15 см', 
      'Размеры большой': '30×25×18 см',
      'Вес комплекта': '800г',
      'Цвет': 'Натуральный бежевый',
      'Уход': 'Машинная стирка 30°C'
    }
  },
  {
    id: 'basket-003',
    slug: 'organayzer-dlya-kosmetiki-s-otdeleniyami',
    name: 'Органайзер для косметики с отделениями',
    category: 'baskets',
    price: 1450,
    image: 'https://images.pexels.com/photos/4792484/pexels-photo-4792484.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Стильный органайзер из бамбука с несколькими отделениями для косметики и аксессуаров. Экологически чистый материал. Влагостойкое покрытие. Подходит для ванной комнаты и туалетного столика. Легко чистится влажной тряпкой.',
    inStock: true,
    rating: 4.9,
    reviews: 423,
    tags: ['органайзер', 'косметика', 'бамбук', 'отделения', 'стильный'],
    characteristics: {
      'Материал': 'Бамбук',
      'Отделений': '6 различных размеров',
      'Размеры': '25×20×15 см',
      'Размеры (ДxШxВ)': '25×20×15 см',
      'Вес': '650г',
      'Покрытие': 'Лак на водной основе',
      'Влагостойкость': 'Да',
      'Уход': 'Протирать влажной тканью'
    }
  },
  {
    id: 'stand-001',
    slug: 'derevyannaya-podstavka-pod-svechu-klassik',
    name: 'Деревянная подставка под свечу "Классик"',
    category: 'baskets',
    price: 890,
    image: 'https://images.pexels.com/photos/4792484/pexels-photo-4792484.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Элегантная деревянная подставка из натурального дуба. Защищает поверхность от воска и создает уютную атмосферу. Ручная обработка и покрытие натуральным маслом. Подходит для свечей любого типа. Легко чистится.',
    inStock: true,
    rating: 4.7,
    reviews: 156,
    tags: ['подставка', 'дерево', 'дуб', 'свечи', 'защита'],
    characteristics: {
      'Материал': 'Натуральный дуб',
      'Диаметр': '12 см',
      'Высота': '2 см',
      'Размеры': 'Ø12×2 см',
      'Вес': '180г',
      'Покрытие': 'Натуральное масло',
      'Подходит для': 'Свечей диаметром до 10 см',
      'Обработка': 'Ручная'
    }
  },
  {
    id: 'stand-002',
    slug: 'metallicheskaya-podstavka-vintazh-s-uzorom',
    name: 'Металлическая подставка "Винтаж" с узором',
    category: 'baskets',
    price: 1290,
    image: 'https://images.pexels.com/photos/6436293/pexels-photo-6436293.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Изысканная металлическая подставка с винтажным узором. Антикоррозийное покрытие и элегантный дизайн. Кованые элементы ручной работы. Устойчива к высоким температурам. Подходит для интерьеров в классическом стиле.',
    inStock: true,
    rating: 4.8,
    reviews: 203,
    tags: ['подставка', 'металл', 'винтаж', 'узор', 'элегантность'],
    characteristics: {
      'Материал': 'Металл с покрытием',
      'Диаметр': '15 см',
      'Высота': '3 см',
      'Размеры': 'Ø15×3 см',
      'Вес': '320г',
      'Стиль': 'Винтаж',
      'Покрытие': 'Антикоррозийное',
      'Подходит для': 'Свечей любого размера',
      'Термостойкость': 'До 200°C'
    }
  }
];

// Генерируем товары из матрицы ароматов и форматов
const generateFragranceProducts = (): Product[] => {
  const products: Product[] = [];
  
  fragrances.forEach(fragrance => {
    fragrance.availableFormats.forEach(formatId => {
      const format = formats.find(f => f.id === formatId);
      if (format) {
        const product = generateProductFromFragranceFormat(fragrance, format);
        products.push(product);
      }
    });
  });
  
  return products;
};

// Объединяем базовые товары с товарами из матрицы
export const realProducts: Product[] = [
  ...baseProducts,
  ...generateFragranceProducts()
];

// Функция для получения товаров по категории
export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return realProducts;
  return realProducts.filter(product => product.category === category);
};

// Функция для поиска товаров
export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return realProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Функция для получения товара по ID
export const getProductById = (id: string): Product | undefined => {
  return realProducts.find(product => product.id === id);
};

// Статистика каталога
export const getCatalogStats = () => {
  const stats = {
    total: realProducts.length,
    byCategory: {
      books: realProducts.filter(p => p.category === 'books').length,
      candles: realProducts.filter(p => p.category === 'candles').length,
      sachets: realProducts.filter(p => p.category === 'sachets').length,
      baskets: realProducts.filter(p => p.category === 'baskets').length,
    },
    inStock: realProducts.filter(p => p.inStock).length,
    averagePrice: Math.round(realProducts.reduce((sum, p) => sum + p.price, 0) / realProducts.length),
    averageRating: (realProducts.reduce((sum, p) => sum + p.rating, 0) / realProducts.length).toFixed(1)
  };
  return stats;
};