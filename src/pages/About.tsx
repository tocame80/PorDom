import React from 'react';
import { Heart, Users, Award, Leaf, Clock, MapPin, Phone, Mail } from 'lucide-react';

export const About: React.FC = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-sage-600" />,
      title: 'Любовь к деталям',
      description: 'Каждый товар выбран с особой тщательностью и вниманием к качеству'
    },
    {
      icon: <Leaf className="h-8 w-8 text-sage-600" />,
      title: 'Экологичность',
      description: 'Мы отдаем предпочтение натуральным и экологически чистым материалам'
    },
    {
      icon: <Users className="h-8 w-8 text-sage-600" />,
      title: 'Забота о клиентах',
      description: 'Ваш комфорт и удовлетворение - наш главный приоритет'
    },
    {
      icon: <Award className="h-8 w-8 text-sage-600" />,
      title: 'Качество',
      description: 'Работаем только с проверенными производителями и брендами'
    }
  ];

  const team = [
    {
      name: 'Анна Петрова',
      role: 'Основатель и куратор',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Эксперт по организации пространства с 10-летним опытом'
    },
    {
      name: 'Мария Сидорова',
      role: 'Консультант по ароматам',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Специалист по ароматерапии и созданию уютной атмосферы'
    },
    {
      name: 'Елена Иванова',
      role: 'Дизайнер интерьеров',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Помогает создавать гармоничные и функциональные пространства'
    }
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-sage-800 mb-6">
              О нас
            </h1>
            <p className="text-xl text-sage-600 max-w-3xl mx-auto leading-relaxed">
              Мы создаем пространства, где каждая деталь способствует гармонии и уюту. 
              Наша миссия — помочь вам превратить дом в место силы и вдохновения.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-sage-800 mb-6">
                Наша история
              </h2>
              <div className="space-y-4 text-sage-700 leading-relaxed">
                <p>
                  Все началось с простого желания — создать дом, где каждый предмет 
                  имеет свое место и назначение. Мы поняли, что порядок в доме 
                  действительно создает порядок в жизни.
                </p>
                <p>
                  За годы работы мы собрали коллекцию товаров, которые не просто 
                  красивы, но и функциональны. Каждый предмет в нашем каталоге 
                  прошел проверку временем и нашим личным опытом.
                </p>
                <p>
                  Сегодня "Порядочный Дом" — это не просто магазин, а сообщество 
                  людей, которые ценят качество, красоту и гармонию в повседневной жизни.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/6444241/pexels-photo-6444241.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Наша история"
                className="rounded-xl shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-sage-600 text-white p-6 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm">довольных клиентов</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-800 mb-4">
              Наши ценности
            </h2>
            <p className="text-sage-600 max-w-2xl mx-auto">
              Принципы, которыми мы руководствуемся в работе
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-sage-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-sage-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-sage-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-800 mb-4">
              Наша команда
            </h2>
            <p className="text-sage-600 max-w-2xl mx-auto">
              Профессионалы, которые помогут вам создать дом мечты
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-sage-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sage-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sage-700 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-sage-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Свяжитесь с нами
              </h2>
              <p className="text-sage-100 mb-8 leading-relaxed">
                Мы всегда готовы ответить на ваши вопросы и помочь с выбором. 
                Наши консультанты с радостью поделятся опытом и дадут персональные рекомендации.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-sage-300" />
                  <span>Москва, ул. Гармонии, 15</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-sage-300" />
                  <span>+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-sage-300" />
                  <span>info@poryadochnydom.ru</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-sage-300" />
                  <span>Пн-Пт: 10:00-19:00, Сб: 10:00-17:00</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-6">Напишите нам</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg placeholder-sage-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg placeholder-sage-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Ваше сообщение"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg placeholder-sage-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-sage-600 py-3 rounded-lg hover:bg-sage-50 transition-colors font-medium"
                >
                  Отправить сообщение
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};