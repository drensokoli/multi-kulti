"use client";

import React from 'react';
import { 
  X, Users, Utensils, History, Shield, Building2, Mountain, GraduationCap, 
  Globe2, Landmark, UsersRound, Music2, Trophy, Star, Sparkles, Heart 
} from 'lucide-react';

interface City {
  id: string;
  name: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
  population_size: string;
  culture: string;
  food: string;
  history: string;
  adversity_resilience: string;
  economy_industry: string;
  environment_geography: string;
  education_innovation: string;
  cooperation_global_ties: string;
  tourism_attractions: string;
  population_diversity: string;
  arts_music_scene: string;
  sports_recreation: string;
  famous_people: string;
  fun_fact: string;
}

interface CityModalProps {
  city: City | null;
  isOpen: boolean;
  onClose: () => void;
  onCompare: (city: City) => void;
  isCompareMode: boolean;
}

const CityModal: React.FC<CityModalProps> = ({ 
  city, 
  isOpen, 
  onClose, 
  onCompare,
  isCompareMode 
}) => {
  if (!city) return null;

  // Helper function to format population numbers
  const formatPopulation = (population: string): string => {
    const num = parseInt(population);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Helper function to get country flag emoji
  const getCountryFlag = (country: string): string => {
    const flagMap: { [key: string]: string } = {
      'Kosovo': '🇽🇰',
      'Bosnia & Herzegovina': '🇧🇦',
      'Albania': '🇦🇱',
      'North Macedonia': '🇲🇰',
      'Montenegro': '🇲🇪',
      'Serbia': '🇷🇸',
      'Croatia': '🇭🇷',
      'Slovenia': '🇸🇮',
      'Bulgaria': '🇧🇬',
      'Romania': '🇷🇴',
      'Greece': '🇬🇷',
      'Turkey': '🇹🇷',
      'Italy': '🇮🇹',
      'Austria': '🇦🇹',
      'Hungary': '🇭🇺',
      'Slovakia': '🇸🇰',
      'Czech Republic': '🇨🇿',
      'Poland': '🇵🇱',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Spain': '🇪🇸',
      'Portugal': '🇵🇹',
      'United Kingdom': '🇬🇧',
      'Ireland': '🇮🇪',
      'Netherlands': '🇳🇱',
      'Belgium': '🇧🇪',
      'Luxembourg': '🇱🇺',
      'Switzerland': '🇨🇭',
      'Liechtenstein': '🇱🇮',
      'Monaco': '🇲🇨',
      'Andorra': '🇦🇩',
      'San Marino': '🇸🇲',
      'Vatican City': '🇻🇦',
      'Malta': '🇲🇹',
      'Côte d\'Ivoire': '🇨🇮',
      'Cyprus': '🇨🇾',
      'Iceland': '🇮🇸',
      'Norway': '🇳🇴',
      'Sweden': '🇸🇪',
      'Finland': '🇫🇮',
      'Denmark': '🇩🇰',
      'Estonia': '🇪🇪',
      'Latvia': '🇱🇻',
      'Lithuania': '🇱🇹',
      'Belarus': '🇧🇾',
      'Ukraine': '🇺🇦',
      'Moldova': '🇲🇩',
      'Russia': '🇷🇺',
      'Georgia': '🇬🇪',
      'Armenia': '🇦🇲',
      'Azerbaijan': '🇦🇿',
      'Kazakhstan': '🇰🇿',
      'Uzbekistan': '🇺🇿',
      'Turkmenistan': '🇹🇲',
      'Tajikistan': '🇹🇯',
      'Kyrgyzstan': '🇰🇬',
      'Afghanistan': '🇦🇫',
      'Pakistan': '🇵🇰',
      'India': '🇮🇳',
      'Nepal': '🇳🇵',
      'Bhutan': '🇧🇹',
      'Bangladesh': '🇧🇩',
      'Sri Lanka': '🇱🇰',
      'Maldives': '🇲🇻',
      'Myanmar': '🇲🇲',
      'Thailand': '🇹🇭',
      'Laos': '🇱🇦',
      'Vietnam': '🇻🇳',
      'Cambodia': '🇰🇭',
      'Malaysia': '🇲🇾',
      'Singapore': '🇸🇬',
      'Indonesia': '🇮🇩',
      'Brunei': '🇧🇳',
      'Philippines': '🇵🇭',
      'Taiwan': '🇹🇼',
      'China': '🇨🇳',
      'Mongolia': '🇲🇳',
      'North Korea': '🇰🇵',
      'South Korea': '🇰🇷',
      'Japan': '🇯🇵',
      'Canada': '🇨🇦',
      'United States': '🇺🇸',
      'Mexico': '🇲🇽',
      'Guatemala': '🇬🇹',
      'Belize': '🇧🇿',
      'El Salvador': '🇸🇻',
      'Honduras': '🇭🇳',
      'Nicaragua': '🇳🇮',
      'Costa Rica': '🇨🇷',
      'Panama': '🇵🇦',
      'Cuba': '🇨🇺',
      'Jamaica': '🇯🇲',
      'Haiti': '🇭🇹',
      'Dominican Republic': '🇩🇴',
      'Puerto Rico': '🇵🇷',
      'Trinidad and Tobago': '🇹🇹',
      'Barbados': '🇧🇧',
      'Saint Lucia': '🇱🇨',
      'Saint Vincent and the Grenadines': '🇻🇨',
      'Grenada': '🇬🇩',
      'Antigua and Barbuda': '🇦🇬',
      'Saint Kitts and Nevis': '🇰🇳',
      'Dominica': '🇩🇲',
      'Brazil': '🇧🇷',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Uruguay': '🇺🇾',
      'Paraguay': '🇵🇾',
      'Bolivia': '🇧🇴',
      'Peru': '🇵🇪',
      'Ecuador': '🇪🇨',
      'Colombia': '🇨🇴',
      'Venezuela': '🇻🇪',
      'Guyana': '🇬🇾',
      'Suriname': '🇸🇷',
      'French Guiana': '🇬🇫',
      'Egypt': '🇪🇬',
      'Libya': '🇱🇾',
      'Tunisia': '🇹🇳',
      'Algeria': '🇩🇿',
      'Morocco': '🇲🇦',
      'Sudan': '🇸🇩',
      'South Sudan': '🇸🇸',
      'Ethiopia': '🇪🇹',
      'Eritrea': '🇪🇷',
      'Djibouti': '🇩🇯',
      'Somalia': '🇸🇴',
      'Kenya': '🇰🇪',
      'Uganda': '🇺🇬',
      'Tanzania': '🇹🇿',
      'Rwanda': '🇷🇼',
      'Burundi': '🇧🇮',
      'Democratic Republic of the Congo': '🇨🇩',
      'Republic of the Congo': '🇨🇬',
      'Central African Republic': '🇨🇫',
      'Chad': '🇹🇩',
      'Cameroon': '🇨🇲',
      'Nigeria': '🇳🇬',
      'Niger': '🇳🇪',
      'Mali': '🇲🇱',
      'Burkina Faso': '🇧🇫',
      'Ghana': '🇬🇭',
      'Togo': '🇹🇬',
      'Benin': '🇧🇯',
      'Senegal': '🇸🇳',
      'Gambia': '🇬🇲',
      'Guinea-Bissau': '🇬🇼',
      'Guinea': '🇬🇳',
      'Sierra Leone': '🇸🇱',
      'Liberia': '🇱🇷',
      'Ivory Coast': '🇨🇮',
      'Mauritania': '🇲🇷',
      'Western Sahara': '🇪🇭',
      'Angola': '🇦🇴',
      'Zambia': '🇿🇲',
      'Zimbabwe': '🇿🇼',
      'Botswana': '🇧🇼',
      'Namibia': '🇳🇦',
      'South Africa': '🇿🇦',
      'Lesotho': '🇱🇸',
      'Swaziland': '🇸🇿',
      'Mozambique': '🇲🇿',
      'Malawi': '🇲🇼',
      'Madagascar': '🇲🇬',
      'Mauritius': '🇲🇺',
      'Seychelles': '🇸🇨',
      'Comoros': '🇰🇲',
      'Mayotte': '🇾🇹',
      'Reunion': '🇷🇪',
      'Australia': '🇦🇺',
      'New Zealand': '🇳🇿',
      'Papua New Guinea': '🇵🇬',
      'Solomon Islands': '🇸🇧',
      'Vanuatu': '🇻🇺',
      'New Caledonia': '🇳🇨',
      'Fiji': '🇫🇯',
      'Samoa': '🇼🇸',
      'Tonga': '🇹🇴',
      'Kiribati': '🇰🇮',
      'Tuvalu': '🇹🇻',
      'Nauru': '🇳🇷',
      'Palau': '🇵🇼',
      'Marshall Islands': '🇲🇭',
      'Micronesia': '🇫🇲',
      'Cook Islands': '🇨🇰',
      'French Polynesia': '🇵🇫',
      'American Samoa': '🇦🇸',
      'Guam': '🇬🇺',
      'Northern Mariana Islands': '🇲🇵',
      'Hawaii': '🇺🇸'
    };
    return flagMap[country] || '🏳️';
  };

  const sections = [
    { 
      key: 'culture', 
      title: 'Culture', 
      icon: Users, 
      content: city.culture,
      color: 'text-blue-400'
    },
    { 
      key: 'food', 
      title: 'Food', 
      icon: Utensils, 
      content: city.food,
      color: 'text-green-400'
    },
    {
      key: 'history',
      title: 'History',
      icon: History,
      content: city.history,
      color: 'text-yellow-400'
    },
    { 
      key: 'adversity_resilience', 
      title: 'Adversity & Resilience', 
      icon: Shield, 
      content: city.adversity_resilience,
      color: 'text-orange-400'
    },
    {
      key: 'economy_industry',
      title: 'Economy & Industry',
      icon: Building2,
      content: city.economy_industry,
      color: 'text-emerald-400'
    },
    {
      key: 'environment_geography',
      title: 'Environment & Geography',
      icon: Mountain,
      content: city.environment_geography,
      color: 'text-teal-400'
    },
    {
      key: 'education_innovation',
      title: 'Education & Innovation',
      icon: GraduationCap,
      content: city.education_innovation,
      color: 'text-cyan-400'
    },
    { 
      key: 'cooperation_global_ties', 
      title: 'Global Cooperation', 
      icon: Globe2, 
      content: city.cooperation_global_ties,
      color: 'text-purple-400'
    },
    {
      key: 'tourism_attractions',
      title: 'Tourism & Attractions',
      icon: Landmark,
      content: city.tourism_attractions,
      color: 'text-pink-400'
    },
    {
      key: 'population_diversity',
      title: 'Population & Diversity',
      icon: UsersRound,
      content: city.population_diversity,
      color: 'text-indigo-400'
    },
    {
      key: 'arts_music_scene',
      title: 'Arts & Music Scene',
      icon: Music2,
      content: city.arts_music_scene,
      color: 'text-rose-400'
    },
    {
      key: 'sports_recreation',
      title: 'Sports & Recreation',
      icon: Trophy,
      content: city.sports_recreation,
      color: 'text-amber-400'
    },
    {
      key: 'famous_people',
      title: 'Famous People',
      icon: Star,
      content: city.famous_people,
      color: 'text-violet-400'
    },
    {
      key: 'fun_fact',
      title: 'Fun Fact',
      icon: Sparkles,
      content: city.fun_fact,
      color: 'text-fuchsia-400'
    },
  ];

  return (
    <>
      {/* Modal */}
      <div 
        className={`fixed left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:w-[40vw] lg:w-[35vw] xl:w-[30vw] max-w-2xl min-w-80 sm:min-w-96 max-h-[85vh] sm:max-h-[80vh] bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl z-50 transition-all duration-500 ease-out ${
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full max-h-[85vh] sm:max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="backdrop-blur-xl border-b border-white/10 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl flex-shrink-0">``
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 truncate">{city.name}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base sm:text-lg">{getCountryFlag(city.country)}</span>
                  <span className="text-gray-300 text-xs sm:text-sm truncate">{city.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-400 text-xs">{formatPopulation(city.population_size)} people</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {!isCompareMode && (
                  <button
                    onClick={() => onCompare(city)}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 text-xs font-medium backdrop-blur-sm"
                  >
                    Compare
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 sm:p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4 pb-4">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <div key={section.key} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <IconComponent size={16} className={`sm:w-[18px] sm:h-[18px] ${section.color}`} />
                      <h2 className="text-xs sm:text-sm font-semibold text-white">{section.title}</h2>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">{section.content || 'Information coming soon...'}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CityModal;
