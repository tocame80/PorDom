import { Fragrance, Format } from '../utils/types';

// Форматы товаров
export const formats: Format[] = [
  // Саше
  {
    id: 'sachet-hearts',
    name: 'Саше "Сердечки"',
    type: 'sachet',
    size: '15г',
    description: 'Декоративные саше в форме сердечек',
    basePrice: 450
  },
  {
    id: 'sachet-clouds',
    name: 'Саше "Облачка"',
    type: 'sachet',
    size: '12г',
    description: 'Воздушные саше в форме облачков',
    basePrice: 380
  },
  {
    id: 'sachet-florence',
    name: 'Саше флорентийское',
    type: 'sachet',
    size: '18г',
    description: 'Премиум саше в флорентийском стиле',
    basePrice: 620
  },
  
  // Свечи
  {
    id: 'candle-glass-190',
    name: 'Свеча стекло 190мл',
    type: 'candle',
    size: '190мл',
    description: 'Большая свеча в стеклянном стакане',
    basePrice: 1490
  },
  {
    id: 'candle-glass-100',
    name: 'Свеча стекло 100мл',
    type: 'candle',
    size: '100мл',
    description: 'Компактная свеча в стеклянном стакане',
    basePrice: 1150
  },
  
  // Железные баночки
  {
    id: 'jar-iron-120',
    name: 'Железная баночка 120мл',
    type: 'jar',
    size: '120мл',
    description: 'Большая свеча в железной баночке',
    basePrice: 1290
  },
  {
    id: 'jar-iron-50',
    name: 'Железная баночка 50мл',
    type: 'jar',
    size: '50мл',
    description: 'Малая свеча в железной баночке',
    basePrice: 890
  }
];

// Ароматы
export const fragrances: Fragrance[] = [
  {
    id: 'ruby-grapefruit',
    name: 'Рубиновый грейпфрут',
    description: 'Яркий цитрусовый аромат с нотами рубинового грейпфрута',
    availableFormats: ['sachet-hearts', 'sachet-clouds', 'sachet-florence', 'candle-glass-190', 'candle-glass-100', 'jar-iron-120', 'jar-iron-50'],
    color: '#dc2626'
  },
  {
    id: 'mint-lemon',
    name: 'Мята & лимонный лист',
    description: 'Освежающий аромат мяты с лимонными нотами',
    availableFormats: ['sachet-hearts', 'sachet-clouds', 'sachet-florence', 'candle-glass-190', 'candle-glass-100', 'jar-iron-120', 'jar-iron-50'],
    color: '#16a34a'
  },
  {
    id: 'clean-cotton',
    name: 'Чистый хлопок',
    description: 'Нежный аромат свежего хлопка',
    availableFormats: ['sachet-hearts', 'sachet-clouds', 'sachet-florence', 'jar-iron-50'],
    color: '#f8fafc'
  },
  {
    id: 'prosecco-guava',
    name: 'Просекко & гуава',
    description: 'Праздничный аромат с нотами просекко и гуавы',
    availableFormats: ['candle-glass-190', 'candle-glass-100', 'jar-iron-120', 'jar-iron-50'],
    color: '#fbbf24'
  },
  {
    id: 'spicy-orange',
    name: 'Пряный апельсин',
    description: 'Теплый цитрусовый аромат с пряными нотами',
    availableFormats: ['sachet-hearts', 'sachet-clouds', 'sachet-florence', 'candle-glass-100', 'jar-iron-120', 'jar-iron-50'],
    color: '#ea580c'
  },
  {
    id: 'mango-mandarin',
    name: 'Манго & мандарин',
    description: 'Тропический фруктовый аромат',
    availableFormats: ['sachet-hearts', 'sachet-clouds', 'sachet-florence', 'candle-glass-100', 'jar-iron-120', 'jar-iron-50'],
    color: '#f59e0b'
  },
  {
    id: 'moss-fern',
    name: 'Мох & папоротник',
    description: 'Лесной земляной аромат',
    availableFormats: ['candle-glass-190', 'candle-glass-100', 'jar-iron-120', 'jar-iron-50'],
    color: '#15803d'
  },
  {
    id: 'northern-cranberry',
    name: 'Северная клюква',
    description: 'Ягодный зимний аромат',
    availableFormats: ['sachet-hearts', 'sachet-clouds', 'sachet-florence', 'jar-iron-120', 'jar-iron-50'],
    color: '#dc2626'
  },
  {
    id: 'pear-caramel',
    name: 'Груша в карамели',
    description: 'Сладкий десертный аромат',
    availableFormats: ['candle-glass-100', 'jar-iron-120', 'jar-iron-50'],
    color: '#d97706'
  },
  {
    id: 'sage-sea-salt',
    name: 'Шалфей & морская соль',
    description: 'Травяной минеральный аромат',
    availableFormats: ['sachet-hearts', 'sachet-clouds', 'sachet-florence', 'candle-glass-190', 'candle-glass-100', 'jar-iron-120', 'jar-iron-50'],
    color: '#059669'
  },
  {
    id: 'maple-pecan',
    name: 'Кленовый пекан',
    description: 'Ореховый осенний аромат',
    availableFormats: ['candle-glass-100', 'jar-iron-120', 'jar-iron-50'],
    color: '#92400e'
  },
  {
    id: 'pink-pepper-bergamot',
    name: 'Розовый перец & бергамот',
    description: 'Пряный цитрусовый аромат',
    availableFormats: ['sachet-hearts', 'sachet-clouds', 'sachet-florence', 'candle-glass-100', 'jar-iron-120', 'jar-iron-50'],
    color: '#ec4899'
  },
  {
    id: 'apricot-jam',
    name: 'Абрикосовый конфетюр',
    description: 'Фруктовый сладкий аромат',
    availableFormats: ['candle-glass-100', 'jar-iron-120', 'jar-iron-50'],
    color: '#f97316'
  },
  {
    id: 'cactus-aloe',
    name: 'Кактус & алоэ',
    description: 'Зеленый свежий аромат',
    availableFormats: ['sachet-hearts', 'sachet-clouds', 'sachet-florence', 'candle-glass-100', 'jar-iron-120', 'jar-iron-50'],
    color: '#10b981'
  }
];

