import React, { useState, useMemo } from 'react';
import { Plus, Minus, ShoppingCart, Sparkles, Gift, X, Check, Filter, Layers, BookOpen, Home, Settings } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { showNotification } from '../utils/notification';
import { Product } from '../utils/types';
import { useCart } from '../hooks/useCart';
import { fragrances, formats, getFragranceById, getFormatById, generateProductFromFragranceFormat } from '../data/fragrances';

interface SetItem {
  product: Product;
  quantity: number;
}

interface ReadySet {
  id: string;
  name: string;
  description: string;
  image: string;
  items: { 
    type: 'fixed' | 'fragrance-choice' | 'product-choice';
    productId?: string; 
    fragranceType?: 'candle' | 'sachet';
    format?: string;
    productCategory?: string;
    availableProductIds?: string[];
    quantity: number;
    name: string;
  }[];
  originalPrice: number;
  discountPrice: number;
  tags: string[];
}

interface SelectedFragrances {
  [setId: string]: {
    [itemIndex: number]: string; // fragrance ID or product ID
  };
}

const readySets: ReadySet[] = [
  // 1. Набор "Мини-аромат" (2 элемента: Свеча, Саше) - Низкая цена
  {
    id: 'mini-aroma-set',
    name: 'Набор "Мини-аромат"',
    description: 'Идеальный старт для создания уютной атмосферы с вашим любимым ароматом.',
    image: 'https://images.pexels.com/photos/6454579/pexels-photo-6454579.jpeg?auto=compress&cs=tinysrgb&w=800',
    items: [
      { type: 'fragrance-choice', fragranceType: 'candle', format: 'candle-glass-100', quantity: 1, name: 'Свеча в стекле 100мл' },
      { type: 'fragrance-choice', fragranceType: 'sachet', format: 'sachet-clouds', quantity: 1, name: 'Саше "Облачка"' }
    ],
    originalPrice: 1150 + 380, // 1530
    discountPrice: 1350,
    tags: ['мини', 'аромат', 'свеча', 'саше', 'подарок']
  },
  // 2. Набор "Аромат и чтение" (3 элемента: Свеча, Саше, Книга) - Средняя цена
  {
    id: 'aroma-reading-set',
    name: 'Набор "Аромат и чтение"',
    description: 'Сочетание приятного аромата и вдохновляющей книги для расслабляющих вечеров.',
    image: 'https://images.pexels.com/photos/4866041/pexels-photo-4866041.jpeg?auto=compress&cs=tinysrgb&w=800',
    items: [
      { type: 'fragrance-choice', fragranceType: 'candle', format: 'candle-glass-190', quantity: 1, name: 'Свеча в стекле 190мл' },
      { type: 'fragrance-choice', fragranceType: 'sachet', format: 'sachet-hearts', quantity: 1, name: 'Саше "Сердечки"' },
      { type: 'product-choice', productCategory: 'books', availableProductIds: ['book-001', 'book-002', 'book-003'], quantity: 1, name: 'Книга на выбор' }
    ],
    originalPrice: 1490 + 450 + 750, // 2690
    discountPrice: 2390,
    tags: ['чтение', 'релакс', 'книга', 'свеча', 'саше']
  },
  // 3. Набор "Двойной уют" (4 элемента: 2 Свечи, Саше, Подставка) - Выше средней
  {
    id: 'double-cozy-set',
    name: 'Набор "Двойной уют"',
    description: 'Удвойте уют с двумя ароматными свечами, саше и стильной подставкой.',
    image: 'https://images.pexels.com/photos/8413058/pexels-photo-8413058.jpeg?auto=compress&cs=tinysrgb&w=800',
    items: [
      { type: 'fragrance-choice', fragranceType: 'candle', format: 'candle-glass-100', quantity: 2, name: 'Свеча в стекле 100мл' }, // 2 шт
      { type: 'fragrance-choice', fragranceType: 'sachet', format: 'sachet-florence', quantity: 1, name: 'Саше флорентийское' },
      { type: 'product-choice', productCategory: 'baskets', availableProductIds: ['stand-001', 'stand-002'], quantity: 1, name: 'Подставка на выбор' }
    ],
    originalPrice: (2 * 1150) + 620 + 890, // 2300 + 620 + 890 = 3810
    discountPrice: 3490,
    tags: ['уют', 'свечи', 'саше', 'подставка', 'подарок']
  },
  // 4. Набор "Полный порядок" (4 элемента: Свеча, 2 Саше, Книга, Органайзер) - Высокая цена
  {
    id: 'full-order-set',
    name: 'Набор "Полный порядок"',
    description: 'Комплексное решение для организации пространства и создания приятной атмосферы.',
    image: 'https://images.pexels.com/photos/6436293/pexels-photo-6436293.jpeg?auto=compress&cs=tinysrgb&w=800',
    items: [
      { type: 'fragrance-choice', fragranceType: 'candle', format: 'jar-iron-120', quantity: 1, name: 'Свеча в железной баночке 120мл' },
      { type: 'fragrance-choice', fragranceType: 'sachet', format: 'sachet-clouds', quantity: 2, name: 'Саше "Облачка"' }, // 2 шт
      { type: 'fixed', productId: 'book-001', quantity: 1, name: 'Книга "Фруктово-ягодная азбука"' },
      { type: 'fixed', productId: 'basket-003', quantity: 1, name: 'Органайзер для косметики' }
    ],
    originalPrice: 1290 + (2 * 380) + 890 + 1450, // 1290 + 760 + 890 + 1450 = 4390
    discountPrice: 3990,
    tags: ['организация', 'порядок', 'свеча', 'саше', 'книга', 'органайзер']
  },
  // 5. Набор "Премиум гармония" (6 элементов: 2 Свечи, 2 Саше, 2 Книги, Большая корзина) - Максимальная цена
  {
    id: 'premium-harmony-set',
    name: 'Набор "Премиум гармония"',
    description: 'Изысканный набор для создания идеальной гармонии и порядка в вашем доме.',
    image: 'https://images.pexels.com/photos/4792488/pexels-photo-4792488.jpeg?auto=compress&cs=tinysrgb&w=800',
    items: [
      { type: 'fragrance-choice', fragranceType: 'candle', format: 'candle-glass-190', quantity: 2, name: 'Свеча в стекле 190мл' }, // 2 шт
      { type: 'fragrance-choice', fragranceType: 'sachet', format: 'sachet-florence', quantity: 2, name: 'Саше флорентийское' }, // 2 шт
      { type: 'fixed', productId: 'book-001', quantity: 1, name: 'Книга "Фруктово-ягодная азбука"' },
      { type: 'fixed', productId: 'book-003', quantity: 1, name: 'Книга "Дневник порядочной женщины"' },
      { type: 'fixed', productId: 'basket-001', quantity: 1, name: 'Плетеная корзина из ротанга большая' }
    ],
    originalPrice: (2 * 1490) + (2 * 620) + 890 + 820 + 2890, // 2980 + 1240 + 890 + 820 + 2890 = 8820
    discountPrice: 7990,
    tags: ['премиум', 'гармония', 'подарок', 'свечи', 'саше', 'книги', 'корзина']
  }
];

