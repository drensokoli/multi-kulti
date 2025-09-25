"use client";

import React from 'react';
import { 
  X, Users, Utensils, History, Shield, Building2, Mountain, GraduationCap, 
  Globe2, Landmark, UsersRound, Music2, Trophy, Star, Sparkles, ArrowLeftRight 
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

interface CompareViewProps {
  city1: City;
  city2: City | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSecondCity: (message: string) => void;
}

const CompareView: React.FC<CompareViewProps> = ({ 
  city1, 
  city2, 
  isOpen, 
  onClose,
  onSelectSecondCity 
}) => {
  const sections = [
    { 
      key: 'culture' as keyof City, 
      title: 'Culture', 
      icon: Users, 
      color: 'text-blue-400 border-blue-500/20'
    },
    { 
      key: 'food' as keyof City, 
      title: 'Food', 
      icon: Utensils, 
      color: 'text-green-400 border-green-500/20'
    },
    {
      key: 'history' as keyof City,
      title: 'History',
      icon: History,
      color: 'text-yellow-400 border-yellow-500/20'
    },
    { 
      key: 'adversity_resilience' as keyof City, 
      title: 'Adversity & Resilience', 
      icon: Shield, 
      color: 'text-orange-400 border-orange-500/20'
    },
    {
      key: 'economy_industry' as keyof City,
      title: 'Economy & Industry',
      icon: Building2,
      color: 'text-emerald-400 border-emerald-500/20'
    },
    {
      key: 'environment_geography' as keyof City,
      title: 'Environment & Geography',
      icon: Mountain,
      color: 'text-teal-400 border-teal-500/20'
    },
    {
      key: 'education_innovation' as keyof City,
      title: 'Education & Innovation',
      icon: GraduationCap,
      color: 'text-cyan-400 border-cyan-500/20'
    },
    { 
      key: 'cooperation_global_ties' as keyof City, 
      title: 'Global Cooperation', 
      icon: Globe2, 
      color: 'text-purple-400 border-purple-500/20'
    },
    {
      key: 'tourism_attractions' as keyof City,
      title: 'Tourism & Attractions',
      icon: Landmark,
      color: 'text-pink-400 border-pink-500/20'
    },
    {
      key: 'population_diversity' as keyof City,
      title: 'Population & Diversity',
      icon: UsersRound,
      color: 'text-indigo-400 border-indigo-500/20'
    },
    {
      key: 'arts_music_scene' as keyof City,
      title: 'Arts & Music Scene',
      icon: Music2,
      color: 'text-rose-400 border-rose-500/20'
    },
    {
      key: 'sports_recreation' as keyof City,
      title: 'Sports & Recreation',
      icon: Trophy,
      color: 'text-amber-400 border-amber-500/20'
    },
    {
      key: 'famous_people' as keyof City,
      title: 'Famous People',
      icon: Star,
      color: 'text-violet-400 border-violet-500/20'
    },
    {
      key: 'fun_fact' as keyof City,
      title: 'Fun Fact',
      icon: Sparkles,
      color: 'text-fuchsia-400 border-fuchsia-500/20'
    },
  ];

  React.useEffect(() => {
    if (isOpen && !city2) {
      onSelectSecondCity("Select another city to compare with " + city1.name);
    }
  }, [isOpen, city2, city1.name, onSelectSecondCity]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed inset-4 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-2xl z-50 transform transition-all duration-500 ease-out ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <ArrowLeftRight className="text-purple-400" size={28} />
              <div>
                <h1 className="text-2xl font-bold text-white">City Comparison</h1>
                <p className="text-gray-400">
                  {city2 ? `${city1.name} vs ${city2.name}` : `Select a second city to compare with ${city1.name}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!city2 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <ArrowLeftRight className="mx-auto text-gray-500 mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-white mb-2">Select Second City</h3>
                  <p className="text-gray-400 max-w-md">
                    Click on another city marker or label on the globe to start comparing
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {/* City Headers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-2">{city1.name}</h2>
                    <p className="text-gray-300 text-lg">{city1.country}</p>
                    <p className="text-gray-400 text-sm mt-1">{city1.population_diversity || 'Population data coming soon'}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-2">{city2.name}</h2>
                    <p className="text-gray-300 text-lg">{city2.country}</p>
                    <p className="text-gray-400 text-sm mt-1">{city2.population_diversity || 'Population data coming soon'}</p>
                  </div>
                </div>

                {/* Comparison Sections */}
                <div className="space-y-8">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <div key={section.key} className={`border rounded-xl p-6 ${section.color}`}>
                        <div className="flex items-center gap-3 mb-6">
                          <IconComponent size={24} className={section.color.split(' ')[0]} />
                          <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-white mb-3 opacity-75">{city1.name}</h4>
                            <p className="text-gray-200 leading-relaxed text-sm">
                              {city1[section.key] as string}
                            </p>
                          </div>
                          <div className="lg:border-l lg:pl-6 border-gray-600">
                            <h4 className="font-medium text-white mb-3 opacity-75">{city2.name}</h4>
                            <p className="text-gray-200 leading-relaxed text-sm">
                              {city2[section.key] as string}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompareView;