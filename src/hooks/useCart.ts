import { useState, useEffect } from 'react';
import { CartItem, Product } from '../utils/types';
import { showNotification } from '../utils/notification';

const CART_STORAGE_KEY = 'poryadochny-dom-cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Загружаем корзину при инициализации
  useEffect(() => {
    console.log('🔄 Loading cart from localStorage...');
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('✅ Cart loaded from localStorage:', parsedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('❌ Error parsing cart from localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } else {
      console.log('📝 No saved cart found in localStorage');
    }
  }, []);

  // Сохраняем корзину при каждом изменении
  useEffect(() => {
    if (cart.length > 0) {
      console.log('💾 Saving cart to localStorage:', cart);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product) => {
    console.log('🛒 useCart: Adding to cart:', product.name, 'ID:', product.id);
    console.log('📦 Current cart before adding (length):', cart.length);
    console.log('📦 Current cart items:', cart.map(item => `${item.product.name} x${item.quantity}`));
    
    setCart(prevCart => {
      console.log('📦 Previous cart in setter:', prevCart.length, 'items');
      const existingItem = prevCart.find(item => item.product.id === product.id);
      let newCart;
      
      if (existingItem) {
        console.log('✅ Product already in cart, increasing quantity from', existingItem.quantity, 'to', existingItem.quantity + 1);
        newCart = prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        console.log('✅ Adding new product to cart:', product.name);
        newCart = [...prevCart, { product, quantity: 1 }];
      }
      
      console.log('📦 New cart after adding (length):', newCart.length);
      console.log('📦 New cart items:', newCart.map(item => `${item.product.name} x${item.quantity}`));
      
      // Сохраняем в localStorage немедленно
      console.log('💾 Saving to localStorage, items count:', newCart.length);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      
      return newCart;
    });
    
    // Показываем уведомление
    showNotification(`✅ ${product.name} добавлен в корзину`);
  };

  const removeFromCart = (productId: string) => {
    console.log('🗑️ Removing from cart:', productId);
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.product.id !== productId);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    console.log('🔢 Updating quantity for', productId, 'to', quantity);
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    });
  };

  const getTotalPrice = () => {
    const total = cart.reduce((total, item) => {
      if (item.product.isCustomSet && item.product.customSetItems) {
        // Для виртуальных наборов считаем сумму всех входящих товаров
        const setTotal = item.product.customSetItems.reduce((setSum, setItem) => 
          setSum + setItem.product.price * setItem.quantity, 0
        );
        return total + setTotal * item.quantity;
      }
      return total + item.product.price * item.quantity;
    }, 0);
    console.log('💰 Total price:', total);
    return total;
  };

  const getTotalItems = () => {
    const total = cart.reduce((total, item) => {
      if (item.product.isCustomSet && item.product.customSetItems) {
        // Для виртуальных наборов считаем общее количество входящих товаров
        const setItemsCount = item.product.customSetItems.reduce((setSum, setItem) => 
          setSum + setItem.quantity, 0
        );
        return total + setItemsCount * item.quantity;
      }
      return total + item.quantity;
    }, 0);
    console.log('🔢 Total items:', total);
    return total;
  };

  const clearCart = () => {
    console.log('🧹 Clearing cart');
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  console.log('🔄 useCart hook state - cart:', cart, 'totalItems:', getTotalItems());

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart
  };
};