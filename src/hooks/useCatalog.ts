import { useState, useEffect } from 'react';
import { Product } from '../utils/types';
import { realProducts } from '../data/realProducts';

const CATALOG_STORAGE_KEY = 'catalog-products';

export const useCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем каталог при инициализации
  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = () => {
    try {
      const savedCatalog = localStorage.getItem(CATALOG_STORAGE_KEY);
      if (savedCatalog) {
        const parsedCatalog = JSON.parse(savedCatalog);
        setProducts(parsedCatalog);
      } else {
        // Используем дефолтный каталог
        setProducts(realProducts);
        localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(realProducts));
      }
    } catch (error) {
      console.error('Ошибка загрузки каталога:', error);
      setProducts(realProducts);
    } finally {
      setLoading(false);
    }
  };

  const updateCatalog = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(newProducts));
  };

  const addProduct = (product: Product) => {
    const newProducts = [...products, product];
    updateCatalog(newProducts);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    const newProducts = products.map(product =>
      product.id === productId ? { ...product, ...updates } : product
    );
    updateCatalog(newProducts);
  };

  const deleteProduct = (productId: string) => {
    const newProducts = products.filter(product => product.id !== productId);
    updateCatalog(newProducts);
  };

  const updatePrices = (priceUpdates: { id: string; price: number }[]) => {
    const newProducts = products.map(product => {
      const update = priceUpdates.find(u => u.id === product.id);
      return update ? { ...product, price: update.price } : product;
    });
    updateCatalog(newProducts);
  };

  const bulkUpdateStock = (inStock: boolean, category?: string) => {
    const newProducts = products.map(product => {
      if (!category || product.category === category) {
        return { ...product, inStock };
      }
      return product;
    });
    updateCatalog(newProducts);
  };

  const resetCatalog = () => {
    updateCatalog(realProducts);
  };

  const getProductsByCategory = (category: string) => {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
  };

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getCatalogStats = () => {
    return {
      total: products.length,
      inStock: products.filter(p => p.inStock).length,
      outOfStock: products.filter(p => !p.inStock).length,
      averagePrice: products.length > 0 
        ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
        : 0,
      averageRating: products.length > 0
        ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
        : '0',
      byCategory: {
        books: products.filter(p => p.category === 'books').length,
        candles: products.filter(p => p.category === 'candles').length,
        sachets: products.filter(p => p.category === 'sachets').length,
        baskets: products.filter(p => p.category === 'baskets').length,
      }
    };
  };

  return {
    products,
    loading,
    updateCatalog,
    addProduct,
    updateProduct,
    deleteProduct,
    updatePrices,
    bulkUpdateStock,
    resetCatalog,
    getProductsByCategory,
    searchProducts,
    getCatalogStats,
    reloadCatalog: loadCatalog
  };
};