export const Constructor: React.FC = () => {
  const [customSet, setCustomSet] = useState<SetItem[]>([]);
  const [showReadySets, setShowReadySets] = useState(true);
  const [selectedFragrances, setSelectedFragrances] = useState<SelectedFragrances>({});
  
  // Состояния для модального окна конфигурации готовых наборов
  const [configuringSet, setConfiguringSet] = useState<ReadySet | null>(null);
  const [tempConfiguredItems, setTempConfiguredItems] = useState<SetItem[]>([]);
  const [tempConfiguredSelectedFragrances, setTempConfiguredSelectedFragrances] = useState<SelectedFragrances>({});
  
  // Состояния для добавления новых товаров в настраиваемый набор
  const [selectedCategoryToAdd, setSelectedCategoryToAdd] = useState<string>('all');
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<Product | null>(null);
  const [selectedFragranceToAdd, setSelectedFragranceToAdd] = useState<Fragrance | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);
  
  // Состояния для пошагового выбора в "Создай свой"
  const [selectedItemCategory, setSelectedItemCategory] = useState<string>('');
  const [selectedItemFormat, setSelectedItemFormat] = useState<string>('');
  const [selectedItemProduct, setSelectedItemProduct] = useState<string>('');
  const [selectedItemFragrance, setSelectedItemFragrance] = useState<string>('');
  const [selectedItemQuantity, setSelectedItemQuantity] = useState<number>(1);
  
  // Состояния для добавления товаров в модальном окне конфигурации
  const [modalSelectedCategory, setModalSelectedCategory] = useState<string>('');
  const [modalSelectedFormat, setModalSelectedFormat] = useState<string>('');
  const [modalSelectedProduct, setModalSelectedProduct] = useState<string>('');
  const [modalSelectedFragrance, setModalSelectedFragrance] = useState<string>('');
  const [modalSelectedQuantity, setModalSelectedQuantity] = useState<number>(1);
  
  const { addToCart } = useCart();

  const selectFragranceForSet = (setId: string, itemIndex: number, fragranceId: string) => {
    setSelectedFragrances(prev => ({
      ...prev,
      [setId]: {
        ...prev[setId],
        [itemIndex]: fragranceId
      }
    }));
  };

  const selectProductForSet = (setId: string, itemIndex: number, productId: string) => {
    setSelectedFragrances(prev => ({
      ...prev,
      [setId]: {
        ...prev[setId],
        [itemIndex]: productId
      }
    }));
  };

  const isSetReadyToAdd = (set: ReadySet) => {
    return set.items.every((item, index) => {
      if (item.type === 'fragrance-choice' || item.type === 'product-choice') {
        return selectedFragrances[set.id]?.[index];
      }
      return true; // Fixed items are always ready
    });
  };

  // Функции для модального окна конфигурации
  const handleOpenConfigureModal = (set: ReadySet) => {
    setConfiguringSet(set);
    
    // Инициализируем временные элементы на основе текущего состава набора
    const newTempItems: SetItem[] = [];
    const currentChoices = selectedFragrances[set.id] || {};
    
    set.items.forEach((item, index) => {
      let productToAdd: Product | null = null;

      if (item.type === 'fixed') {
        productToAdd = products.find(p => p.id === item.productId) || null;
      } else if (item.type === 'fragrance-choice') {
        const selectedFragranceId = currentChoices[index];
        if (selectedFragranceId && item.format) {
          const fragrance = getFragranceById(selectedFragranceId);
          const format = getFormatById(item.format);
          if (fragrance && format) {
            productToAdd = generateProductFromFragranceFormat(fragrance, format);
          }
        }
      } else if (item.type === 'product-choice') {
        const selectedProductId = currentChoices[index];
        if (selectedProductId) {
          productToAdd = products.find(p => p.id === selectedProductId) || null;
        }
      }

      if (productToAdd) {
        newTempItems.push({ product: productToAdd, quantity: item.quantity });
      }
    });
    
    setTempConfiguredItems(newTempItems);
    setTempConfiguredSelectedFragrances({ [set.id]: currentChoices });
  };

  const handleCloseConfigureModal = () => {
    setConfiguringSet(null);
    setTempConfiguredItems([]);
    setTempConfiguredSelectedFragrances({});
    // Сбрасываем состояния добавления товаров
    setSelectedCategoryToAdd('all');
    setSelectedProductToAdd(null);
    setSelectedFragranceToAdd(null);
    setQuantityToAdd(1);
    // Сбрасываем состояния модального окна
    setModalSelectedCategory('');
    setModalSelectedFormat('');
    setModalSelectedProduct('');
    setModalSelectedFragrance('');
    setModalSelectedQuantity(1);
  };

  // Функция для добавления нового товара в настраиваемый набор
  const handleAddItemToConfiguredSet = () => {
    if (!selectedProductToAdd) return;
    
    let productToAdd: Product;
    
    // Для ароматических товаров создаем продукт с выбранным ароматом
    if ((selectedProductToAdd.category === 'candles' || selectedProductToAdd.category === 'sachets') && selectedFragranceToAdd) {
      const format = formats.find(f => f.id === selectedProductToAdd.format);
      if (format) {
        productToAdd = generateProductFromFragranceFormat(selectedFragranceToAdd, format);
      } else {
        productToAdd = selectedProductToAdd;
      }
    } else {
      productToAdd = selectedProductToAdd;
    }
    
    // Добавляем товар в настраиваемый набор
    const newItem: SetItem = {
      product: productToAdd,
      quantity: quantityToAdd
    };
    
    setTempConfiguredItems(prev => [...prev, newItem]);
    
    // Сбрасываем форму для следующего добавления
    setSelectedCategoryToAdd('all');
    setSelectedProductToAdd(null);
    setSelectedFragranceToAdd(null);
    setQuantityToAdd(1);
    
    // Показываем уведомление
    showNotification(`✅ ${productToAdd.name} добавлен в набор`);
  };

  // Получаем товары для выбранной категории (для добавления в набор)
  const getProductsForCategoryToAdd = () => {
    if (selectedCategoryToAdd === 'all') return [];
    
    if (selectedCategoryToAdd === 'candles' || selectedCategoryToAdd === 'sachets') {
      // Для ароматических товаров показываем форматы
      return formats
        .filter(format => 
          (selectedCategoryToAdd === 'candles' && (format.type === 'candle' || format.type === 'jar')) ||
          (selectedCategoryToAdd === 'sachets' && format.type === 'sachet')
        )
        .map(format => ({
          id: format.id,
          name: format.name,
          category: selectedCategoryToAdd as 'candles' | 'sachets',
          price: format.basePrice,
          format: format.id,
          description: format.description || '',
          image: 'https://images.pexels.com/photos/6454579/pexels-photo-6454579.jpeg?auto=compress&cs=tinysrgb&w=800',
          inStock: true,
          rating: 4.5,
          reviews: 0,
          tags: []
        } as Product));
    } else {
      // Для остальных категорий показываем обычные товары
      return products.filter(p => p.category === selectedCategoryToAdd);
    }
  };

  // Проверяем, нужен ли выбор аромата для добавляемого товара
  const needsFragranceSelection = () => {
    return selectedProductToAdd && 
           (selectedProductToAdd.category === 'candles' || selectedProductToAdd.category === 'sachets') &&
           selectedProductToAdd.format;
  };

  // Проверяем, можно ли добавить товар
  const canAddItem = () => {
    if (!selectedProductToAdd) return false;
    if (needsFragranceSelection() && !selectedFragranceToAdd) return false;
    return true;
  };

  const handleAddItemToTempConfiguredSet = (product: Product, quantity: number) => {
    setTempConfiguredItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleRemoveItemFromTempConfiguredSet = (productId: string) => {
    setTempConfiguredItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateTempConfiguredSetQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItemFromTempConfiguredSet(productId);
      return;
    }
    setTempConfiguredItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTempConfiguredSetTotal = () => {
    return tempConfiguredItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  // Получаем доступные форматы для выбранной категории в модальном окне
  const getModalAvailableFormats = () => {
    if (modalSelectedCategory === 'candles') {
      return formats.filter(f => f.type === 'candle' || f.type === 'jar');
    } else if (modalSelectedCategory === 'sachets') {
      return formats.filter(f => f.type === 'sachet');
    }
    return [];
  };

  // Получаем доступные товары для выбранной категории в модальном окне
  const getModalAvailableProducts = () => {
    if (modalSelectedCategory === 'books') {
      return products.filter(p => p.category === 'books');
    } else if (modalSelectedCategory === 'baskets') {
      return products.filter(p => p.category === 'baskets');
    }
    return [];
  };

  // Получаем доступные ароматы для выбранного формата в модальном окне
  const getModalAvailableFragrances = () => {
    if (modalSelectedFormat) {
      return fragrances.filter(f => f.availableFormats.includes(modalSelectedFormat));
    }
    return [];
  };

  // Проверяем, готов ли элемент к добавлению в модальном окне
  const isModalItemReadyToAdd = () => {
    if (!modalSelectedCategory || modalSelectedQuantity < 1) return false;
    
    if (modalSelectedCategory === 'candles' || modalSelectedCategory === 'sachets') {
      return modalSelectedFormat && modalSelectedFragrance;
    } else if (modalSelectedCategory === 'books' || modalSelectedCategory === 'baskets') {
      return modalSelectedProduct;
    }
    
    return false;
  };

  // Добавляем элемент в временный набор в модальном окне
  const addModalItemToTempSet = () => {
    if (!isModalItemReadyToAdd()) return;

    let productToAdd: Product | null = null;

    if (modalSelectedCategory === 'candles' || modalSelectedCategory === 'sachets') {
      const fragrance = getFragranceById(modalSelectedFragrance);
      const format = getFormatById(modalSelectedFormat);
      if (fragrance && format) {
        productToAdd = generateProductFromFragranceFormat(fragrance, format);
      }
    } else if (modalSelectedCategory === 'books' || modalSelectedCategory === 'baskets') {
      productToAdd = products.find(p => p.id === modalSelectedProduct) || null;
    }

    if (productToAdd) {
      handleAddItemToTempConfiguredSet(productToAdd, modalSelectedQuantity);
      
      // Сбрасываем выбор в модальном окне
      setModalSelectedCategory('');
      setModalSelectedFormat('');
      setModalSelectedProduct('');
      setModalSelectedFragrance('');
      setModalSelectedQuantity(1);
    }
  };

  const addTempConfiguredSetToCart = () => {
    if (tempConfiguredItems.length === 0) return;
    
    // Создаем виртуальный товар для настроенного набора
    const virtualProduct: Product = {
      id: `configured-set-${Date.now()}`,
      name: `${configuringSet?.name} (настроенный)`,
      category: 'baskets',
      price: getTempConfiguredSetTotal(),
      image: configuringSet?.image || 'https://images.pexels.com/photos/4792488/pexels-photo-4792488.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: `Настроенный набор из ${tempConfiguredItems.length} товаров: ${tempConfiguredItems.map(item => `${item.product.name} (${item.quantity} шт.)`).join(', ')}`,
      inStock: true,
      rating: 5.0,
      reviews: 0,
      tags: ['набор', 'настроенный', 'конструктор'],
      isCustomSet: true,
      customSetItems: tempConfiguredItems
    } as Product & { isCustomSet: boolean; customSetItems: SetItem[] };
    
    addToCart(virtualProduct);
    
    // Показываем уведомление
    const totalItems = tempConfiguredItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = getTempConfiguredSetTotal();
    
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #4a5a4a, #5d6f5d);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        z-index: 1000;
        font-family: system-ui;
        font-size: 15px;
        font-weight: 500;
        animation: slideIn 0.4s ease-out;
        max-width: 300px;
      ">
        ⚙️ ${configuringSet?.name} (настроенный) добавлен!
        <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
          ${totalItems} товаров на сумму ${totalPrice.toLocaleString()} ₽
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 4000);
    
    handleCloseConfigureModal();
  };

  // Получаем доступные форматы для выбранной категории
  const getAvailableFormats = () => {
    if (selectedItemCategory === 'candles') {
      return formats.filter(f => f.type === 'candle' || f.type === 'jar');
    } else if (selectedItemCategory === 'sachets') {
      return formats.filter(f => f.type === 'sachet');
    }
    return [];
  };

  // Получаем доступные товары для выбранной категории
  const getAvailableProducts = () => {
    if (selectedItemCategory === 'books') {
      return products.filter(p => p.category === 'books');
    } else if (selectedItemCategory === 'baskets') {
      return products.filter(p => p.category === 'baskets');
    }
    return [];
  };

  // Получаем доступные ароматы для выбранного формата
  const getAvailableFragrances = () => {
    if (selectedItemFormat) {
      return fragrances.filter(f => f.availableFormats.includes(selectedItemFormat));
    }
    return [];
  };

  // Проверяем, готов ли элемент к добавлению
  const isItemReadyToAdd = () => {
    if (!selectedItemCategory || selectedItemQuantity < 1) return false;
    
    if (selectedItemCategory === 'candles' || selectedItemCategory === 'sachets') {
      return selectedItemFormat && selectedItemFragrance;
    } else if (selectedItemCategory === 'books' || selectedItemCategory === 'baskets') {
      return selectedItemProduct;
    }
    
    return false;
  };

  // Добавляем элемент в пользовательский набор
  const addItemToCustomSet = () => {
    if (!isItemReadyToAdd()) return;

    let productToAdd: Product | null = null;

    if (selectedItemCategory === 'candles' || selectedItemCategory === 'sachets') {
      const fragrance = getFragranceById(selectedItemFragrance);
      const format = getFormatById(selectedItemFormat);
      if (fragrance && format) {
        productToAdd = generateProductFromFragranceFormat(fragrance, format);
      }
    } else if (selectedItemCategory === 'books' || selectedItemCategory === 'baskets') {
      productToAdd = products.find(p => p.id === selectedItemProduct) || null;
    }

    if (productToAdd) {
      addToCustomSet(productToAdd, selectedItemQuantity);
      
      // Сбрасываем выбор
      setSelectedItemCategory('');
      setSelectedItemFormat('');
      setSelectedItemProduct('');
      setSelectedItemFragrance('');
      setSelectedItemQuantity(1);
    }
  };

  const addToCustomSet = (product: Product, quantityToAdd: number = 1) => {
    setCustomSet(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prev, { product, quantity: quantityToAdd }];
    });
  };

  const removeFromCustomSet = (productId: string) => {
    setCustomSet(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCustomSetQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCustomSet(productId);
      return;
    }
    setCustomSet(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getCustomSetTotal = () => {
    return customSet.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const addCustomSetToCart = () => {
    console.log('🛠️ Adding custom set to cart:', customSet);
    
    if (customSet.length === 0) {
      console.warn('⚠️ Custom set is empty, nothing to add');
      return;
    }
    
    // Создаем виртуальный товар для набора
    const virtualProduct: Product = {
      id: `custom-set-${Date.now()}`,
      name: 'Мой уникальный набор',
      category: 'baskets', // Используем существующую категорию
      price: getCustomSetTotal(),
      image: customSet[0]?.product.image || 'https://images.pexels.com/photos/4792488/pexels-photo-4792488.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: `Персональный набор из ${customSet.length} товаров: ${customSet.map(item => `${item.product.name} (${item.quantity} шт.)`).join(', ')}`,
      inStock: true,
      rating: 5.0,
      reviews: 0,
      tags: ['набор', 'персональный', 'конструктор'],
      isCustomSet: true,
      customSetItems: customSet
    } as Product & { isCustomSet: boolean; customSetItems: SetItem[] };
    
    addToCart(virtualProduct);
    
    // Показываем уведомление
    const totalItems = customSet.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = getCustomSetTotal();
    
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #4a5a4a, #5d6f5d);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        z-index: 1000;
        font-family: system-ui;
        font-size: 15px;
        font-weight: 500;
        animation: slideIn 0.4s ease-out;
        max-width: 300px;
      ">
        🛠️ Персональный набор добавлен!
        <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
          ${totalItems} товаров на сумму ${totalPrice.toLocaleString()} ₽
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 4000);
    
    setCustomSet([]);
  };

  const addReadySetToCart = (set: ReadySet) => {
    console.log('🎁 Adding ready set to cart:', set.name, 'items:', set.items);
    let totalItemsAdded = 0;
    let foundProducts = 0;
    
    set.items.forEach((item, index) => {
      let productToAdd: Product | null = null;

      if (item.type === 'fixed') {
        productToAdd = products.find(p => p.id === item.productId) || null;
      } else if (item.type === 'fragrance-choice') {
        const selectedFragranceId = selectedFragrances[set.id]?.[index];
        if (selectedFragranceId && item.format) {
          const fragrance = getFragranceById(selectedFragranceId);
          const format = getFormatById(item.format);
          if (fragrance && format) {
            productToAdd = generateProductFromFragranceFormat(fragrance, format);
          }
        }
      } else if (item.type === 'product-choice') {
        const selectedProductId = selectedFragrances[set.id]?.[index];
        if (selectedProductId) {
          productToAdd = products.find(p => p.id === selectedProductId) || null;
        }
      }

      if (productToAdd) {
        foundProducts++;
        console.log('📦 Found product:', productToAdd.name, 'adding quantity:', item.quantity);
        for (let i = 0; i < item.quantity; i++) {
          console.log(`🛒 Adding ${productToAdd.name} (${i + 1}/${item.quantity})`);
          addToCart(productToAdd);
          totalItemsAdded++;
        }
      } else {
        console.error('❌ Product not found for item:', item);
      }
    });
    
    console.log(`✅ Found ${foundProducts}/${set.items.length} products, added ${totalItemsAdded} items to cart`);
    
    if (totalItemsAdded === 0) {
      console.error('❌ No items were added to cart!');
      return;
    }
    
    // Показываем уведомление
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #4a5a4a, #5d6f5d);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        z-index: 1000;
        font-family: system-ui;
        font-size: 15px;
        font-weight: 500;
        animation: slideIn 0.4s ease-out;
        max-width: 300px;
      ">
        🎁 ${set.name} добавлен в корзину!
        <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
          ${set.items.length} товаров на сумму ${set.discountPrice.toLocaleString()} ₽
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-sage-600 mr-3" />
              <h1 className="text-4xl font-bold text-sage-800">Конструктор наборов</h1>
            </div>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto mb-8">
              Создайте персональный набор ароматов или выберите готовое решение
            </p>
            
            {/* Toggle buttons */}
            <div className="flex justify-center">
              <div className="bg-sage-100 p-1 rounded-lg">
                <button
                  onClick={() => setShowReadySets(true)}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    showReadySets 
                      ? 'bg-white text-sage-700 shadow-sm' 
                      : 'text-sage-600 hover:text-sage-700'
                  }`}
                >
                  <Gift className="h-4 w-4 inline mr-2" />
                  Готовые наборы
                </button>
                <button
                  onClick={() => setShowReadySets(false)}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    !showReadySets 
                      ? 'bg-white text-sage-700 shadow-sm' 
                      : 'text-sage-600 hover:text-sage-700'
                  }`}
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Создать свой
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showReadySets ? (
          /* Ready Sets */
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-sage-800 mb-4">Готовые наборы</h2>
              <p className="text-sage-600">
                Тщательно подобранные комплекты для разных потребностей
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {readySets.map((set) => (
                <div key={set.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={set.image}
                      alt={set.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      -{Math.round((1 - set.discountPrice / set.originalPrice) * 100)}%
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-sage-800 mb-2">
                      {set.name}
                    </h3>
                    <p className="text-sage-600 mb-4 text-sm leading-relaxed">
                      {set.description}
                    </p>

                    {/* Items in set */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-sage-700 mb-2">В наборе:</h4>
                      <div className="space-y-2">
                        {set.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.type === 'fixed' ? (
                              <div className="flex items-center text-sage-600">
                                <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                {item.name} {item.quantity > 1 && `(${item.quantity} шт.)`}
                              </div>
                            ) : item.type === 'fragrance-choice' ? (
                              <div className="border border-sage-200 rounded-lg p-3 bg-sage-50">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-sage-700">
                                    {item.name} {item.quantity > 1 && `(${item.quantity} шт.)`}
                                  </span>
                                  <span className="text-xs text-sage-500">Выберите аромат</span>
                                </div>
                                
                                <select
                                  value={selectedFragrances[set.id]?.[index] || ''}
                                  onChange={(e) => selectFragranceForSet(set.id, index, e.target.value)}
                                  className="w-full text-xs p-2 border border-sage-300 rounded focus:outline-none focus:ring-1 focus:ring-sage-500"
                                >
                                  <option value="">-- Выберите аромат --</option>
                                  {fragrances.filter(f => f.availableFormats.includes(item.format!)).map((fragrance) => (
                                    <option key={fragrance.id} value={fragrance.id}>
                                      {fragrance.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : item.type === 'product-choice' ? (
                              <div className="border border-sage-200 rounded-lg p-3 bg-sage-50">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-sage-700">
                                    {item.name} {item.quantity > 1 && `(${item.quantity} шт.)`}
                                  </span>
                                  <span className="text-xs text-sage-500">Выберите товар</span>
                                </div>
                                
                                <select
                                  value={selectedFragrances[set.id]?.[index] || ''}
                                  onChange={(e) => selectProductForSet(set.id, index, e.target.value)}
                                  className="w-full text-xs p-2 border border-sage-300 rounded focus:outline-none focus:ring-1 focus:ring-sage-500"
                                >
                                  <option value="">-- Выберите {item.productCategory === 'books' ? 'книгу' : 'товар'} --</option>
                                  {item.availableProductIds?.map((productId) => {
                                    const product = products.find(p => p.id === productId);
                                    return product ? (
                                      <option key={product.id} value={product.id}>
                                        {product.name} - {product.price.toLocaleString()} ₽
                                      </option>
                                    ) : null;
                                  })}
                                </select>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {set.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-sage-100 text-sage-600 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-sm text-sage-500 line-through mr-2">
                          {set.originalPrice.toLocaleString()} ₽
                        </span>
                        <span className="text-xl font-bold text-sage-800">
                          {set.discountPrice.toLocaleString()} ₽
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => addReadySetToCart(set)}
                        disabled={!isSetReadyToAdd(set)}
                        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                          isSetReadyToAdd(set)
                            ? 'bg-sage-600 text-white hover:bg-sage-700 transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isSetReadyToAdd(set) ? 'Добавить в корзину' : 'Сделайте выбор'}
                      </button>
                      
                      <button
                        onClick={() => handleOpenConfigureModal(set)}
                        className="w-full py-2 rounded-lg font-medium flex items-center justify-center border border-sage-600 text-sage-600 hover:bg-sage-50 transition-all duration-300"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Настроить набор
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Custom Set Builder */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Item Selection */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-sage-800 mb-4">
                  Создайте свой набор
                </h2>
                <p className="text-sage-600 mb-6">
                  Выберите товары и их количество для создания персонального набора
                </p>
              </div>

              {/* Step-by-step Selection */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-sage-800 mb-4">
                  Добавить товар в набор
                </h3>

                <div className="space-y-4 mb-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      1. Выберите категорию
                    </label>
                    <select
                      value={selectedItemCategory}
                      onChange={(e) => {
                        setSelectedItemCategory(e.target.value);
                        setSelectedItemFormat('');
                        setSelectedItemProduct('');
                        setSelectedItemFragrance('');
                      }}
                      className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                    >
                      <option value="">-- Выберите категорию --</option>
                      <option value="candles">🕯️ Свечи</option>
                      <option value="sachets">🌿 Саше</option>
                      <option value="books">📚 Книги</option>
                      <option value="baskets">🧺 Корзины и подставки</option>
                    </select>
                  </div>

                  {/* Format/Product Selection */}
                  {selectedItemCategory && (
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        2. Выберите {selectedItemCategory === 'candles' || selectedItemCategory === 'sachets' ? 'формат' : 'товар'}
                      </label>
                      {selectedItemCategory === 'candles' || selectedItemCategory === 'sachets' ? (
                        <select
                          value={selectedItemFormat}
                          onChange={(e) => {
                            setSelectedItemFormat(e.target.value);
                            setSelectedItemFragrance('');
                          }}
                          className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                        >
                          <option value="">-- Выберите формат --</option>
                          {getAvailableFormats().map((format) => (
                            <option key={format.id} value={format.id}>
                              {format.name} - {format.basePrice.toLocaleString()} ₽
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={selectedItemProduct}
                          onChange={(e) => setSelectedItemProduct(e.target.value)}
                          className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                        >
                          <option value="">-- Выберите товар --</option>
                          {getAvailableProducts().map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - {product.price.toLocaleString()} ₽
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {/* Fragrance Selection */}
                  {(selectedItemCategory === 'candles' || selectedItemCategory === 'sachets') && selectedItemFormat && (
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        3. Выберите аромат
                      </label>
                      <select
                        value={selectedItemFragrance}
                        onChange={(e) => setSelectedItemFragrance(e.target.value)}
                        className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                      >
                        <option value="">-- Выберите аромат --</option>
                        {getAvailableFragrances().map((fragrance) => (
                          <option key={fragrance.id} value={fragrance.id}>
                            {fragrance.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Quantity Selection */}
                  {selectedItemCategory && (
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        {(selectedItemCategory === 'candles' || selectedItemCategory === 'sachets') ? '4.' : '3.'} Количество
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setSelectedItemQuantity(Math.max(1, selectedItemQuantity - 1))}
                          className="w-8 h-8 rounded-full border border-sage-300 flex items-center justify-center hover:bg-sage-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{selectedItemQuantity}</span>
                        <button
                          onClick={() => setSelectedItemQuantity(selectedItemQuantity + 1)}
                          className="w-8 h-8 rounded-full border border-sage-300 flex items-center justify-center hover:bg-sage-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Add Button */}
                <button
                  onClick={addItemToCustomSet}
                  disabled={!isItemReadyToAdd()}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                    isItemReadyToAdd()
                      ? 'bg-sage-600 text-white hover:bg-sage-700 transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить в набор
                </button>
              </div>
            </div>

            {/* Custom Set Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
                <h3 className="text-lg font-semibold text-sage-800 mb-4">
                  Ваш набор
                </h3>

                {customSet.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <Gift className="h-16 w-16 text-sage-300 mb-4" />
                      <h4 className="text-lg font-medium text-sage-700 mb-2">Ваш набор пуст</h4>
                      <p className="text-sage-500 text-sm text-center leading-relaxed">
                        Выберите товары для создания<br />персонального набора
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {customSet.map((item) => (
                        <div key={item.product.id} className="flex items-center space-x-3 p-3 bg-sage-50 rounded-lg">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-sage-800 truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-sage-600">
                              {item.product.price.toLocaleString()} ₽
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCustomSetQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-sage-600 hover:text-sage-700"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCustomSetQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-sage-600 hover:text-sage-700"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => removeFromCustomSet(item.product.id)}
                              className="p-1 text-red-500 hover:text-red-600 ml-2"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-sage-200 pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-sage-800">Итого:</span>
                        <span className="text-xl font-bold text-sage-800">
                          {getCustomSetTotal().toLocaleString()} ₽
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={addCustomSetToCart}
                      className="w-full bg-sage-600 text-white py-3 rounded-lg hover:bg-sage-700 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Добавить в корзину
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ready Set Configuration Modal */}
      {configuringSet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-sage-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{configuringSet.name}</h2>
                  <p className="text-sage-100 mt-1">Настройте состав набора под ваши потребности</p>
                </div>
                <button
                  onClick={handleCloseConfigureModal}
                  className="p-2 hover:bg-sage-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Items */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-sage-800 mb-4">
                    Текущий состав набора
                  </h3>

                  {tempConfiguredItems.length === 0 ? (
                    <div className="text-center py-8 bg-sage-50 rounded-lg">
                      <Gift className="h-12 w-12 text-sage-300 mx-auto mb-4" />
                      <p className="text-sage-600">Добавьте товары в набор</p>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-8">
                      {tempConfiguredItems.map((item) => (
                        <div key={item.product.id} className="flex items-center space-x-3 p-4 bg-sage-50 rounded-lg">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sage-800">
                              {item.product.name}
                            </h4>
                            <p className="text-sage-600">
                              {item.product.price.toLocaleString()} ₽
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateTempConfiguredSetQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-sage-600 hover:text-sage-700"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateTempConfiguredSetQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-sage-600 hover:text-sage-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveItemFromTempConfiguredSet(item.product.id)}
                              className="p-1 text-red-500 hover:text-red-600 ml-2"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Секция добавления новых товаров */}
                  <div className="border-t border-sage-200 pt-6">
                    <h4 className="font-semibold text-sage-800 mb-4">Добавить товары в набор</h4>
                    
                    <div className="space-y-4">
                      {/* Выбор категории */}
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-2">
                          Категория
                        </label>
                        <select
                          value={selectedCategoryToAdd}
                          onChange={(e) => {
                            setSelectedCategoryToAdd(e.target.value);
                            setSelectedProductToAdd(null);
                            setSelectedFragranceToAdd(null);
                          }}
                          className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                        >
                          <option value="all">-- Выберите категорию --</option>
                          <option value="candles">🕯️ Свечи</option>
                          <option value="sachets">🌿 Саше</option>
                          <option value="books">📚 Книги</option>
                          <option value="baskets">🧺 Корзины</option>
                        </select>
                      </div>
                      
                      {/* Выбор товара/формата */}
                      {selectedCategoryToAdd !== 'all' && (
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            {selectedCategoryToAdd === 'candles' || selectedCategoryToAdd === 'sachets' ? 'Формат' : 'Товар'}
                          </label>
                          <select
                            value={selectedProductToAdd?.id || ''}
                            onChange={(e) => {
                              const product = getProductsForCategoryToAdd().find(p => p.id === e.target.value);
                              setSelectedProductToAdd(product || null);
                              setSelectedFragranceToAdd(null);
                            }}
                            className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                          >
                            <option value="">-- Выберите {selectedCategoryToAdd === 'candles' || selectedCategoryToAdd === 'sachets' ? 'формат' : 'товар'} --</option>
                            {getProductsForCategoryToAdd().map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name} - {product.price.toLocaleString()} ₽
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      {/* Выбор аромата (только для ароматических товаров) */}
                      {needsFragranceSelection() && (
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            Аромат
                          </label>
                          <select
                            value={selectedFragranceToAdd?.id || ''}
                            onChange={(e) => {
                              const fragrance = fragrances.find(f => f.id === e.target.value);
                              setSelectedFragranceToAdd(fragrance || null);
                            }}
                            className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                          >
                            <option value="">-- Выберите аромат --</option>
                            {fragrances
                              .filter(fragrance => selectedProductToAdd?.format && fragrance.availableFormats.includes(selectedProductToAdd.format))
                              .map((fragrance) => (
                                <option key={fragrance.id} value={fragrance.id}>
                                  {fragrance.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                      
                      {/* Выбор количества */}
                      {selectedProductToAdd && (
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            Количество
                          </label>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))}
                              className="w-8 h-8 rounded-full border border-sage-300 flex items-center justify-center hover:bg-sage-50"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{quantityToAdd}</span>
                            <button
                              onClick={() => setQuantityToAdd(quantityToAdd + 1)}
                              className="w-8 h-8 rounded-full border border-sage-300 flex items-center justify-center hover:bg-sage-50"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Кнопка добавления товара */}
                      <button
                        onClick={handleAddItemToConfiguredSet}
                        disabled={!canAddItem()}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          canAddItem()
                            ? 'bg-sage-600 text-white hover:bg-sage-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Добавить товар в набор
                      </button>
                    </div>
                  </div>

                  {/* Add More Items */}
                  <div className="bg-white border border-sage-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-sage-800 mb-4">
                      Добавить товары
                    </h4>

                    <div className="space-y-4">
                      {/* Category Selection */}
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-2">
                          Категория
                        </label>
                        <select
                          value={modalSelectedCategory}
                          onChange={(e) => {
                            setModalSelectedCategory(e.target.value);
                            setModalSelectedFormat('');
                            setModalSelectedProduct('');
                            setModalSelectedFragrance('');
                          }}
                          className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                        >
                          <option value="">-- Выберите категорию --</option>
                          <option value="candles">🕯️ Свечи</option>
                          <option value="sachets">🌿 Саше</option>
                          <option value="books">📚 Книги</option>
                          <option value="baskets">🧺 Корзины и подставки</option>
                        </select>
                      </div>

                      {/* Format/Product Selection */}
                      {modalSelectedCategory && (
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            {modalSelectedCategory === 'candles' || modalSelectedCategory === 'sachets' ? 'Формат' : 'Товар'}
                          </label>
                          {modalSelectedCategory === 'candles' || modalSelectedCategory === 'sachets' ? (
                            <select
                              value={modalSelectedFormat}
                              onChange={(e) => {
                                setModalSelectedFormat(e.target.value);
                                setModalSelectedFragrance('');
                              }}
                              className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                            >
                              <option value="">-- Выберите формат --</option>
                              {getModalAvailableFormats().map((format) => (
                                <option key={format.id} value={format.id}>
                                  {format.name} - {format.basePrice.toLocaleString()} ₽
                                </option>
                              ))}
                            </select>
                          ) : (
                            <select
                              value={modalSelectedProduct}
                              onChange={(e) => setModalSelectedProduct(e.target.value)}
                              className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                            >
                              <option value="">-- Выберите товар --</option>
                              {getModalAvailableProducts().map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name} - {product.price.toLocaleString()} ₽
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}

                      {/* Fragrance Selection */}
                      {(modalSelectedCategory === 'candles' || modalSelectedCategory === 'sachets') && modalSelectedFormat && (
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            Аромат
                          </label>
                          <select
                            value={modalSelectedFragrance}
                            onChange={(e) => setModalSelectedFragrance(e.target.value)}
                            className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                          >
                            <option value="">-- Выберите аромат --</option>
                            {getModalAvailableFragrances().map((fragrance) => (
                              <option key={fragrance.id} value={fragrance.id}>
                                {fragrance.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Quantity Selection */}
                      {modalSelectedCategory && (
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            Количество
                          </label>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => setModalSelectedQuantity(Math.max(1, modalSelectedQuantity - 1))}
                              className="w-8 h-8 rounded-full border border-sage-300 flex items-center justify-center hover:bg-sage-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{modalSelectedQuantity}</span>
                            <button
                              onClick={() => setModalSelectedQuantity(modalSelectedQuantity + 1)}
                              className="w-8 h-8 rounded-full border border-sage-300 flex items-center justify-center hover:bg-sage-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Add Button */}
                      <button
                        onClick={addModalItemToTempSet}
                        disabled={!isModalItemReadyToAdd()}
                        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                          isModalItemReadyToAdd()
                            ? 'bg-sage-600 text-white hover:bg-sage-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить товар
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-sage-50 rounded-xl p-6 sticky top-0">
                    <h3 className="text-lg font-semibold text-sage-800 mb-4">
                      Итого
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-sage-600">Товаров:</span>
                        <span className="font-medium">{tempConfiguredItems.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Сумма:</span>
                        <span>{getTempConfiguredSetTotal().toLocaleString()} ₽</span>
                      </div>
                    </div>

                    <button
                      onClick={addTempConfiguredSetToCart}
                      disabled={tempConfiguredItems.length === 0}
                      className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                        tempConfiguredItems.length > 0
                          ? 'bg-sage-600 text-white hover:bg-sage-700 transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Добавить в корзину
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};