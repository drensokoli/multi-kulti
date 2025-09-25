"use client";

import React from 'react';
import { X, Users, Utensils, Shield, Heart } from 'lucide-react';

interface City {
  id: number;
  name: string;
  country: string;
  lat: number;
  lng: number;
  population: string;
  culture: string;
  food: string;
  adversity: string;
  cooperation: string;
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
      key: 'adversity', 
      title: 'Adversity & Resilience', 
      icon: Shield, 
      content: city.adversity,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    },
    { 
      key: 'cooperation', 
      title: 'Cooperation & Connection', 
      icon: Heart, 
      content: city.cooperation,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
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
      <div className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-gray-900/95 backdrop-blur-lg border-l border-gray-700 z-50 transform transition-transform duration-500 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{city.name}</h1>
                <p className="text-gray-300 text-lg">{city.country}</p>
                <p className="text-gray-400 text-sm mt-1">Population: {city.population}</p>
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
          <div className="p-6 space-y-6">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <div key={section.key} className={`border rounded-xl p-6 ${section.color}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent size={24} className={section.color.split(' ')[0]} />
                    <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                  </div>
                  <p className="text-gray-200 leading-relaxed">{section.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CityPanel;