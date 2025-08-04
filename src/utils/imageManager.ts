// Система управления изображениями для каталога

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
  size?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  format?: 'jpg' | 'png' | 'webp';
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  compressed?: boolean;
  originalSize?: number;
  compressedSize?: number;
}

export class ImageManager {
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly MAX_WIDTH = 1200;
  private static readonly MAX_HEIGHT = 1200;
  private static readonly QUALITY = 0.8;

  // Загрузка изображения с сжатием
  static async uploadImage(file: File, productId: string): Promise<ImageUploadResult> {
    try {
      // Проверка размера файла
      if (file.size > this.MAX_FILE_SIZE) {
        return {
          success: false,
          error: `Файл слишком большой. Максимальный размер: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
        };
      }

      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Файл должен быть изображением'
        };
      }

      // Сжатие изображения
      const compressedDataUrl = await this.compressImage(file);
      
      // В реальном проекте здесь будет загрузка на сервер
      // const uploadedUrl = await this.uploadToServer(compressedDataUrl, productId);
      
      // Для демонстрации используем data URL или внешние сервисы
      const uploadedUrl = await this.uploadToImageService(compressedDataUrl, productId);

      return {
        success: true,
        url: uploadedUrl,
        compressed: true,
        originalSize: file.size,
        compressedSize: compressedDataUrl.length
      };

    } catch (error) {
      return {
        success: false,
        error: `Ошибка загрузки: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      };
    }
  }

  // Сжатие изображения
  private static compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Вычисляем новые размеры с сохранением пропорций
        const { width, height } = this.calculateNewDimensions(
          img.width, 
          img.height, 
          this.MAX_WIDTH, 
          this.MAX_HEIGHT
        );

        canvas.width = width;
        canvas.height = height;

        // Рисуем сжатое изображение
        ctx?.drawImage(img, 0, 0, width, height);

        // Конвертируем в JPEG с качеством
        const compressedDataUrl = canvas.toDataURL('image/jpeg', this.QUALITY);
        resolve(compressedDataUrl);
      };

      img.onerror = () => reject(new Error('Ошибка загрузки изображения'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Вычисление новых размеров с сохранением пропорций
  private static calculateNewDimensions(
    originalWidth: number, 
    originalHeight: number, 
    maxWidth: number, 
    maxHeight: number
  ) {
    let { width, height } = { width: originalWidth, height: originalHeight };

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  // Загрузка на внешний сервис изображений (имитация)
  private static async uploadToImageService(dataUrl: string, productId: string): Promise<string> {
    // В реальном проекте здесь будет:
    // 1. Загрузка на Cloudinary, AWS S3, или другой сервис
    // 2. Получение постоянного URL
    
    // Для демонстрации возвращаем URL из Pexels или Unsplash
    const imageUrls = [
      'https://images.pexels.com/photos/4792488/pexels-photo-4792488.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6454579/pexels-photo-6454579.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5938596/pexels-photo-5938596.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6436293/pexels-photo-6436293.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4866041/pexels-photo-4866041.jpeg?auto=compress&cs=tinysrgb&w=800'
    ];
    
    // Имитация задержки загрузки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return imageUrls[Math.floor(Math.random() * imageUrls.length)];
  }

  // Создание миниатюры
  static async createThumbnail(imageUrl: string, size: number = 150): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        // Обрезаем изображение по центру
        const sourceSize = Math.min(img.width, img.height);
        const sourceX = (img.width - sourceSize) / 2;
        const sourceY = (img.height - sourceSize) / 2;

        ctx?.drawImage(
          img, 
          sourceX, sourceY, sourceSize, sourceSize,
          0, 0, size, size
        );

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => reject(new Error('Ошибка создания миниатюры'));
      img.src = imageUrl;
    });
  }

