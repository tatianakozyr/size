import { ChartCategory } from './types';

export const APP_STEPS = {
  INPUT: 'input',
  ANALYZING: 'analyzing',
  RESULT: 'result',
} as const;

export const DEFAULT_CHARTS: ChartCategory[] = [
  {
    id: 'universal',
    name: 'Універсальна таблиця',
    data: [
      { int: 'XS', ua_eu: '44', height: '166-170', chest: '86-90', waist: '74-78', hips: '88-92' },
      { int: 'S', ua_eu: '46', height: '170-176', chest: '90-94', waist: '78-82', hips: '92-96' },
      { int: 'M', ua_eu: '48', height: '176-182', chest: '94-98', waist: '82-86', hips: '96-100' },
      { int: 'L', ua_eu: '50', height: '182-186', chest: '98-102', waist: '86-90', hips: '100-104' },
      { int: 'XL', ua_eu: '52', height: '184-188', chest: '102-106', waist: '90-96', hips: '104-108' },
      { int: 'XXL', ua_eu: '54', height: '186-190', chest: '106-110', waist: '96-102', hips: '108-112' },
    ]
  },
  {
    id: 'mens_jackets',
    name: 'Чоловічі куртки',
    data: [
      { size: '46', height: '170', chest: '92', sleeve: '62' },
      { size: '48', height: '176', chest: '96', sleeve: '64' },
      { size: '50', height: '182', chest: '100', sleeve: '66' },
      { size: '52', height: '188', chest: '104', sleeve: '68' },
      { size: '54', height: '188', chest: '108', sleeve: '69' },
      { size: '56', height: '194', chest: '112', sleeve: '70' },
    ]
  },
  {
    id: 'sportswear',
    name: 'Спортивні костюми',
    data: [
      { size: 'S', height: '168-175', weight: '60-70', chest: '88-92' },
      { size: 'M', height: '175-180', weight: '70-80', chest: '96-100' },
      { size: 'L', height: '180-185', weight: '80-90', chest: '104-108' },
      { size: 'XL', height: '185-190', weight: '90-100', chest: '112-116' },
      { size: 'XXL', height: '190+', weight: '100+', chest: '120+' },
    ]
  }
];