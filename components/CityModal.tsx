"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Users, Utensils, History, Shield, Building2, Mountain, GraduationCap, 
  Globe2, Landmark, UsersRound, Music2, Trophy, Star, Sparkles, Heart 
} from 'lucide-react';
import type { City } from '@/types';
import { getCountryFlag } from '@/lib/utils';


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

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click is outside the modal and not on another city marker
      if (isOpen && !target.closest('[data-modal]') && !target.closest('[data-city-marker]')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Helper function to format population numbers
  const formatPopulation = (population: string): string => {
    // Remove any non-numeric characters except decimal points
    const cleanNum = population.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanNum);

    if (isNaN(num)) return population; // Return original if not parseable

    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };


  const sections = [
    {
      key: 'basic_info',
      title: 'Basic Information',
      icon: Globe2,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col sm:flex-row sm:items-start gap-1">
              <span className="text-gray-400 text-xs font-medium min-w-[100px] sm:min-w-[80px]">Diversity:</span>
              <span className="text-sm text-gray-200 leading-relaxed">{city.population_diversity || 'N/A'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-1">
              <span className="text-gray-400 text-xs font-medium min-w-[100px] sm:min-w-[80px]">Currency:</span>
              <span className="text-sm text-gray-200">
                {city.currency?.name ? `${city.currency.name} (${city.currency.symbol || ''})` : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-1">
              <span className="text-gray-400 text-xs font-medium min-w-[100px] sm:min-w-[80px]">Languages:</span>
              <span className="text-sm text-gray-200">{Array.isArray(city.languages) && city.languages.length > 0 ? city.languages.join(', ') : 'N/A'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-1">
              <span className="text-gray-400 text-xs font-medium min-w-[100px] sm:min-w-[80px]">Religions:</span>
              <span className="text-sm text-gray-200 leading-relaxed">{Array.isArray(city.religions) && city.religions.length > 0 ? city.religions.join(', ') : 'N/A'}</span>
            </div>
          </div>
        </div>
      ),
      color: 'text-blue-400'
    },
    {
      key: 'culture',
      title: 'Culture',
      icon: Users,
      content: (
        <div className="space-y-2">
          {city.culture ? (
            <>
              <div>
                <h3 className="text-sm font-medium mb-1">Traditional Arts</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{city.culture.traditional_arts}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Music</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{city.culture.traditional_music}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Clothing</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{city.culture.traditional_clothing}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Beliefs</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{city.culture.traditional_beliefs}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">Cultural information not available</p>
          )}
        </div>
      ),
      color: 'text-purple-400'
    },
    {
      key: 'food_drink',
      title: 'Food & Drinks',
      icon: Utensils,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Traditional Foods</h3>
            <div className="space-y-3">
              {Array.isArray(city.traditional_foods) ? city.traditional_foods.map((food, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3">
                  <h4 className="font-medium mb-1">{food.name}</h4>
                  <p className="text-gray-300 text-sm">{food.description}</p>
                </div>
              )) : <p className="text-gray-500 italic">No traditional foods available</p>}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Traditional Drinks</h3>
            <div className="space-y-3">
              {Array.isArray(city.traditional_drinks) ? city.traditional_drinks.map((drink, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3">
                  <h4 className="font-medium mb-1">{drink.name}</h4>
                  <p className="text-gray-300 text-sm">{drink.description}</p>
                </div>
              )) : <p className="text-gray-500 italic">No traditional drinks available</p>}
            </div>
          </div>
        </div>
      ),
      color: 'text-green-400'
    },
    {
      key: 'history_resilience',
      title: 'History & Resilience',
      icon: History,
      content: (
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium mb-1">History</h3>
            <p>{city.history || 'Information not available'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Adversity & Resilience</h3>
            <p>{city.adversity_resilience || 'Information not available'}</p>
          </div>
        </div>
      ),
      color: 'text-yellow-400'
    },
    {
      key: 'famous_people',
      title: 'Famous People',
      icon: Star,
      content: (
        <div className="space-y-3">
          {Array.isArray(city.famous_people) ? city.famous_people.map((person, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <h4 className="font-medium mb-1">{person.name}</h4>
              <p className="text-gray-300 text-sm">{person.description}</p>
            </div>
          )) : <p className="text-gray-500 italic">No famous people information available</p>}
        </div>
      ),
      color: 'text-violet-400'
    },
    {
      key: 'economy_tourism',
      title: 'Economy & Tourism',
      icon: Building2,
      content: (
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium mb-1">Economy & Industry</h3>
            <p>{city.economy_industry || 'Information not available'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Tourism</h3>
            <p>{city.tourism_attractions || 'Information not available'}</p>
          </div>
        </div>
      ),
      color: 'text-emerald-400'
    },
    {
      key: 'landmarks',
      title: 'Landmarks',
      icon: Landmark,
      content: (
        <div className="space-y-3">
          {Array.isArray(city.landmarks) ? city.landmarks.map((landmark, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <h4 className="font-medium mb-1">{landmark.name}</h4>
              <p className="text-gray-300 text-sm">{landmark.description}</p>
            </div>
          )) : <p className="text-gray-500 italic">No landmarks information available</p>}
        </div>
      ),
      color: 'text-pink-400'
    },
    {
      key: 'life',
      title: 'Life in the City',
      icon: Heart,
      content: (
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium mb-1">Cost of Living</h3>
            <p>{city.life_in?.cost_of_living || 'Information not available'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Quality of Life</h3>
            <p>{city.life_in?.quality_of_life || 'Information not available'}</p>
          </div>
        </div>
      ),
      color: 'text-rose-400'
    },
    {
      key: 'fun_fact',
      title: 'Fun Fact',
      icon: Sparkles,
      content: (
        <div className="space-y-2">
          <p className="text-gray-300 text-sm leading-relaxed italic">
            {city.fun_fact || 'No fun fact available for this city.'}
          </p>
        </div>
      ),
      color: 'text-fuchsia-400'
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-modal
          className="fixed left-2 sm:left-4 md:left-6 mt-24 h-[70vh] md:h-full transform -translate-y-1/2 w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:w-[40vw] lg:w-[35vw] xl:w-[30vw] max-w-2xl min-w-80 sm:min-w-96 max-h-[85vh] sm:max-h-[80vh] bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl z-30 no-select"
          initial={{ opacity: 0, x: -400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -400 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
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
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-gray-400 text-xs">{city.population_size ? formatPopulation(city.population_size) + ' people' : 'Population unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-400 text-xs">{Array.isArray(city.timezones) && city.timezones.length > 0 ? city.timezones[0] : 'Timezone unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-400 text-xs">{city.city_size || 'Size unknown'} km²</span>
                  </div>
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
              {/* Spotted by Locals Button */}
              {city.spotted_by_locals_link && (
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <a
                    href={`https://www.spottedbylocals.com/${city.id.toLowerCase().replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white hover:text-green-300 transition-colors duration-200 group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
                        <img 
                          src="/img/spotted_by_locals.png" 
                          alt="Spotted by Locals" 
                          className="w-12 h-12 object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold group-hover:text-green-300 transition-colors duration-200">
                        Planning on visiting?
                      </h3>
                      <p className="text-xs text-gray-300 group-hover:text-green-200 transition-colors duration-200">
                        Discover local spots and hidden gems with Spotted by Locals
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <svg 
                        className="w-4 h-4 text-gray-400 group-hover:text-green-300 transition-colors duration-200" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                </div>
              )}
              
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CityModal;