  // Валидация URL изображения
  static async validateImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      
      // Таймаут для медленных изображений
      setTimeout(() => resolve(false), 5000);
    });
  }

  // Получение информации об изображении
  static async getImageInfo(url: string): Promise<{
    width: number;
    height: number;
    aspectRatio: number;
    isValid: boolean;
  }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
          isValid: true
        });
      };
      img.onerror = () => {
        resolve({
          width: 0,
          height: 0,
          aspectRatio: 1,
          isValid: false
        });
      };
      img.src = url;
    });
  }

  // Генерация placeholder изображения
  static generatePlaceholder(width: number = 400, height: number = 300, text: string = 'Нет фото'): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = width;
    canvas.height = height;
    
    // Фон
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
    
    // Текст
    ctx.fillStyle = '#9ca3af';
    ctx.font = `${Math.min(width, height) / 10}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    
    return canvas.toDataURL('image/png');
  }
}

// Утилиты для работы с множественными изображениями
export class ProductImageManager {
  // Добавление изображения к товару
  static addImageToProduct(productId: string, imageUrl: string, isPrimary: boolean = false): ProductImage {
    const existingImages = this.getProductImages(productId);
    
    const newImage: ProductImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: imageUrl,
      alt: `Изображение товара ${productId}`,
      isPrimary: isPrimary || existingImages.length === 0,
      order: existingImages.length
    };

    // Если новое изображение основное, убираем флаг у других
    if (isPrimary) {
      existingImages.forEach(img => img.isPrimary = false);
    }

    const updatedImages = [...existingImages, newImage];
    this.saveProductImages(productId, updatedImages);
    
    return newImage;
  }

  // Получение изображений товара
  static getProductImages(productId: string): ProductImage[] {
    const stored = localStorage.getItem(`product-images-${productId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Сохранение изображений товара
  static saveProductImages(productId: string, images: ProductImage[]): void {
    localStorage.setItem(`product-images-${productId}`, JSON.stringify(images));
  }

  // Установка основного изображения
  static setPrimaryImage(productId: string, imageId: string): void {
    const images = this.getProductImages(productId);
    images.forEach(img => {
      img.isPrimary = img.id === imageId;
    });
    this.saveProductImages(productId, images);
  }

  // Удаление изображения
  static removeImage(productId: string, imageId: string): void {
    const images = this.getProductImages(productId).filter(img => img.id !== imageId);
    
    // Если удалили основное изображение, делаем первое основным
    if (images.length > 0 && !images.some(img => img.isPrimary)) {
      images[0].isPrimary = true;
    }
    
    this.saveProductImages(productId, images);
  }

  // Изменение порядка изображений
  static reorderImages(productId: string, imageIds: string[]): void {
    const images = this.getProductImages(productId);
    const reorderedImages = imageIds.map((id, index) => {
      const image = images.find(img => img.id === id);
      if (image) {
        image.order = index;
      }
      return image;
    }).filter(Boolean) as ProductImage[];
    
    this.saveProductImages(productId, reorderedImages);
  }

  // Получение основного изображения
  static getPrimaryImage(productId: string): ProductImage | null {
    const images = this.getProductImages(productId);
    return images.find(img => img.isPrimary) || images[0] || null;
  }

  // Получение URL основного изображения (для обратной совместимости)
  static getPrimaryImageUrl(productId: string): string {
    const primaryImage = this.getPrimaryImage(productId);
    return primaryImage?.url || ImageManager.generatePlaceholder();
  }
}

// Константы для работы с изображениями
export const IMAGE_CONSTANTS = {
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES_PER_PRODUCT: 10,
  THUMBNAIL_SIZE: 150,
  PREVIEW_SIZE: 400,
  FULL_SIZE: 1200,
  COMPRESSION_QUALITY: 0.8,
  
  // Рекомендуемые размеры для разных целей
  SIZES: {
    THUMBNAIL: { width: 150, height: 150 },
    CARD: { width: 300, height: 300 },
    DETAIL: { width: 600, height: 600 },
    FULL: { width: 1200, height: 1200 }
  }
};