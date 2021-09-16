import { Period } from '../models/period.model';

export const periodsToAnalyze: Period[] = [
  {
    name: 'COVID',
    yearlyInflation: 1.2,
    startDate: new Date(2020, 1, 1),
    endDate: new Date(2020, 3, 1),
  },
  {
    name: '08',
    yearlyInflation: 2.1,
    startDate: new Date(2007, 11, 1),
    endDate: new Date(2009, 5, 1),
  },
  {
    name: 'Early 2000s',
    yearlyInflation: 1.6,
    startDate: new Date(2001, 2, 1),
    endDate: new Date(2001, 10, 1),
  },
  {
    name: 'Early 90s',
    yearlyInflation: 4.6,
    startDate: new Date(1990, 6, 1),
    endDate: new Date(1991, 2, 1),
  },
  {
    name: 'Black Monday',
    yearlyInflation: 4.4,
    startDate: new Date(1987, 9, 19),
    endDate: new Date(1987, 10, 19),
  },
  {
    name: '73-74',
    yearlyInflation: 9.3,
    startDate: new Date(1973, 0, 11),
    endDate: new Date(1974, 11, 6),
  },
];
