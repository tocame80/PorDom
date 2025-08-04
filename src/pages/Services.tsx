import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, Check } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { services } from '../data/services';
import { Service } from '../utils/types';

export const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  });

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setShowBookingForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', { service: selectedService, ...formData });
    setShowBookingForm(false);
    setSelectedService(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-sage-800 mb-4">
              Наши услуги
            </h1>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">
              Профессиональная помощь в создании гармоничного пространства, 
              где каждый элемент находится на своем месте
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBookService={handleBookService}
            />
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-800 mb-4">
              Как проходит консультация
            </h2>
            <p className="text-sage-600 max-w-2xl mx-auto">
              Простой и понятный процесс, который приведет вас к идеальному результату
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Заявка',
                description: 'Оставьте заявку на сайте или позвоните нам'
              },
              {
                step: '02',
                title: 'Консультация',
                description: 'Обсуждаем ваши потребности и пожелания'
              },
              {
                step: '03',
                title: 'Планирование',
                description: 'Составляем индивидуальный план работы'
              },
              {
                step: '04',
                title: 'Результат',
                description: 'Получаете готовое решение и рекомендации'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-sage-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-sage-600 font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-sage-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sage-600 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-sage-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-sage-800 mb-6">
                Свяжитесь с нами
              </h2>
              <p className="text-sage-600 mb-8">
                Готовы обсудить ваш проект? Выберите удобный способ связи
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-sage-600 mr-3" />
                  <span className="text-sage-700">+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-sage-600 mr-3" />
                  <span className="text-sage-700">info@poryadochnydom.ru</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-sage-600 mr-3" />
                  <span className="text-sage-700">Москва, ул. Гармонии, 15</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-sage-600 mr-3" />
                  <span className="text-sage-700">Пн-Пт: 10:00-19:00, Сб: 10:00-17:00</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold text-sage-800 mb-6">
                Быстрая запись
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Услуга
                  </label>
                  <select className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500">
                    <option>Выберите услугу</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Сообщение
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                    placeholder="Расскажите о ваших потребностях..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-sage-600 text-white py-3 rounded-lg hover:bg-sage-700 transition-colors font-medium"
                >
                  Отправить заявку
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-sage-800 mb-4">
              Запись на: {selectedService.name}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Имя *
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
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Дата *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Время *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Комментарий
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 border border-sage-300 text-sage-600 py-2 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sage-600 text-white py-2 rounded-lg hover:bg-sage-700 transition-colors"
                >
                  Записаться
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};