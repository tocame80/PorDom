import React, { useState } from 'react';
import { Plus, Minus, Edit, Save, X, Palette, Package, DollarSign } from 'lucide-react';
import { fragrances, formats, getFragranceById, getFormatById, generateProductFromFragranceFormat } from '../data/fragrances';
import { Fragrance, Format } from '../utils/types';

interface FragranceManagerProps {
  onClose: () => void;
  onProductsGenerated?: (products: any[]) => void;
}

export const FragranceManager: React.FC<FragranceManagerProps> = ({ onClose, onProductsGenerated }) => {
  const [selectedFragrance, setSelectedFragrance] = useState<string | null>(null);
  const [editingFragrance, setEditingFragrance] = useState<Fragrance | null>(null);
  const [showDiscountEditor, setShowDiscountEditor] = useState(false);
  const [discounts, setDiscounts] = useState<{ [key: string]: { percent: number; active: boolean } }>({});

  // Переключение доступности формата для аромата
  const toggleFormatAvailability = (fragranceId: string, formatId: string) => {
    const fragrance = fragrances.find(f => f.id === fragranceId);
    if (!fragrance) return;

    const isAvailable = fragrance.availableFormats.includes(formatId);
    if (isAvailable) {
      fragrance.availableFormats = fragrance.availableFormats.filter(id => id !== formatId);
    } else {
      fragrance.availableFormats.push(formatId);
    }
    
    // Принудительно обновляем компонент
    setSelectedFragrance(fragranceId);
  };

  // Генерация товаров из матрицы ароматов и форматов
  const generateProducts = () => {
    const products: any[] = [];
    
    fragrances.forEach(fragrance => {
      fragrance.availableFormats.forEach(formatId => {
        const format = getFormatById(formatId);
        if (format) {
          const product = generateProductFromFragranceFormat(fragrance, format);
          
          // Применяем скидки если есть
          const discount = discounts[`${fragrance.id}-${formatId}`];
          if (discount && discount.active) {
            product.originalPrice = product.price;
            product.discountPercent = discount.percent;
            product.discountPrice = Math.round(product.price * (1 - discount.percent / 100));
            product.price = product.discountPrice;
            product.discountActive = true;
          }
          
          products.push(product);
        }
      });
    });
    
    onProductsGenerated?.(products);
    return products;
  };

  // Установка скидки
  const setDiscount = (fragranceId: string, formatId: string, percent: number, active: boolean) => {
    const key = `${fragranceId}-${formatId}`;
    setDiscounts(prev => ({
      ...prev,
      [key]: { percent, active }
    }));
  };

  const formatTypeIcons = {
    'sachet': '🌿',
    'candle': '🕯️',
    'jar': '🏺'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-sage-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Управление ароматами и форматами</h2>
              <p className="text-sage-100 mt-1">Матричная система управления товарами</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDiscountEditor(!showDiscountEditor)}
                className="flex items-center gap-2 bg-sage-700 hover:bg-sage-800 px-4 py-2 rounded-lg transition-colors"
              >
                <DollarSign className="h-4 w-4" />
                {showDiscountEditor ? 'Скрыть скидки' : 'Управление скидками'}
              </button>
              <button
                onClick={() => {
                  const products = generateProducts();
                  alert(`Сгенерировано ${products.length} товаров!`);
                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Package className="h-4 w-4" />
                Сгенерировать товары
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-sage-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Formats Legend */}
          <div className="mb-6 p-4 bg-sage-50 rounded-lg">
            <h3 className="font-semibold text-sage-800 mb-3">Форматы товаров:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-sm">
              {formats.map(format => (
                <div key={format.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                  <span className="text-lg">{formatTypeIcons[format.type]}</span>
                  <div>
                    <div className="font-medium text-sage-800">{format.name}</div>
                    <div className="text-sage-600">{format.basePrice}₽</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-sage-200 rounded-lg overflow-hidden">
              <thead className="bg-sage-100">
                <tr>
                  <th className="p-3 text-left font-semibold text-sage-800 min-w-[200px]">
                    Аромат
                  </th>
                  {formats.map(format => (
                    <th key={format.id} className="p-2 text-center font-medium text-sage-700 min-w-[80px]">
                      <div className="flex flex-col items-center">
                        <span className="text-lg mb-1">{formatTypeIcons[format.type]}</span>
                        <span className="text-xs">{format.name.split(' ')[0]}</span>
                        <span className="text-xs">{format.size}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fragrances.map((fragrance, index) => (
                  <tr key={fragrance.id} className={index % 2 === 0 ? 'bg-white' : 'bg-sage-25'}>
                    <td className="p-3 border-r border-sage-200">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border border-sage-300"
                          style={{ backgroundColor: fragrance.color }}
                        />
                        <div>
                          <div className="font-medium text-sage-800">{fragrance.name}</div>
                          <div className="text-sm text-sage-600">{fragrance.description}</div>
                        </div>
                      </div>
                    </td>
                    {formats.map(format => {
                      const isAvailable = fragrance.availableFormats.includes(format.id);
                      const discountKey = `${fragrance.id}-${format.id}`;
                      const discount = discounts[discountKey];
                      
                      return (
                        <td key={format.id} className="p-2 text-center border-r border-sage-200">
                          <div className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => toggleFormatAvailability(fragrance.id, format.id)}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                isAvailable
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'bg-gray-200 border-gray-300 text-gray-500'
                              }`}
                            >
                              {isAvailable ? '+' : '−'}
                            </button>
                            
                            {isAvailable && showDiscountEditor && (
                              <div className="mt-1">
                                <input
                                  type="number"
                                  placeholder="0"
                                  className="w-12 h-6 text-xs text-center border border-sage-300 rounded"
                                  value={discount?.percent || ''}
                                  onChange={(e) => {
                                    const percent = parseInt(e.target.value) || 0;
                                    setDiscount(fragrance.id, format.id, percent, percent > 0);
                                  }}
                                />
                                <div className="text-xs text-sage-600">%</div>
                              </div>
                            )}
                            
                            {isAvailable && discount && discount.active && (
                              <div className="text-xs text-red-600 font-medium">
                                -{discount.percent}%
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {fragrances.length}
              </div>
              <div className="text-sm text-blue-700">Ароматов</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {formats.length}
              </div>
              <div className="text-sm text-green-700">Форматов</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {fragrances.reduce((sum, f) => sum + f.availableFormats.length, 0)}
              </div>
              <div className="text-sm text-purple-700">Комбинаций</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(discounts).filter(d => d.active).length}
              </div>
              <div className="text-sm text-red-700">Скидок активно</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Инструкция:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div><strong>Зеленая кнопка (+):</strong> Формат доступен для аромата</div>
              <div><strong>Серая кнопка (−):</strong> Формат недоступен</div>
              <div><strong>Поле скидки:</strong> Укажите процент скидки (появляется при включении режима скидок)</div>
              <div><strong>Генерация товаров:</strong> Создает товары для всех активных комбинаций</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};