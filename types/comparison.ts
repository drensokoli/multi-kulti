import { City } from './index';

export interface CityComparison {
  cities: string[];
  overview: string;
  population_diversity: string;
  culture_lifestyle: string;
  history_resilience: string;
  modern_life_and_economy: string;
  life_in_city: string;
}

export interface ComparisonSection {
  key: keyof City;
  title: string;
  content: string;
}

export function getCityComparison(city: City): ComparisonSection[] {
  return [
    {
      key: 'population_diversity',
      title: 'Population & Diversity',
      content: city.population_diversity
    },
    {
      key: 'history',
      title: 'History',
      content: city.history
    },
    {
      key: 'adversity_resilience',
      title: 'Adversity & Resilience',
      content: city.adversity_resilience
    },
    {
      key: 'economy_industry',
      title: 'Economy & Industry',
      content: city.economy_industry
    },
    {
      key: 'tourism_attractions',
      title: 'Tourism & Attractions',
      content: city.tourism_attractions
    }
  ];
}
