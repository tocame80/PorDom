import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Создайте гармоничное пространство',
    subtitle: 'Порядок в доме — порядок в жизни',
    description: 'Откройте для себя секреты идеального дома с нашими книгами, ароматными свечами и профессиональными услугами',
    image: 'https://images.pexels.com/photos/4792488/pexels-photo-4792488.jpeg?auto=compress&cs=tinysrgb&w=1200',
    cta: 'Начать покупки',
    bg: 'from-sage-50 to-cream-100'
  },
  {
    id: 2,
    title: 'Новая коллекция свечей',
    subtitle: 'Ароматы для вашего дома',
    description: 'Натуральные соевые свечи с эфирными маслами для создания уютной атмосферы',
    image: 'https://images.pexels.com/photos/6454579/pexels-photo-6454579.jpeg?auto=compress&cs=tinysrgb&w=1200',
    cta: 'Смотреть коллекцию',
    bg: 'from-cream-50 to-sage-100'
  },
  {
    id: 3,
    title: 'Персональная консультация',
    subtitle: 'Организация пространства',
    description: 'Профессиональная помощь в создании функционального и красивого интерьера',
    image: 'https://images.pexels.com/photos/6956993/pexels-photo-6956993.jpeg?auto=compress&cs=tinysrgb&w=1200',
    cta: 'Записаться',
    bg: 'from-terracotta-50 to-cream-100'
  }
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[60vh] min-h-[450px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`} />
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <Sparkles className="h-5 w-5 text-sage-600 mr-2" />
                  <span className="text-sage-600 font-medium text-sm uppercase tracking-wide">
                    {slide.subtitle}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-sage-800 mb-6 leading-tight">
                  {slide.title}
                </h1>
                
                <p className="text-lg md:text-xl text-sage-600 mb-8 max-w-lg mx-auto lg:mx-0">
                  {slide.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button className="bg-sage-600 text-white px-8 py-3 rounded-lg hover:bg-sage-700 transition-all duration-300 transform hover:scale-105 font-medium">
                    {slide.cta}
                  </button>
                  <button className="border-2 border-sage-600 text-sage-600 px-8 py-3 rounded-lg hover:bg-sage-600 hover:text-white transition-all duration-300 font-medium">
                    Узнать больше
                  </button>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start mt-8 space-x-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sage-600 ml-2 text-sm">4.9 из 5</span>
                  </div>
                  <span className="text-sage-400">|</span>
                  <span className="text-sage-600 text-sm">500+ довольных клиентов</span>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-sage-200 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-terracotta-200 rounded-full opacity-60 animate-pulse animation-delay-300"></div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-sage-600 w-8' : 'bg-sage-300 hover:bg-sage-400'
            }`}
          />
        ))}
      </div>

      {/* Arrow controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-sage-600 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-sage-600 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  );
};