// Функции для работы с ароматами и форматами
export const getFragranceById = (id: string): Fragrance | undefined => {
  return fragrances.find(f => f.id === id);
};

export const getFormatById = (id: string): Format | undefined => {
  return formats.find(f => f.id === id);
};

export const getAvailableFormatsForFragrance = (fragranceId: string): Format[] => {
  const fragrance = getFragranceById(fragranceId);
  if (!fragrance) return [];
  
  return formats.filter(format => fragrance.availableFormats.includes(format.id));
};

// Функция для генерации SEO-friendly URL
export const generateProductSlug = (fragrance: Fragrance, format: Format): string => {
  const fragranceName = fragrance.name.toLowerCase()
    .replace(/[^а-яё\s]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/ё/g, 'e');
  
  const formatName = format.name.toLowerCase()
    .replace(/[^а-яё\s]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/ё/g, 'e');
  
  return `${fragranceName}-${formatName}-${format.size}`;
};

// Функция для генерации времени горения свечей
const getBurningTime = (format: Format): string => {
  const burningTimes = {
    'candle-glass-190': 'до 45 часов',
    'candle-glass-100': 'до 25 часов', 
    'jar-iron-120': 'до 30 часов',
    'jar-iron-50': 'до 15 часов'
  };
  
  return burningTimes[format.id] || '';
};

// Функция для генерации состава
const getComposition = (format: Format): string => {
  if (format.type === 'sachet') {
    return 'Натуральные травы, эфирные масла';
  } else {
    return '100% соевый воск, хлопковый фитиль';
  }
};

// Функция для генерации размеров
const getDimensions = (format: Format): string => {
  const dimensions = {
    'sachet-hearts': '8×6 см',
    'sachet-clouds': '7×5 см', 
    'sachet-florence': '10×8 см',
    'candle-glass-190': 'Ø8×12 см',
    'candle-glass-100': 'Ø7×9 см',
    'jar-iron-120': 'Ø7×10 см',
    'jar-iron-50': 'Ø6×7 см'
  };
  
  return dimensions[format.id] || '';
};

