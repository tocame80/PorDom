import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Download } from 'lucide-react';
import { Product } from '../utils/types';
import { realProducts, getCatalogStats } from '../data/realProducts';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [products, setProducts] = useState<Product[]>(realProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const stats = getCatalogStats();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveProduct = (product: Product) => {
    if (isAddingNew) {
      setProducts([...products, { ...product, id: `new-${Date.now()}` }]);
      setIsAddingNew(false);
    } else {
      setProducts(products.map(p => p.id === product.id ? product : p));
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Удалить товар?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const exportProducts = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.json';
    link.click();
  };

  const importProducts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedProducts = JSON.parse(e.target?.result as string);
          setProducts(importedProducts);
        } catch (error) {
          alert('Ошибка при импорте файла');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-sage-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Управление каталогом</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-sage-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            <div className="bg-sage-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm opacity-90">Всего товаров</div>
            </div>
            <div className="bg-sage-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{stats.inStock}</div>
              <div className="text-sm opacity-90">В наличии</div>
            </div>
            <div className="bg-sage-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{stats.averagePrice}₽</div>
              <div className="text-sm opacity-90">Средняя цена</div>
            </div>
            <div className="bg-sage-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <div className="text-sm opacity-90">Средний рейтинг</div>
            </div>
            <div className="bg-sage-700 p-3 rounded-lg text-center">
              <div className="text-lg font-bold">
                📚{stats.byCategory.books} 🕯️{stats.byCategory.candles}
              </div>
              <div className="text-sm opacity-90">По категориям</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-sage-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
              >
                <option value="all">Все категории</option>
                <option value="books">📚 Книги</option>
                <option value="candles">🕯️ Свечи</option>
                <option value="sachets">🌿 Саше</option>
                <option value="baskets">🧺 Корзины</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsAddingNew(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Добавить товар
              </button>
              <button
                onClick={exportProducts}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Экспорт
              </button>
              <label className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                Импорт
                <input
                  type="file"
                  accept=".json"
                  onChange={importProducts}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-auto max-h-96">
          <table className="w-full">
            <thead className="bg-sage-50 sticky top-0">
              <tr>
                <th className="text-left p-4 font-medium text-sage-700">Товар</th>
                <th className="text-left p-4 font-medium text-sage-700">Категория</th>
                <th className="text-left p-4 font-medium text-sage-700">Цена</th>
                <th className="text-left p-4 font-medium text-sage-700">Рейтинг</th>
                <th className="text-left p-4 font-medium text-sage-700">Наличие</th>
                <th className="text-left p-4 font-medium text-sage-700">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-sage-100 hover:bg-sage-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <div className="font-medium text-sage-800">{product.name}</div>
                        <div className="text-sm text-sage-600">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-sage-100 text-sage-600 px-2 py-1 rounded-full text-sm">
                      {product.category === 'books' && '📚'}
                      {product.category === 'candles' && '🕯️'}
                      {product.category === 'sachets' && '🌿'}
                      {product.category === 'baskets' && '🧺'}
                      {' '}{product.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{product.price.toLocaleString()} ₽</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span>{product.rating}</span>
                      <span className="text-sage-500 text-sm">({product.reviews})</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      product.inStock 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-sage-50 text-center text-sage-600">
          Показано {filteredProducts.length} из {products.length} товаров
        </div>
      </div>

      {/* Edit/Add Product Modal */}
      {(editingProduct || isAddingNew) && (
        <ProductEditModal
          product={editingProduct}
          isNew={isAddingNew}
          onSave={handleSaveProduct}
          onCancel={() => {
            setEditingProduct(null);
            setIsAddingNew(false);
          }}
        />
      )}
    </div>
  );
};

// Product Edit Modal Component
interface ProductEditModalProps {
  product: Product | null;
  isNew: boolean;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ product, isNew, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: '',
      name: '',
      category: 'books' as const,
      price: 0,
      image: '',
      description: '',
      inStock: true,
      rating: 4.5,
      reviews: 0,
      tags: []
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold text-sage-800 mb-4">
            {isNew ? 'Добавить товар' : 'Редактировать товар'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Название товара
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Категория
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                >
                  <option value="books">📚 Книги</option>
                  <option value="candles">🕯️ Свечи</option>
                  <option value="sachets">🌿 Саше</option>
                  <option value="baskets">🧺 Корзины</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Описание
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Цена (₽)
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Рейтинг
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Отзывы
                </label>
                <input
                  type="number"
                  value={formData.reviews}
                  onChange={(e) => setFormData({...formData, reviews: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                URL изображения
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Теги (через запятую)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim())})}
                className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                checked={formData.inStock}
                onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="inStock" className="text-sm font-medium text-sage-700">
                В наличии
              </label>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-sage-600 text-white py-2 rounded-lg hover:bg-sage-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Сохранить
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border border-sage-300 text-sage-600 py-2 rounded-lg hover:bg-sage-50 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};