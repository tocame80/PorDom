// API для работы с внешними источниками данных о товарах

export interface ExternalProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  inStock?: boolean;
  supplier?: string;
}

export interface PriceUpdate {
  productId: string;
  oldPrice: number;
  newPrice: number;
  timestamp: string;
}

export class CatalogAPI {
  private static baseURL = 'https://api.example.com'; // Замените на реальный API

  // Загрузка товаров от поставщика
  static async fetchProductsFromSupplier(supplierId: string): Promise<ExternalProduct[]> {
    try {
      // В реальном проекте здесь будет HTTP запрос
      const response = await fetch(`${this.baseURL}/suppliers/${supplierId}/products`);
      if (!response.ok) throw new Error('Ошибка загрузки товаров');
      return await response.json();
    } catch (error) {
      console.error('Ошибка API:', error);
      // Возвращаем тестовые данные для демонстрации
      return this.getMockProducts();
    }
  }

  // Обновление цен из внешнего источника
  static async fetchPriceUpdates(productIds: string[]): Promise<PriceUpdate[]> {
    try {
      const response = await fetch(`${this.baseURL}/prices/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds })
      });
      if (!response.ok) throw new Error('Ошибка загрузки цен');
      return await response.json();
    } catch (error) {
      console.error('Ошибка API:', error);
      // Возвращаем тестовые обновления цен
      return this.getMockPriceUpdates(productIds);
    }
  }

  // Синхронизация остатков товаров
  static async syncInventory(products: { id: string; quantity: number }[]): Promise<void> {
    try {
      await fetch(`${this.baseURL}/inventory/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      });
    } catch (error) {
      console.error('Ошибка синхронизации остатков:', error);
    }
  }

  // Отправка каталога на внешний сервис
  static async uploadCatalog(products: any[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/catalog/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      });
      return response.ok;
    } catch (error) {
      console.error('Ошибка загрузки каталога:', error);
      return false;
    }
  }

  // Получение курсов валют для пересчета цен
  static async getCurrencyRates(): Promise<{ [currency: string]: number }> {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
      const data = await response.json();
      return data.rates;
    } catch (error) {
      console.error('Ошибка получения курсов валют:', error);
      return { USD: 0.011, EUR: 0.010, CNY: 0.078 };
    }
  }

  // Парсинг товаров с сайта поставщика (web scraping)
  static async scrapeProductsFromWebsite(url: string): Promise<ExternalProduct[]> {
    // В реальном проекте это будет серверная функция
    console.log('Парсинг товаров с сайта:', url);
    return this.getMockProducts();
  }

  // Тестовые данные для демонстрации
  private static getMockProducts(): ExternalProduct[] {
    return [
      {
        id: 'ext-001',
        name: 'Новая ароматическая свеча "Ваниль"',
        price: 1350,
        category: 'candles',
        description: 'Свеча с ароматом ванили и корицы',
        image: 'https://images.pexels.com/photos/6454579/pexels-photo-6454579.jpeg?auto=compress&cs=tinysrgb&w=800',
        inStock: true,
        supplier: 'Поставщик А'
      },
      {
        id: 'ext-002',
        name: 'Органайзер для документов',
        price: 2100,
        category: 'baskets',
        description: 'Деревянный органайзер с отделениями',
        image: 'https://images.pexels.com/photos/4792484/pexels-photo-4792484.jpeg?auto=compress&cs=tinysrgb&w=800',
        inStock: true,
        supplier: 'Поставщик Б'
      }
    ];
  }

  private static getMockPriceUpdates(productIds: string[]): PriceUpdate[] {
    return productIds.map(id => ({
      productId: id,
      oldPrice: Math.round(1000 + Math.random() * 2000),
      newPrice: Math.round(1000 + Math.random() * 2000),
      timestamp: new Date().toISOString()
    }));
  }
}

// Утилиты для работы с файлами каталога
export class CatalogFileUtils {
  // Создание шаблона Excel файла
  static generateExcelTemplate(): ArrayBuffer {
    const XLSX = require('xlsx');
    
    const sampleData = [
      {
        'Артикул': 'sample-001',
        'Название': 'Пример товара',
        'Категория': 'books',
        'Цена': 1000,
        'Описание': 'Описание товара',
        'Изображение': 'https://example.com/image.jpg',
        'В наличии': 'Да',
        'Рейтинг': 4.5,
        'Отзывы': 10,
        'Теги': 'тег1; тег2; тег3'
      }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Шаблон каталога');
    
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  }

  // Валидация CSV файла
  static validateCSV(csvContent: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      errors.push('Файл должен содержать заголовки и хотя бы одну строку данных');
    }
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['id', 'name', 'price', 'category'];
    
    requiredHeaders.forEach(header => {
      if (!headers.some(h => h.includes(header))) {
        errors.push(`Отсутствует обязательный столбец: ${header}`);
      }
    });
    
    return { valid: errors.length === 0, errors };
  }

  // Валидация Excel файла
  static validateExcel(file: File): Promise<{ valid: boolean; errors: string[] }> {
    return new Promise((resolve) => {
      const errors: string[] = [];
      
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        errors.push('Файл должен иметь расширение .xlsx или .xls');
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        errors.push('Размер файла не должен превышать 10MB');
      }
      
      resolve({ valid: errors.length === 0, errors });
    });
  }

  // Создание шаблона CSV файла
  static generateCSVTemplate(): string {
    const headers = [
      'id', 'name', 'category', 'price', 'description', 
      'image', 'inStock', 'rating', 'reviews', 'tags'
    ];
    
    const sampleData = [
      'sample-001',
      '"Пример товара"',
      'books',
      '1000',
      '"Описание товара"',
      'https://example.com/image.jpg',
      'true',
      '4.5',
      '10',
      '"тег1;тег2;тег3"'
    ];
    
    return [headers.join(','), sampleData.join(',')].join('\n');
  }

  // Получение информации о файле
  static getFileInfo(file: File) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    return {
      name: file.name,
      size: `${sizeInMB} MB`,
      extension,
      type: file.type,
      lastModified: new Date(file.lastModified).toLocaleDateString('ru-RU')
    };
  }

  // Сжатие изображений товаров
  static async compressImage(imageFile: File, maxWidth: number = 800): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }
}