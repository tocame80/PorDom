import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Plus, Star, Move, Eye, Download } from 'lucide-react';
import { ImageManager, ProductImageManager, ProductImage, IMAGE_CONSTANTS } from '../utils/imageManager';

interface ImageUploaderProps {
  productId: string;
  onImagesChange?: (images: ProductImage[]) => void;
  maxImages?: number;
  showPreview?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  productId,
  onImagesChange,
  maxImages = IMAGE_CONSTANTS.MAX_IMAGES_PER_PRODUCT,
  showPreview = true
}) => {
  const [images, setImages] = useState<ProductImage[]>(
    ProductImageManager.getProductImages(productId)
  );
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateImages = (newImages: ProductImage[]) => {
    setImages(newImages);
    ProductImageManager.saveProductImages(productId, newImages);
    onImagesChange?.(newImages);
  };

  const handleFileUpload = async (files: FileList) => {
    if (images.length >= maxImages) {
      alert(`Максимальное количество изображений: ${maxImages}`);
      return;
    }

    setUploading(true);
    const uploadPromises = Array.from(files).slice(0, maxImages - images.length).map(async (file) => {
      const result = await ImageManager.uploadImage(file, productId);
      if (result.success && result.url) {
        return ProductImageManager.addImageToProduct(productId, result.url, images.length === 0);
      }
      return null;
    });

    try {
      const uploadedImages = await Promise.all(uploadPromises);
      const validImages = uploadedImages.filter(Boolean) as ProductImage[];
      
      if (validImages.length > 0) {
        const newImages = [...images, ...validImages];
        updateImages(newImages);
      }
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const setPrimaryImage = (imageId: string) => {
    const newImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    updateImages(newImages);
  };

  const removeImage = (imageId: string) => {
    // Используем ProductImageManager для удаления изображения
    ProductImageManager.removeImage(productId, imageId);
    
    // Обновляем состояние компонента из localStorage
    const updatedImages = ProductImageManager.getProductImages(productId);
    setImages(updatedImages);
    
    // Уведомляем родительский компонент об изменениях
    onImagesChange?.(updatedImages);
  };

  const addImageByUrl = () => {
    const url = prompt('Введите URL изображения:');
    if (url) {
      const newImage = ProductImageManager.addImageToProduct(productId, url, images.length === 0);
      const newImages = [...images, newImage];
      updateImages(newImages);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-sage-500 bg-sage-50' 
            : 'border-sage-300 hover:border-sage-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={IMAGE_CONSTANTS.SUPPORTED_FORMATS.join(',')}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />
        
        <Upload className="h-12 w-12 text-sage-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-sage-800 mb-2">
          Загрузите изображения товара
        </h4>
        <p className="text-sage-600 mb-4">
          Перетащите файлы сюда или нажмите для выбора
        </p>
        
        <div className="flex justify-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Загрузка...' : 'Выбрать файлы'}
          </button>
          
          <button
            onClick={addImageByUrl}
            disabled={images.length >= maxImages}
            className="border border-sage-600 text-sage-600 px-4 py-2 rounded-lg hover:bg-sage-50 transition-colors disabled:opacity-50"
          >
            Добавить по URL
          </button>
        </div>
        
        <p className="text-sm text-sage-500 mt-2">
          Максимум {maxImages} изображений, до 5MB каждое
        </p>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group bg-white rounded-lg border border-sage-200 overflow-hidden"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = ImageManager.generatePlaceholder(300, 200, 'Ошибка загрузки');
                }}
              />
              
              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Основное
                </div>
              )}
              
              {/* Controls */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex gap-2">
                  {!image.isPrimary && (
                    <button
                      onClick={() => setPrimaryImage(image.id)}
                      className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition-colors"
                      title="Сделать основным"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => setPreviewImage(image.url)}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                    title="Предварительный просмотр"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => removeImage(image.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Удалить"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Order Number */}
              <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-sage-800 px-2 py-1 rounded text-xs font-medium">
                {index + 1}
              </div>
            </div>
          ))}
          
          {/* Add More Button */}
          {images.length < maxImages && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-32 border-2 border-dashed border-sage-300 rounded-lg flex flex-col items-center justify-center text-sage-500 hover:border-sage-400 hover:text-sage-600 transition-colors"
            >
              <Plus className="h-8 w-8 mb-2" />
              <span className="text-sm">Добавить еще</span>
            </button>
          )}
        </div>
      )}

      {/* Image Info */}
      {images.length > 0 && (
        <div className="bg-sage-50 rounded-lg p-4">
          <h5 className="font-medium text-sage-800 mb-2">Информация об изображениях:</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-sage-600">
            <div>
              <span className="font-medium">Всего изображений:</span> {images.length}
            </div>
            <div>
              <span className="font-medium">Основное изображение:</span> {
                images.find(img => img.isPrimary)?.alt || 'Не выбрано'
              }
            </div>
            <div>
              <span className="font-medium">Доступно слотов:</span> {maxImages - images.length}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={previewImage}
              alt="Предварительный просмотр"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

