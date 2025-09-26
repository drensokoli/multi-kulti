export interface FoodDrink {
  name: string;
  description: string;
  image: string;
}

export interface Culture {
  traditional_arts: string;
  traditional_music: string;
  traditional_clothing: string;
  traditional_beliefs: string;
}

export interface FamousPerson {
  name: string;
  description: string;
  image: string;
}

export interface Landmark {
  name: string;
  description: string;
  image: string;
}

export interface Currency {
  name: string;
  symbol: string;
}

export interface LifeIn {
  cost_of_living: string;
  quality_of_life: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  flag: string;
  lat: string;
  lng: string;
  images: string[];
  timezones: string[];
  currency: Currency;
  city_size: string;
  population_size: string;
  population_diversity: string;
  languages: string[];
  religions: string[];
  culture: Culture;
  traditional_foods: FoodDrink[];
  traditional_drinks: FoodDrink[];
  history: string;
  adversity_resilience: string;
  famous_people: FamousPerson[];
  economy_industry: string;
  tourism_attractions: string;
  landmarks: Landmark[];
  sister_cities: string[];
  life_in: LifeIn;
  fun_fact: string;
}
