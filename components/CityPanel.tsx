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
  lat: number;
  lng: number;
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

interface CityPanelProps {
  city: City | null;
  isOpen: boolean;
  onClose: () => void;
  onCompare: (city: City) => void;
  isCompareMode: boolean;
}

const CityPanel: React.FC<CityPanelProps> = ({ 
  city, 
  isOpen, 
  onClose, 
  onCompare,
  isCompareMode 
}) => {
  if (!city) return null;

  const sections = [
    { 
      key: 'culture', 
      title: 'Culture', 
      icon: Users, 
      content: city.culture,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    { 
      key: 'food', 
      title: 'Food', 
      icon: Utensils, 
      content: city.food,
      color: 'text-green-400 bg-green-500/10 border-green-500/20'
    },
    {
      key: 'history',
      title: 'History',
      icon: History,
      content: city.history,
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    },
    { 
      key: 'adversity_resilience', 
      title: 'Adversity & Resilience', 
      icon: Shield, 
      content: city.adversity_resilience,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    },
    {
      key: 'economy_industry',
      title: 'Economy & Industry',
      icon: Building2,
      content: city.economy_industry,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      key: 'environment_geography',
      title: 'Environment & Geography',
      icon: Mountain,
      content: city.environment_geography,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
    },
    {
      key: 'education_innovation',
      title: 'Education & Innovation',
      icon: GraduationCap,
      content: city.education_innovation,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    { 
      key: 'cooperation_global_ties', 
      title: 'Global Cooperation', 
      icon: Globe2, 
      content: city.cooperation_global_ties,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      key: 'tourism_attractions',
      title: 'Tourism & Attractions',
      icon: Landmark,
      content: city.tourism_attractions,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20'
    },
    {
      key: 'population_diversity',
      title: 'Population & Diversity',
      icon: UsersRound,
      content: city.population_diversity,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      key: 'arts_music_scene',
      title: 'Arts & Music Scene',
      icon: Music2,
      content: city.arts_music_scene,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    {
      key: 'sports_recreation',
      title: 'Sports & Recreation',
      icon: Trophy,
      content: city.sports_recreation,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      key: 'famous_people',
      title: 'Famous People',
      icon: Star,
      content: city.famous_people,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20'
    },
    {
      key: 'fun_fact',
      title: 'Fun Fact',
      icon: Sparkles,
      content: city.fun_fact,
      color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20'
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-4xl bg-gray-900/95 backdrop-blur-lg border-l border-gray-700 z-50 transform transition-transform duration-500 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{city.name}</h1>
                <p className="text-gray-300 text-lg">{city.country}</p>
                <p className="text-gray-400 text-sm mt-1">Population: {city.population_diversity || 'Data coming soon'}</p>
              </div>
              <div className="flex gap-2">
                {!isCompareMode && (
                  <button
                    onClick={() => onCompare(city)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Compare
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <div key={section.key} className={`border rounded-xl p-6 ${section.color} h-full`}>
                    <div className="flex items-center gap-3 mb-4">
                      <IconComponent size={24} className={section.color.split(' ')[0]} />
                      <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                    </div>
                    <p className="text-gray-200 leading-relaxed">{section.content || 'Information coming soon...'}</p>
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

export default CityPanel;