import { Service } from '../utils/types';

export const services: Service[] = [
  {
    id: '1',
    name: 'Организация пространства',
    description: 'Профессиональная помощь в организации и структурировании домашнего пространства',
    price: 3500,
    duration: '3 часа',
    image: 'https://images.pexels.com/photos/4792488/pexels-photo-4792488.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Анализ текущего пространства',
      'Индивидуальный план организации',
      'Практические рекомендации',
      'Подбор систем хранения'
    ]
  },
  {
    id: '2',
    name: 'Астрология для дома',
    description: 'Гармонизация пространства с учетом астрологических принципов',
    price: 2800,
    duration: '2 часа',
    image: 'https://images.pexels.com/photos/8197530/pexels-photo-8197530.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Анализ энергетики дома',
      'Подбор благоприятных зон',
      'Рекомендации по цветам',
      'Выбор материалов'
    ]
  },
  {
    id: '3',
    name: 'Психология комфорта',
    description: 'Создание уютной атмосферы, способствующей эмоциональному благополучию',
    price: 3200,
    duration: '2.5 часа',
    image: 'https://images.pexels.com/photos/6956993/pexels-photo-6956993.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Психологический анализ пространства',
      'Работа с эмоциональными триггерами',
      'Создание зон комфорта',
      'Рекомендации по освещению'
    ]
  }
];