// Функция для генерации веса
const getWeight = (format: Format): string => {
  const weights = {
    'sachet-hearts': '15г',
    'sachet-clouds': '12г',
    'sachet-florence': '18г', 
    'candle-glass-190': '320г',
    'candle-glass-100': '180г',
    'jar-iron-120': '220г',
    'jar-iron-50': '120г'
  };
  
  return weights[format.id] || format.size;
};

// Генерируем расширенные характеристики
const generateCharacteristics = (fragrance: Fragrance, format: Format) => {
  const baseCharacteristics = {
    'Аромат': fragrance.name,
    'Формат': format.name,
    'Размер': format.size,
    'Тип': format.type === 'sachet' ? 'Саше' : format.type === 'candle' ? 'Свеча' : 'Свеча в баночке',
    'Категория': categoryMap[format.type] === 'sachets' ? '🌿 Саше' : '🕯️ Свечи',
    'Состав': getComposition(format),
    'Размеры': getDimensions(format),
    'Вес': getWeight(format)
  };
  
  // Добавляем время горения для свечей
  if (format.type === 'candle' || format.type === 'jar') {
    const burningTime = getBurningTime(format);
    if (burningTime) {
      baseCharacteristics['Время горения'] = burningTime;
    }
    baseCharacteristics['Фитиль'] = 'Хлопковый';
  }
  
  return baseCharacteristics;
};

// Маппинг типов форматов к категориям
const categoryMap = {
  'sachet': 'sachets',
  'candle': 'candles',
  'jar': 'candles' // железные баночки тоже свечи
};

