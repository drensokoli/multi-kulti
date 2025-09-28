"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Users, Globe2, History, Building2, Landmark, Star,
  ArrowLeftRight, Heart, Sparkles
} from 'lucide-react';

interface CityComparison {
  cities: string[];
  overview: string;
  population_diversity: string;
  culture_lifestyle: string;
  history_resilience: string;
  modern_life_and_economy: string;
  life_in_city: string;
}

interface ComparisonModalProps {
  comparison: CityComparison | null;
  isOpen: boolean;
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  comparison,
  isOpen,
  onClose
}) => {
  if (!comparison) return null;

  const sections = [
    {
      key: 'overview',
      title: 'Overview',
      icon: Sparkles,
      content: [
        {
          subtitle: 'City Essence',
          text: comparison.overview || 'Information not available'
        }
      ],
      color: 'text-purple-400'
    },
    {
      key: 'population_diversity',
      title: 'Population & Diversity',
      icon: Users,
      content: [
        {
          subtitle: 'Demographics',
          text: comparison.population_diversity || 'Information not available'
        }
      ],
      color: 'text-blue-400'
    },
    {
      key: 'culture_lifestyle',
      title: 'Culture & Lifestyle',
      icon: Globe2,
      content: [
        {
          subtitle: 'Cultural Practices',
          text: comparison.culture_lifestyle || 'Information not available'
        }
      ],
      color: 'text-emerald-400'
    },
    {
      key: 'history_resilience',
      title: 'History & Resilience',
      icon: History,
      content: [
        {
          subtitle: 'Historical Context',
          text: comparison.history_resilience || 'Information not available'
        }
      ],
      color: 'text-yellow-400'
    },
    {
      key: 'modern_life_and_economy',
      title: 'Modern Life & Economy',
      icon: Building2,
      content: [
        {
          subtitle: 'Economic Landscape',
          text: comparison.modern_life_and_economy || 'Information not available'
        }
      ],
      color: 'text-orange-400'
    },
    {
      key: 'life_in_city',
      title: 'Life in the Cities',
      icon: Heart,
      content: [
        {
          subtitle: 'Living Experience',
          text: comparison.life_in_city || 'Information not available'
        }
      ],
      color: 'text-rose-400'
    }
  ];

  // Format city names for display
  const formatCityName = (cityId: string) => {
    return cityId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const city1Name = formatCityName(comparison.cities[0]);
  const city2Name = formatCityName(comparison.cities[1]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-modal
          className="fixed inset-0 flex items-start justify-center z-40 p-4 pt-24 pointer-events-none"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:w-[70vw] lg:w-[60vw] xl:w-[30vw] max-w-4xl min-w-80 sm:min-w-96 h-[70vh] md:h-full max-h-[85vh] sm:max-h-[80vh] bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl no-select pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <div className="h-full max-h-[85vh] sm:max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="backdrop-blur-xl border-b border-white/10 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowLeftRight className="text-purple-400" size={20} />
                      <h1 className="text-xl sm:text-2xl font-bold text-white truncate">City Compare</h1>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base sm:text-md text-gray-300">{city1Name}</span>
                      <span className="text-gray-500">&</span>
                      <span className="text-base sm:text-md text-gray-300">{city2Name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-400 text-xs">Side-by-side comparison</span>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        Explore the unique character and shared experiences of these two cities
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
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
                        <div className="space-y-2 sm:space-y-3">
                          {section.content.map((item, index) => (
                            <div key={index}>
                              <h3 className="text-sm font-medium mb-1 text-gray-300">{item.subtitle}</h3>
                              <p className="text-gray-300 text-sm leading-relaxed">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComparisonModal;
