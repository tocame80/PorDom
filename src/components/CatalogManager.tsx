import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, DollarSign, Package, AlertCircle, CheckCircle, X, Save, Edit, Trash2, Plus, FileSpreadsheet, Image as ImageIcon, Palette } from 'lucide-react';
import { Product } from '../utils/types';
import { realProducts } from '../data/realProducts';
import { ImageUploader } from './ImageUploader';
import { FragranceManager } from './FragranceManager';
import * as XLSX from 'xlsx';

interface CatalogManagerProps {
  onClose: () => void;
}

interface PriceUpdate {
  id: string;
  oldPrice: number;
  newPrice: number;
  name: string;
}

export const CatalogManager: React.FC<CatalogManagerProps> = ({ onClose }) => {
  const [products, setProducts] = useState<Product[]>(realProducts);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'prices' | 'bulk' | 'export' | 'images'>('upload');
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([]);
  const [bulkPriceChange, setBulkPriceChange] = useState({ type: 'percent', value: 0, category: 'all' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFragranceManager, setShowFragranceManager] = useState(false);

  // Поддерживаемые форматы файлов
  const supportedFormats = {
    json: { name: 'JSON', ext: '.json', mime: 'application/json' },
    csv: { name: 'CSV', ext: '.csv', mime: 'text/csv' },
    xlsx: { name: 'Excel', ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Загрузка товаров из файла
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      let newProducts: Product[];

      if (file.name.endsWith('.json')) {
        newProducts = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        newProducts = parseCSV(text);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        newProducts = await parseExcel(file);
      } else {
        throw new Error('Поддерживаются форматы: JSON, CSV, Excel (XLS/XLSX)');
      }

      // Валидация данных
      const validatedProducts = validateProducts(newProducts);
      setProducts(validatedProducts);
      showMessage('success', `Загружено ${validatedProducts.length} товаров`);
      
      // Сохраняем в localStorage
      localStorage.setItem('catalog-products', JSON.stringify(validatedProducts));
      
    } catch (error) {
      showMessage('error', `Ошибка загрузки: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Парсинг CSV файла
  const parseCSV = (csvText: string): Product[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const product: any = {};
      
      headers.forEach((header, i) => {
        const value = values[i] || '';
        switch (header.toLowerCase()) {
          case 'id':
          case 'артикул':
            product.id = value;
            break;
          case 'name':
          case 'название':
            product.name = value;
            break;
          case 'category':
          case 'категория':
            product.category = value;
            break;
          case 'price':
          case 'цена':
            product.price = parseFloat(value) || 0;
            break;
          case 'description':
          case 'описание':
            product.description = value;
            break;
          case 'image':
          case 'изображение':
            product.image = value;
            break;
          case 'instock':
          case 'в_наличии':
            product.inStock = value.toLowerCase() === 'true' || value === '1';
            break;
          case 'rating':
          case 'рейтинг':
            product.rating = parseFloat(value) || 4.5;
            break;
          case 'reviews':
          case 'отзывы':
            product.reviews = parseInt(value) || 0;
            break;
          case 'tags':
          case 'теги':
            product.tags = value.split(';').map(t => t.trim()).filter(t => t);
            break;
        }
      });
      
      return {
        id: product.id || `product-${index + 1}`,
        name: product.name || 'Товар без названия',
        category: product.category || 'books',
        price: product.price || 0,
        description: product.description || '',
        image: product.image || 'https://images.pexels.com/photos/4792488/pexels-photo-4792488.jpeg?auto=compress&cs=tinysrgb&w=800',
        inStock: product.inStock !== undefined ? product.inStock : true,
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        tags: product.tags || []
      } as Product;
    });
  };

  // Парсинг Excel файла
  const parseExcel = async (file: File): Promise<Product[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            throw new Error('Excel файл должен содержать заголовки и данные');
          }
          
          const headers = (jsonData[0] as string[]).map(h => h?.toString().toLowerCase().trim());
          const products: Product[] = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (!row || row.length === 0) continue;
            
            const product: any = {};
            headers.forEach((header, index) => {
              const value = row[index]?.toString().trim() || '';
              
              switch (header) {
                case 'id':
                case 'артикул':
                  product.id = value;
                  break;
                case 'name':
                case 'название':
                case 'наименование':
                  product.name = value;
                  break;
                case 'category':
                case 'категория':
                  product.category = value;
                  break;
                case 'price':
                case 'цена':
                case 'стоимость':
                  product.price = parseFloat(value) || 0;
                  break;
                case 'description':
                case 'описание':
                  product.description = value;
                  break;
                case 'image':
                case 'изображение':
                case 'фото':
                  product.image = value;
                  break;
                case 'instock':
                case 'в_наличии':
                case 'наличие':
                  product.inStock = ['true', '1', 'да', 'есть'].includes(value.toLowerCase());
                  break;
                case 'rating':
                case 'рейтинг':
                case 'оценка':
                  product.rating = parseFloat(value) || 4.5;
                  break;
                case 'reviews':
                case 'отзывы':
                case 'количество_отзывов':
                  product.reviews = parseInt(value) || 0;
                  break;
                case 'tags':
                case 'теги':
                case 'ключевые_слова':
                  product.tags = value ? value.split(/[;,|]/).map((t: string) => t.trim()).filter((t: string) => t) : [];
                  break;
              }
            });
            
            if (product.id && product.name) {
              products.push({
                id: product.id,
                name: product.name,
                category: product.category || 'books',
                price: product.price || 0,
                description: product.description || '',
                image: product.image || 'https://images.pexels.com/photos/4792488/pexels-photo-4792488.jpeg?auto=compress&cs=tinysrgb&w=800',
                inStock: product.inStock !== false,
                rating: Math.min(5, Math.max(0, product.rating || 4.5)),
                reviews: Math.max(0, product.reviews || 0),
                tags: product.tags || []
              } as Product);
            }
          }
          
          resolve(products);
        } catch (error) {
          reject(new Error(`Ошибка парсинга Excel: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`));
        }
      };
      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Валидация товаров
  const validateProducts = (products: any[]): Product[] => {
    return products.filter(product => {
      return product.id && product.name && product.price >= 0;
    }).map(product => ({
      ...product,
      price: Math.max(0, product.price),
      rating: Math.min(5, Math.max(0, product.rating || 4.5)),
      reviews: Math.max(0, product.reviews || 0),
      inStock: product.inStock !== false,
      tags: Array.isArray(product.tags) ? product.tags : []
    }));
  };

  // Экспорт товаров
  const exportProducts = (format: 'json' | 'csv' | 'xlsx') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(products, null, 2);
      filename = `catalog-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    } else if (format === 'csv') {
      const headers = ['id', 'name', 'category', 'price', 'description', 'image', 'inStock', 'rating', 'reviews', 'tags'];
      const csvContent = [
        headers.join(','),
        ...products.map(product => [
          product.id,
          `"${product.name}"`,
          product.category,
          product.price,
          `"${product.description}"`,
          product.image,
          product.inStock,
          product.rating,
          product.reviews,
          `"${product.tags.join(';')}"`
        ].join(','))
      ].join('\n');
      
      content = csvContent;
      filename = `catalog-${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    } else { // xlsx
      const worksheet = XLSX.utils.json_to_sheet(products.map(product => ({
        'Артикул': product.id,
        'Название': product.name,
        'Категория': product.category,
        'Цена': product.price,
        'Описание': product.description,
        'Изображение': product.image,
        'В наличии': product.inStock ? 'Да' : 'Нет',
        'Рейтинг': product.rating,
        'Отзывы': product.reviews,
        'Теги': product.tags.join('; ')
      })));
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Каталог товаров');
      
      // Устанавливаем ширину колонок
      const colWidths = [
        { wch: 15 }, // Артикул
        { wch: 40 }, // Название
        { wch: 15 }, // Категория
        { wch: 10 }, // Цена
        { wch: 50 }, // Описание
        { wch: 30 }, // Изображение
        { wch: 12 }, // В наличии
        { wch: 10 }, // Рейтинг
        { wch: 10 }, // Отзывы
        { wch: 30 }  // Теги
      ];
      worksheet['!cols'] = colWidths;
      
      content = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      filename = `catalog-${new Date().toISOString().split('T')[0]}.xlsx`;
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }

    const blob = new Blob([content as any], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    showMessage('success', `Каталог экспортирован в формате ${supportedFormats[format].name}`);
  };

  // Подготовка обновления цен
  const preparePriceUpdates = () => {
    const updates: PriceUpdate[] = [];
    
    products.forEach(product => {
      let newPrice = product.price;
      
      if (bulkPriceChange.category === 'all' || product.category === bulkPriceChange.category) {
        if (bulkPriceChange.type === 'percent') {
          newPrice = product.price * (1 + bulkPriceChange.value / 100);
        } else {
          newPrice = product.price + bulkPriceChange.value;
        }
        
        newPrice = Math.round(newPrice);
        
        if (newPrice !== product.price) {
          updates.push({
            id: product.id,
            oldPrice: product.price,
            newPrice,
            name: product.name
          });
        }
      }
    });
    
    setPriceUpdates(updates);
  };

  // Применение обновления цен
  const applyPriceUpdates = () => {
    const updatedProducts = products.map(product => {
      const update = priceUpdates.find(u => u.id === product.id);
      return update ? { ...product, price: update.newPrice } : product;
    });
    
    setProducts(updatedProducts);
    localStorage.setItem('catalog-products', JSON.stringify(updatedProducts));
    showMessage('success', `Обновлено цен: ${priceUpdates.length}`);
    setPriceUpdates([]);
  };

  // Загрузка цен из внешнего источника (имитация API)
  const fetchPricesFromAPI = async () => {
    setLoading(true);
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Имитация обновления цен (случайные изменения ±10%)
      const updatedProducts = products.map(product => ({
        ...product,
        price: Math.round(product.price * (0.9 + Math.random() * 0.2))
      }));
      
      setProducts(updatedProducts);
      localStorage.setItem('catalog-products', JSON.stringify(updatedProducts));
      showMessage('success', 'Цены обновлены из внешнего источника');
    } catch (error) {
      showMessage('error', 'Ошибка при загрузке цен');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'upload', name: 'Загрузка', icon: Upload },
    { id: 'images', name: 'Изображения', icon: ImageIcon },
    { id: 'prices', name: 'Цены', icon: DollarSign },
    { id: 'bulk', name: 'Массовые операции', icon: Package },
    { id: 'export', name: 'Экспорт', icon: Download }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-sage-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Управление каталогом</h2>
              <p className="text-sage-100 mt-1">Загрузка, обновление и экспорт товаров</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFragranceManager(true)}
                className="flex items-center gap-2 bg-sage-700 hover:bg-sage-800 px-4 py-2 rounded-lg transition-colors"
              >
                <Palette className="h-4 w-4" />
                Ароматы и форматы
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-sage-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-sage-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{products.length}</div>
              <div className="text-sm opacity-90">Товаров</div>
            </div>
            <div className="bg-sage-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{products.filter(p => p.inStock).length}</div>
              <div className="text-sm opacity-90">В наличии</div>
            </div>
            <div className="bg-sage-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">
                {Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)}₽
              </div>
              <div className="text-sm opacity-90">Средняя цена</div>
            </div>
            <div className="bg-sage-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">
                {(products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)}
              </div>
              <div className="text-sm opacity-90">Средний рейтинг</div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' :
            message.type === 'error' ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
              {message.type === 'error' && <AlertCircle className="h-5 w-5 mr-2" />}
              {message.type === 'info' && <AlertCircle className="h-5 w-5 mr-2" />}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-sage-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-sage-600 text-sage-600'
                    : 'text-sage-500 hover:text-sage-700'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-sage-800 mb-4">Загрузка товаров</h3>
                
                <div className="border-2 border-dashed border-sage-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-sage-800 mb-2">
                    Загрузите файл с товарами
                  </h4>
                  <p className="text-sage-600 mb-4">
                    Поддерживаются форматы: JSON, CSV
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="bg-sage-600 text-white px-6 py-2 rounded-lg hover:bg-sage-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Загрузка...' : 'Выбрать файл'}
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-3">Поддерживаемые форматы:</h5>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div><strong>JSON:</strong> Полная структура данных</div>
                    <div><strong>CSV:</strong> id,name,category,price,description,image,inStock,rating,reviews,tags</div>
                    <div><strong>Excel:</strong> Артикул, Название, Категория, Цена, Описание, Изображение, В наличии, Рейтинг, Отзывы, Теги</div>
                  </div>
                  <p className="text-sm text-blue-600 mt-2">
                    Теги разделяются точкой с запятой (;), запятой (,) или вертикальной чертой (|)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-sage-800">Управление ценами</h3>
                <button
                  onClick={fetchPricesFromAPI}
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Загрузка...' : 'Обновить из API'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Тип изменения
                  </label>
                  <select
                    value={bulkPriceChange.type}
                    onChange={(e) => setBulkPriceChange({...bulkPriceChange, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="percent">Процент (%)</option>
                    <option value="fixed">Фиксированная сумма (₽)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Значение
                  </label>
                  <input
                    type="number"
                    value={bulkPriceChange.value}
                    onChange={(e) => setBulkPriceChange({...bulkPriceChange, value: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                    placeholder={bulkPriceChange.type === 'percent' ? '10' : '100'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={bulkPriceChange.category}
                    onChange={(e) => setBulkPriceChange({...bulkPriceChange, category: e.target.value})}
                    className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="all">Все категории</option>
                    <option value="books">📚 Книги</option>
                    <option value="candles">🕯️ Свечи</option>
                    <option value="sachets">🌿 Саше</option>
                    <option value="baskets">🧺 Корзины</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={preparePriceUpdates}
                  className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors"
                >
                  Предварительный просмотр
                </button>
                
                {priceUpdates.length > 0 && (
                  <button
                    onClick={applyPriceUpdates}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Применить изменения ({priceUpdates.length})
                  </button>
                )}
              </div>
              
              {priceUpdates.length > 0 && (
                <div className="border border-sage-200 rounded-lg overflow-hidden">
                  <div className="bg-sage-50 px-4 py-2 font-medium text-sage-800">
                    Предварительный просмотр изменений
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {priceUpdates.slice(0, 10).map((update) => (
                      <div key={update.id} className="px-4 py-2 border-b border-sage-100 flex justify-between items-center">
                        <span className="text-sage-800">{update.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sage-500 line-through">{update.oldPrice}₽</span>
                          <span className="text-green-600 font-medium">{update.newPrice}₽</span>
                        </div>
                      </div>
                    ))}
                    {priceUpdates.length > 10 && (
                      <div className="px-4 py-2 text-center text-sage-500">
                        ... и еще {priceUpdates.length - 10} товаров
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-sage-800">Управление изображениями товаров</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="border border-sage-200 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg mr-3"
                      />
                      <div>
                        <h4 className="font-medium text-sage-800">{product.name}</h4>
                        <p className="text-sm text-sage-600">ID: {product.id}</p>
                      </div>
                    </div>
                    
                    <ImageUploader
                      productId={product.id}
                      maxImages={5}
                      showPreview={false}
                    />
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">💡 Рекомендации по изображениям:</h5>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• <strong>Основное изображение:</strong> Лучший ракурс товара на белом фоне</div>
                  <div>• <strong>Дополнительные:</strong> Разные ракурсы, детали, применение</div>
                  <div>• <strong>Качество:</strong> Минимум 800x800px, хорошее освещение</div>
                  <div>• <strong>Формат:</strong> JPEG для фото, PNG для изображений с прозрачностью</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bulk' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-sage-800">Массовые операции</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-sage-200 rounded-lg p-4">
                  <h4 className="font-medium text-sage-800 mb-3">Управление наличием</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Отметить все "В наличии"
                    </button>
                    <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Отметить все "Нет в наличии"
                    </button>
                  </div>
                </div>
                
                <div className="border border-sage-200 rounded-lg p-4">
                  <h4 className="font-medium text-sage-800 mb-3">Очистка данных</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                      Сбросить рейтинги
                    </button>
                    <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Удалить все товары
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-sage-800">Экспорт каталога</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-sage-200 rounded-lg p-6 text-center">
                  <Download className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                  <h4 className="font-medium text-sage-800 mb-2">JSON формат</h4>
                  <p className="text-sage-600 text-sm mb-4">
                    Полная структура данных для резервного копирования
                  </p>
                  <button
                    onClick={() => exportProducts('json')}
                    className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors"
                  >
                    Скачать JSON
                  </button>
                </div>
                
                <div className="border border-sage-200 rounded-lg p-6 text-center">
                  <Download className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                  <h4 className="font-medium text-sage-800 mb-2">CSV формат</h4>
                  <p className="text-sage-600 text-sm mb-4">
                    Табличный формат для Excel и других программ
                  </p>
                  <button
                    onClick={() => exportProducts('csv')}
                    className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors"
                  >
                    Скачать CSV
                  </button>
                </div>
                
                <div className="border border-sage-200 rounded-lg p-6 text-center">
                  <FileSpreadsheet className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                  <h4 className="font-medium text-sage-800 mb-2">Excel формат</h4>
                  <p className="text-sage-600 text-sm mb-4">
                    Профессиональный формат с форматированием
                  </p>
                  <button
                    onClick={() => exportProducts('xlsx')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Скачать Excel
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">💾 Автоматическое сохранение</h5>
                  <p className="text-sm text-blue-600">
                    Каталог автоматически сохраняется в localStorage браузера при каждом изменении.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">📊 Рекомендации по форматам</h5>
                  <div className="text-sm text-green-600 space-y-1">
                    <div><strong>Excel:</strong> Лучший для редактирования</div>
                    <div><strong>CSV:</strong> Универсальная совместимость</div>
                    <div><strong>JSON:</strong> Техническое резервирование</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fragrance Manager Modal */}
      {showFragranceManager && (
        <FragranceManager
          onClose={() => setShowFragranceManager(false)}
          onProductsGenerated={(products) => {
            setProducts(prev => [...prev.filter(p => !p.fragrance), ...products]);
            localStorage.setItem('catalog-products', JSON.stringify([...products.filter(p => !p.fragrance), ...products]));
            showMessage('success', `Добавлено ${products.length} товаров из матрицы ароматов`);
            setShowFragranceManager(false);
          }}
        />
      )}
    </div>
  );
};

