"use client";

import React from 'react';
import { 
  X, Users, Utensils, History, Shield, Building2, Mountain, GraduationCap, 
  Globe2, Landmark, UsersRound, Music2, Trophy, Star, Sparkles, ArrowLeftRight 
} from 'lucide-react';

import type { City } from '@/types';
import { ComparisonSection, getCityComparison } from '@/types/comparison';

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
      key: 'culture',
      title: 'Culture', 
      icon: Users, 
      color: 'text-blue-400 border-blue-500/20'
    },
    {
      key: 'history',
      title: 'History',
      icon: History,
      color: 'text-yellow-400 border-yellow-500/20'
    },
    { 
      key: 'adversity_resilience',
      title: 'Adversity & Resilience', 
      icon: Shield, 
      color: 'text-orange-400 border-orange-500/20'
    },
    {
      key: 'economy_industry',
      title: 'Economy & Industry',
      icon: Building2,
      color: 'text-emerald-400 border-emerald-500/20'
    },
    {
      key: 'tourism_attractions',
      title: 'Tourism & Attractions',
      icon: Landmark,
      color: 'text-pink-400 border-pink-500/20'
    },
    {
      key: 'population_diversity',
      title: 'Population & Diversity',
      icon: UsersRound,
      color: 'text-indigo-400 border-indigo-500/20'
    }
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
                              {section.key === 'culture' 
                                ? Object.values(city1.culture).join(' | ')
                                : city1[section.key]}
                            </p>
                          </div>
                          <div className="lg:border-l lg:pl-6 border-gray-600">
                            <h4 className="font-medium text-white mb-3 opacity-75">{city2.name}</h4>
                            <p className="text-gray-200 leading-relaxed text-sm">
                              {section.key === 'culture'
                                ? Object.values(city2.culture).join(' | ')
                                : city2[section.key]}
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