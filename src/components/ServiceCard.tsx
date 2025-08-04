import React from 'react';
import { Clock, Check, ArrowRight } from 'lucide-react';
import { Service } from '../utils/types';

interface ServiceCardProps {
  service: Service;
  onBookService?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookService }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-lg font-bold text-sage-600">
            {service.price.toLocaleString()} ₽
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-sage-800 mb-2">
          {service.name}
        </h3>
        
        <p className="text-sage-600 mb-4 leading-relaxed">
          {service.description}
        </p>
        
        <div className="flex items-center mb-4 text-sage-600">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">Длительность: {service.duration}</span>
        </div>
        
        <div className="space-y-2 mb-6">
          {service.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-sage-700">{feature}</span>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => onBookService && onBookService(service)}
          className="w-full bg-sage-600 text-white py-3 rounded-lg hover:bg-sage-700 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center group"
        >
          <span>Записаться на консультацию</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};