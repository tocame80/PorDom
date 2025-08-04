// CDEK API integration for delivery calculation
export interface CDEKCity {
  code: number;
  city: string;
  region: string;
  country_code: string;
}

export interface CDEKDeliveryOption {
  delivery_mode: number;
  delivery_sum: number;
  period_min: number;
  period_max: number;
  service_name: string;
}

export interface CDEKCalculationRequest {
  version: string;
  dateExecute: string;
  senderCityId: number;
  receiverCityId: number;
  tariffId: number;
  goods: Array<{
    weight: number;
    length: number;
    width: number;
    height: number;
  }>;
}

export class CDEKService {
  private static readonly API_URL = 'https://api.cdek.ru/v2';
  private static readonly TEST_API_URL = 'https://api.edu.cdek.ru/v2';
  private static readonly CLIENT_ID = 'EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI'; // Тестовый аккаунт
  private static readonly CLIENT_SECRET = 'PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG'; // Тестовый аккаунт
  
  private static accessToken: string | null = null;
  private static tokenExpiry: number = 0;

  // Получение токена авторизации
  static async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.TEST_API_URL}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.CLIENT_ID,
          client_secret: this.CLIENT_SECRET,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get CDEK access token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Обновляем за минуту до истечения

      return this.accessToken;
    } catch (error) {
      console.error('CDEK Auth Error:', error);
      throw error;
    }
  }

  // Поиск города по названию
  static async findCity(cityName: string): Promise<CDEKCity[]> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `${this.TEST_API_URL}/location/cities?city=${encodeURIComponent(cityName)}&size=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search cities');
      }

      return await response.json();
    } catch (error) {
      console.error('CDEK City Search Error:', error);
      return [];
    }
  }

  // Расчет стоимости доставки
  static async calculateDelivery(
    fromCityCode: number,
    toCityCode: number,
    weight: number = 1000, // вес в граммах
    dimensions: { length: number; width: number; height: number } = { length: 30, width: 20, height: 10 }
  ): Promise<CDEKDeliveryOption[]> {
    try {
      const token = await this.getAccessToken();
      
      const requestData = {
        type: 1, // Интернет-магазин
        from_location: {
          code: fromCityCode
        },
        to_location: {
          code: toCityCode
        },
        packages: [
          {
            weight: weight,
            length: dimensions.length,
            width: dimensions.width,
            height: dimensions.height
          }
        ]
      };

      const response = await fetch(`${this.TEST_API_URL}/calculator/tarifflist`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('CDEK API Error Response:', errorText);
        throw new Error('Failed to calculate delivery');
      }

      const data = await response.json();
      
      // Преобразуем ответ в нужный формат
      return data.tariff_codes?.map((tariff: any) => ({
        delivery_mode: tariff.tariff_code,
        delivery_sum: tariff.delivery_sum || 0,
        period_min: tariff.period_min || 1,
        period_max: tariff.period_max || 3,
        service_name: tariff.tariff_name || 'Доставка CDEK'
      })) || [];
    } catch (error) {
      console.error('CDEK Calculation Error:', error);
      // Возвращаем базовые тарифы в случае ошибки
      return [
        {
          delivery_mode: 136,
          delivery_sum: 300,
          period_min: 2,
          period_max: 4,
          service_name: 'Посылка склад-склад'
        },
        {
          delivery_mode: 137,
          delivery_sum: 450,
          period_min: 1,
          period_max: 3,
          service_name: 'Посылка склад-дверь'
        }
      ];
    }
  }

  // Получение списка пунктов выдачи
  static async getPickupPoints(cityCode: number): Promise<any[]> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `${this.TEST_API_URL}/deliverypoints?city_code=${cityCode}&type=PVZ`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get pickup points');
      }

      return await response.json();
    } catch (error) {
      console.error('CDEK Pickup Points Error:', error);
      return [];
    }
  }
}

// Утилиты для работы с доставкой
export const deliveryUtils = {
  // Расчет общего веса заказа (примерный)
  calculateOrderWeight: (items: any[]): number => {
    return items.reduce((total, item) => {
      // Примерный вес товаров в граммах
      const itemWeight = item.product.category === 'books' ? 300 : 
                        item.product.category === 'candles' ? 200 :
                        item.product.category === 'sachets' ? 50 : 500;
      return total + (itemWeight * item.quantity);
    }, 0);
  },

  // Форматирование периода доставки
  formatDeliveryPeriod: (min: number, max: number): string => {
    if (min === max) {
      return `${min} ${min === 1 ? 'день' : min < 5 ? 'дня' : 'дней'}`;
    }
    return `${min}-${max} ${max < 5 ? 'дня' : 'дней'}`;
  },

  // Получение иконки для типа доставки
  getDeliveryIcon: (mode: number): string => {
    switch (mode) {
      case 136: return '📦'; // Склад-склад
      case 137: return '🚚'; // Склад-дверь
      case 138: return '🏪'; // Дверь-склад
      case 139: return '🚛'; // Дверь-дверь
      default: return '📮';
    }
  }
};