export const generateProductFromFragranceFormat = (fragrance: Fragrance, format: Format): any => {
  // Генерируем красивые названия
  const generateProductName = (fragrance: Fragrance, format: Format): string => {
    if (format.type === 'sachet') {
      const formatName = format.name.split(' ')[1] || format.size;
      return `Саше "${fragrance.name}" ${formatName}`;
    } else {
      if (format.type === 'candle') {
        return `Свеча "${fragrance.name}" ${format.size} (стекло)`;
      } else {
        return `Свеча "${fragrance.name}" ${format.size} (баночка)`;
      }
    }
  };

  // Генерируем расширенное описание с нотами аромата
  const generateEnhancedDescription = (fragrance: Fragrance, format: Format): string => {
    const aromaNotes = {
      'ruby-grapefruit': 'Верхние ноты: рубиновый грейпфрут, цедра. Средние ноты: белые цветы. Базовые ноты: мускус.',
      'mint-lemon': 'Верхние ноты: свежая мята, лимонный лист. Средние ноты: зеленые травы. Базовые ноты: древесные аккорды.',
      'clean-cotton': 'Верхние ноты: озон, морской бриз. Средние ноты: хлопок, лилия. Базовые ноты: мускус, кедр.',
      'prosecco-guava': 'Верхние ноты: игристое просекко, гуава. Средние ноты: персик, жасмин. Базовые ноты: ваниль, амбра.',
      'spicy-orange': 'Верхние ноты: пряный апельсин, корица. Средние ноты: гвоздика, мускатный орех. Базовые ноты: сандал, пачули.',
      'mango-mandarin': 'Верхние ноты: сочное манго, мандарин. Средние ноты: тропические фрукты. Базовые ноты: кокос, ваниль.',
      'moss-fern': 'Верхние ноты: зеленые листья, роса. Средние ноты: мох, папоротник. Базовые ноты: земля, древесина.',
      'northern-cranberry': 'Верхние ноты: северная клюква, брусника. Средние ноты: хвоя, можжевельник. Базовые ноты: амбра, мускус.',
      'pear-caramel': 'Верхние ноты: сочная груша, карамель. Средние ноты: ваниль, сливки. Базовые ноты: сахар, мускус.',
      'sage-sea-salt': 'Верхние ноты: морская соль, озон. Средние ноты: шалфей, эвкалипт. Базовые ноты: дрифтвуд, амбра.',
      'maple-pecan': 'Верхние ноты: кленовый сироп, пекан. Средние ноты: корица, мускатный орех. Базовые ноты: ваниль, карамель.',
      'pink-pepper-bergamot': 'Верхние ноты: розовый перец, бергамот. Средние ноты: кардамон, лаванда. Базовые ноты: кедр, мускус.',
      'apricot-jam': 'Верхние ноты: спелый абрикос, персик. Средние ноты: сахар, ваниль. Базовые ноты: карамель, мускус.',
      'cactus-aloe': 'Верхние ноты: кактус, алоэ. Средние ноты: зеленые листья, огурец. Базовые ноты: белый мускус, кедр.'
    };
    
    const notes = aromaNotes[fragrance.id] || '';
    const usageRecommendation = format.type === 'sachet' 
      ? 'Поместите в шкаф, ящик или автомобиль для длительного аромата.'
      : 'Зажигайте в хорошо проветриваемом помещении. Не оставляйте без присмотра.';
    
    return `${fragrance.description}. ${format.description}. ${notes} ${usageRecommendation}`;
  };
  // Генерируем русские теги
  const generateRussianTags = (fragrance: Fragrance, format: Format): string[] => {
    const fragranceTags = {
      'ruby-grapefruit': ['грейпфрут', 'цитрус', 'рубиновый'],
      'mint-lemon': ['мята', 'лимон', 'свежесть'],
      'clean-cotton': ['хлопок', 'чистота', 'свежесть'],
      'prosecco-guava': ['просекко', 'гуава', 'праздник'],
      'spicy-orange': ['апельсин', 'пряности', 'тепло'],
      'mango-mandarin': ['манго', 'мандарин', 'тропики'],
      'moss-fern': ['мох', 'папоротник', 'лес'],
      'northern-cranberry': ['клюква', 'ягоды', 'зима'],
      'pear-caramel': ['груша', 'карамель', 'сладость'],
      'sage-sea-salt': ['шалфей', 'морская соль', 'травы'],
      'maple-pecan': ['клен', 'пекан', 'орехи'],
      'pink-pepper-bergamot': ['розовый перец', 'бергамот', 'пряности'],
      'apricot-jam': ['абрикос', 'конфетюр', 'сладость'],
      'cactus-aloe': ['кактус', 'алоэ', 'зелень']
    };

    // Теги по типу формата
    const baseFormatTags = {
      'sachet': ['саше', 'ароматизатор'],
      'candle': ['свеча', 'уют'],
      'jar': ['свеча', 'уют']
    };

    // Специфичные теги по ID формата
    const specificFormatTags = {
      'sachet-hearts': ['сердечки'],
      'sachet-clouds': ['облачка'],
      'sachet-florence': ['флорентийское'],
    };

    // Собираем все теги
    const allTags = [
      ...(fragranceTags[fragrance.id] || []),
      ...(baseFormatTags[format.type] || []),
      ...(specificFormatTags[format.id] || [])
    ];

    // Возвращаем уникальные теги
    return [...new Set(allTags)];
  };
  return {
    id: `${fragrance.id}-${format.id}`,
    slug: generateProductSlug(fragrance, format),
    name: generateProductName(fragrance, format),
    category: categoryMap[format.type],
    price: format.basePrice,
    fragrance: fragrance.id,
    format: format.id,
    description: generateEnhancedDescription(fragrance, format),
    image: getImageForFragranceFormat(fragrance, format),
    inStock: true,
    rating: 4.5,
    reviews: Math.floor(Math.random() * 200) + 50,
    tags: generateRussianTags(fragrance, format),
    characteristics: generateCharacteristics(fragrance, format)
  };
};

// Функция для получения изображения в зависимости от аромата и формата
const getImageForFragranceFormat = (fragrance: Fragrance, format: Format): string => {
  const images = {
    'sachet': [
      'https://images.pexels.com/photos/5938596/pexels-photo-5938596.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7262774/pexels-photo-7262774.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'candle': [
      'https://images.pexels.com/photos/6454579/pexels-photo-6454579.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8413058/pexels-photo-8413058.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'jar': [
      'https://images.pexels.com/photos/6454579/pexels-photo-6454579.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8413058/pexels-photo-8413058.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
  };
  
  const typeImages = images[format.type];
  return typeImages[Math.floor(Math.random() * typeImages.length)];
};