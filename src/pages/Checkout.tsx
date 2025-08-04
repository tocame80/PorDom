import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, MapPin, Phone, Mail, User, Calendar, Clock } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { CDEKService, CDEKDeliveryOption, deliveryUtils } from '../utils/cdek';

interface CheckoutProps {
  onBack: () => void;
}

interface OrderData {
  // Контактная информация
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Доставка
  deliveryType: 'delivery' | 'pickup';
  address: string;
  city: string;
  postalCode: string;
  deliveryDate: string;
  deliveryTime: string;
  
  // Оплата
  paymentMethod: 'card' | 'cash' | 'transfer';
  
  // Дополнительно
  comment: string;
}

export const Checkout: React.FC<CheckoutProps> = ({ onBack }) => {
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryOptions, setDeliveryOptions] = useState<CDEKDeliveryOption[]>([]);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<CDEKDeliveryOption | null>(null);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);
  const [citySearchResults, setCitySearchResults] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  
  const [orderData, setOrderData] = useState<OrderData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    deliveryType: 'delivery',
    address: '',
    city: 'Москва',
    postalCode: '',
    deliveryDate: '',
    deliveryTime: '',
    paymentMethod: 'card',
    comment: ''
  });

  const deliveryPrice = selectedDeliveryOption ? selectedDeliveryOption.delivery_sum : 
                       (orderData.deliveryType === 'delivery' && getTotalPrice() < 2000 ? 300 : 0);
  const totalPrice = getTotalPrice() + deliveryPrice;

  const handleInputChange = (field: keyof OrderData, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
    
    // Поиск города при изменении поля города
    if (field === 'city' && value.length > 2) {
      searchCities(value);
    }
  };

  const searchCities = async (cityName: string) => {
    try {
      const cities = await CDEKService.findCity(cityName);
      setCitySearchResults(cities.slice(0, 5)); // Показываем только первые 5 результатов
    } catch (error) {
      console.error('Ошибка поиска городов:', error);
      setCitySearchResults([]);
    }
  };

  const selectCity = (city: any) => {
    setSelectedCity(city);
    setOrderData(prev => ({ ...prev, city: city.city }));
    setCitySearchResults([]);
    
    // Автоматически рассчитываем доставку при выборе города
    if (orderData.deliveryType === 'delivery') {
      calculateDelivery(city.code);
    }
  };

  const calculateDelivery = async (toCityCode: number) => {
    setIsCalculatingDelivery(true);
    try {
      const fromCityCode = 44; // Москва (код города отправителя)
      const orderWeight = deliveryUtils.calculateOrderWeight(cart);
      
      const options = await CDEKService.calculateDelivery(
        fromCityCode,
        toCityCode,
        orderWeight
      );
      
      setDeliveryOptions(options);
      
      // Автоматически выбираем первый вариант доставки
      if (options.length > 0) {
        setSelectedDeliveryOption(options[0]);
      }
    } catch (error) {
      console.error('Ошибка расчета доставки:', error);
      // Устанавливаем базовую стоимость доставки в случае ошибки
      setDeliveryOptions([]);
      setSelectedDeliveryOption(null);
    } finally {
      setIsCalculatingDelivery(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(orderData.firstName && orderData.lastName && orderData.email && orderData.phone);
      case 2:
        if (orderData.deliveryType === 'delivery') {
          return !!(orderData.address && orderData.city && orderData.deliveryDate);
        }
        return !!orderData.deliveryDate;
      case 3:
        return !!orderData.paymentMethod;
      default:
        return true;
    }
  };

  const submitOrder = async () => {
    setIsSubmitting(true);
    
    try {
      const order = {
        id: `ORDER-${Date.now()}`,
        date: new Date().toISOString(),
        customer: {
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          email: orderData.email,
          phone: orderData.phone
        },
        items: cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity
        })),
        delivery: {
          type: orderData.deliveryType,
          address: orderData.deliveryType === 'delivery' ? 
            `${orderData.city}, ${orderData.address}, ${orderData.postalCode}` : 
            'Самовывоз: Москва, ул. Гармонии, 15',
          date: orderData.deliveryDate,
          time: orderData.deliveryTime,
          price: deliveryPrice
        },
        payment: {
          method: orderData.paymentMethod,
          amount: totalPrice
        },
        comment: orderData.comment,
        status: 'pending'
      };

      // Отправляем заказ в Telegram
      await sendToTelegram(order);
      
      // Отправляем email уведомление
      await sendEmailNotification(order);
      
      // Если выбрана оплата картой, перенаправляем на оплату
      if (orderData.paymentMethod === 'card') {
        // Здесь будет интеграция с платежной системой
        window.open(generatePaymentLink(order), '_blank');
      }
      
      // Очищаем корзину
      clearCart();
      
      // Показываем успешное сообщение
      showSuccessNotification(order);
      
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      showErrorNotification();
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendToTelegram = async (order: any) => {
    const botToken = 'YOUR_BOT_TOKEN'; // Замените на ваш токен бота
    const chatId = 'YOUR_CHAT_ID'; // Замените на ваш chat_id
    
    const message = `
🛒 *НОВЫЙ ЗАКАЗ #${order.id}*

👤 *Клиент:*
${order.customer.firstName} ${order.customer.lastName}
📧 ${order.customer.email}
📱 ${order.customer.phone}

📦 *Товары:*
${order.items.map((item: any) => `• ${item.name} x${item.quantity} = ${item.total.toLocaleString()} ₽`).join('\n')}

🚚 *Доставка:*
${order.delivery.type === 'delivery' ? '🏠 Доставка' : '🏪 Самовывоз'}
📍 ${order.delivery.address}
📅 ${order.delivery.date} ${order.delivery.time}
💰 ${order.delivery.price} ₽

💳 *Оплата:* ${order.payment.method === 'card' ? '💳 Картой' : order.payment.method === 'cash' ? '💵 Наличными' : '🏦 Переводом'}

💰 *ИТОГО: ${order.payment.amount.toLocaleString()} ₽*

${order.comment ? `💬 *Комментарий:* ${order.comment}` : ''}
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  };

  const sendEmailNotification = async (order: any) => {
    // Здесь можно использовать EmailJS или другой сервис
    console.log('Отправка email уведомления:', order);
  };

  const generatePaymentLink = (order: any): string => {
    // Интеграция с ЮKassa, Stripe или другой платежной системой
    const paymentData = {
      amount: order.payment.amount,
      currency: 'RUB',
      description: `Заказ #${order.id} в магазине Порядочный Дом`,
      orderId: order.id,
      customerEmail: order.customer.email
    };
    
    // Пример для ЮKassa
    return `https://yookassa.ru/checkout?${new URLSearchParams({
      shopId: 'YOUR_SHOP_ID',
      sum: paymentData.amount.toString(),
      orderNumber: paymentData.orderId,
      customerEmail: paymentData.customerEmail,
      paymentType: 'AC'
    }).toString()}`;
  };

  const showSuccessNotification = (order: any) => {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 20px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        z-index: 1000;
        font-family: system-ui;
        font-size: 15px;
        font-weight: 500;
        animation: slideIn 0.4s ease-out;
        max-width: 350px;
      ">
        ✅ Заказ успешно оформлен!
        <div style="font-size: 13px; opacity: 0.9; margin-top: 8px;">
          Номер заказа: ${order.id}<br>
          Мы свяжемся с вами в ближайшее время
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
    }, 6000);
  };

  const showErrorNotification = () => {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
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
        ❌ Ошибка при оформлении заказа
        <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
          Попробуйте еще раз или свяжитесь с нами
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
    }, 5000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-sage-800 mb-4">Контактная информация</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-2">
            Имя *
          </label>
          <input
            type="text"
            required
            value={orderData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
            placeholder="Ваше имя"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-2">
            Фамилия *
          </label>
          <input
            type="text"
            required
            value={orderData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
            placeholder="Ваша фамилия"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-sage-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          required
          value={orderData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
          placeholder="your@email.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-sage-700 mb-2">
          Телефон *
        </label>
        <input
          type="tel"
          required
          value={orderData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
          placeholder="+7 (999) 123-45-67"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-sage-800 mb-4">Доставка</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="deliveryType"
              value="delivery"
              checked={orderData.deliveryType === 'delivery'}
              onChange={(e) => handleInputChange('deliveryType', e.target.value)}
              className="mr-2"
            />
            <Truck className="h-4 w-4 mr-2 text-sage-600" />
            <span>Доставка курьером</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="deliveryType"
              value="pickup"
              checked={orderData.deliveryType === 'pickup'}
              onChange={(e) => handleInputChange('deliveryType', e.target.value)}
              className="mr-2"
            />
            <MapPin className="h-4 w-4 mr-2 text-sage-600" />
            <span>Самовывоз</span>
          </label>
        </div>
        
        {orderData.deliveryType === 'delivery' && (
          <>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Город *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={orderData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                  placeholder="Начните вводить название города..."
                />
                
                {/* Выпадающий список городов */}
                {citySearchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-sage-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {citySearchResults.map((city, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectCity(city)}
                        className="w-full px-3 py-2 text-left hover:bg-sage-50 focus:bg-sage-50 focus:outline-none"
                      >
                        <div className="font-medium text-sage-800">{city.city}</div>
                        <div className="text-sm text-sage-600">{city.region}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Адрес доставки *
              </label>
              <input
                type="text"
                required
                value={orderData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                placeholder="Улица, дом, квартира"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Индекс
              </label>
              <input
                type="text"
                value={orderData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                placeholder="123456"
              />
            </div>
            
            {/* Варианты доставки CDEK */}
            {orderData.deliveryType === 'delivery' && selectedCity && (
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Способ доставки
                </label>
                
                {isCalculatingDelivery ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sage-600"></div>
                    <span className="ml-2 text-sage-600">Рассчитываем доставку...</span>
                  </div>
                ) : deliveryOptions.length > 0 ? (
                  <div className="space-y-2">
                    {deliveryOptions.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center p-3 border border-sage-300 rounded-lg hover:bg-sage-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="deliveryOption"
                          checked={selectedDeliveryOption?.delivery_mode === option.delivery_mode}
                          onChange={() => setSelectedDeliveryOption(option)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">
                                {deliveryUtils.getDeliveryIcon(option.delivery_mode)}
                              </span>
                              <div>
                                <div className="font-medium text-sage-800">
                                  {option.service_name}
                                </div>
                                <div className="text-sm text-sage-600">
                                  {deliveryUtils.formatDeliveryPeriod(option.period_min, option.period_max)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-sage-800">
                                {option.delivery_sum.toLocaleString()} ₽
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : selectedCity && (
                  <div className="text-center py-4 text-sage-600">
                    <p>Не удалось рассчитать доставку для выбранного города</p>
                    <p className="text-sm">Стоимость доставки: 300 ₽</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {orderData.deliveryType === 'pickup' && (
          <div className="bg-sage-50 p-4 rounded-lg">
            <h4 className="font-medium text-sage-800 mb-2">Адрес магазина:</h4>
            <p className="text-sage-600">Москва, ул. Гармонии, 15</p>
            <p className="text-sage-600">Режим работы: Пн-Пт 10:00-19:00, Сб 10:00-17:00</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Дата {orderData.deliveryType === 'delivery' ? 'доставки' : 'получения'} *
            </label>
            <input
              type="date"
              required
              value={orderData.deliveryDate}
              onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Время
            </label>
            <select
              value={orderData.deliveryTime}
              onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
              className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              <option value="">Любое время</option>
              <option value="10:00-14:00">10:00 - 14:00</option>
              <option value="14:00-18:00">14:00 - 18:00</option>
              <option value="18:00-21:00">18:00 - 21:00</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-sage-800 mb-4">Способ оплаты</h3>
      
      <div className="space-y-3">
        <label className="flex items-center p-4 border border-sage-300 rounded-lg hover:bg-sage-50 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={orderData.paymentMethod === 'card'}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
            className="mr-3"
          />
          <CreditCard className="h-5 w-5 mr-3 text-sage-600" />
          <div>
            <div className="font-medium text-sage-800">Банковской картой</div>
            <div className="text-sm text-sage-600">Visa, MasterCard, МИР</div>
          </div>
        </label>
        
        <label className="flex items-center p-4 border border-sage-300 rounded-lg hover:bg-sage-50 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={orderData.paymentMethod === 'cash'}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
            className="mr-3"
          />
          <div className="h-5 w-5 mr-3 text-sage-600 text-center">💵</div>
          <div>
            <div className="font-medium text-sage-800">Наличными</div>
            <div className="text-sm text-sage-600">При получении заказа</div>
          </div>
        </label>
        
        <label className="flex items-center p-4 border border-sage-300 rounded-lg hover:bg-sage-50 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="transfer"
            checked={orderData.paymentMethod === 'transfer'}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
            className="mr-3"
          />
          <div className="h-5 w-5 mr-3 text-sage-600 text-center">🏦</div>
          <div>
            <div className="font-medium text-sage-800">Банковским переводом</div>
            <div className="text-sm text-sage-600">По реквизитам</div>
          </div>
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-sage-700 mb-2">
          Комментарий к заказу
        </label>
        <textarea
          rows={3}
          value={orderData.comment}
          onChange={(e) => handleInputChange('comment', e.target.value)}
          className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
          placeholder="Дополнительные пожелания..."
        />
      </div>
    </div>
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-sage-800 mb-4">Корзина пуста</h2>
          <button
            onClick={onBack}
            className="bg-sage-600 text-white px-6 py-2 rounded-lg hover:bg-sage-700 transition-colors"
          >
            Вернуться к покупкам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-sage-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-sage-600 hover:text-sage-700 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад
            </button>
            <h1 className="text-2xl font-bold text-sage-800">Оформление заказа</h1>
          </div>
          
          {/* Progress */}
          <div className="flex items-center mt-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-sage-600 text-white' 
                    : 'bg-sage-200 text-sage-600'
                }`}>
                  {step}
                </div>
                <div className={`text-sm ml-2 ${
                  step <= currentStep ? 'text-sage-800' : 'text-sage-500'
                }`}>
                  {step === 1 && 'Контакты'}
                  {step === 2 && 'Доставка'}
                  {step === 3 && 'Оплата'}
                </div>
                {step < 3 && <div className="w-12 h-px bg-sage-200 mx-4" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-2 border border-sage-300 text-sage-600 rounded-lg hover:bg-sage-50 transition-colors"
                  >
                    Назад
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!validateStep(currentStep)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ml-auto ${
                      validateStep(currentStep)
                        ? 'bg-sage-600 text-white hover:bg-sage-700'
                        : 'bg-sage-300 text-sage-500 cursor-not-allowed'
                    }`}
                  >
                    Далее
                  </button>
                ) : (
                  <button
                    onClick={submitOrder}
                    disabled={!validateStep(currentStep) || isSubmitting}
                    className={`px-8 py-2 rounded-lg font-medium transition-colors ml-auto ${
                      validateStep(currentStep) && !isSubmitting
                        ? 'bg-sage-600 text-white hover:bg-sage-700'
                        : 'bg-sage-300 text-sage-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? 'Оформляем...' : 'Оформить заказ'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <h3 className="text-lg font-semibold text-sage-800 mb-4">Ваш заказ</h3>
              
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-sage-700">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {(item.product.price * item.quantity).toLocaleString()} ₽
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-sage-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-sage-600">Товары ({getTotalItems()} шт.)</span>
                  <span>{getTotalPrice().toLocaleString()} ₽</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-sage-600">Доставка</span>
                  <span className={deliveryPrice === 0 ? 'text-green-600' : ''}>
                    {deliveryPrice === 0 ? 'Бесплатно' : 
                     selectedDeliveryOption ? 
                       `${selectedDeliveryOption.service_name}: ${deliveryPrice.toLocaleString()} ₽` :
                       `${deliveryPrice.toLocaleString()} ₽`}
                  </span>
                </div>
                
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-sage-200">
                  <span>Итого</span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
              </div>
              
              {getTotalPrice() < 2000 && orderData.deliveryType === 'delivery' && !selectedDeliveryOption && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  💡 Добавьте товаров на {(2000 - getTotalPrice()).toLocaleString()} ₽ для бесплатной доставки
                </div>
              )}
              
              {selectedDeliveryOption && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm">
                  <div className="flex items-center text-green-700">
                    <span className="mr-2">{deliveryUtils.getDeliveryIcon(selectedDeliveryOption.delivery_mode)}</span>
                    <div>
                      <div className="font-medium">{selectedDeliveryOption.service_name}</div>
                      <div>Срок: {deliveryUtils.formatDeliveryPeriod(selectedDeliveryOption.period_min, selectedDeliveryOption.period_max)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};