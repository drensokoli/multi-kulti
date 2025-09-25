"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CityPanel from '@/components/CityPanel';
import CompareView from '@/components/CompareView';
import FloatingMessage from '@/components/FloatingMessage';
import { Globe as GlobeIcon } from 'lucide-react';

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('@/components/Globe'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center">
        <GlobeIcon className="mx-auto text-white mb-4 animate-spin" size={48} />
        <div className="text-white text-xl">Loading Interactive Globe...</div>
      </div>
    </div>
  ),
});

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

export default function Home() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareCity1, setCompareCity1] = useState<City | null>(null);
  const [compareCity2, setCompareCity2] = useState<City | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load cities data
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetch('/data/cities.json');
        const data = await response.json();
        setCities(data.cities);
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCities();
  }, []);

  const handleCityClick = (city: City) => {
    if (isCompareMode && compareCity1 && city.id !== compareCity1.id) {
      // Second city selected for comparison
      setCompareCity2(city);
      setIsCompareOpen(true);
      setIsCompareMode(false);
      setFloatingMessage(null);
    } else if (isCompareMode && compareCity1 && city.id === compareCity1.id) {
      // Same city clicked, show message
      setFloatingMessage("Please select a different city to compare");
    } else {
      // Normal city selection
      setSelectedCity(city);
      setIsPanelOpen(true);
      setIsCompareMode(false);
    }
  };

  const handleCompare = (city: City) => {
    setCompareCity1(city);
    setCompareCity2(null);
    setIsCompareMode(true);
    setIsPanelOpen(false);
    setFloatingMessage("Select another city to compare with " + city.name);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedCity(null);
  };

  const handleCloseCompare = () => {
    setIsCompareOpen(false);
    setIsCompareMode(false);
    setCompareCity1(null);
    setCompareCity2(null);
    setFloatingMessage(null);
  };

  const handleSelectSecondCity = (message: string) => {
    setFloatingMessage(message);
  };

  const handleDismissMessage = () => {
    setFloatingMessage(null);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <GlobeIcon className="mx-auto text-white mb-4 animate-spin" size={48} />
          <div className="text-white text-xl">Loading Cities Explorer...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Globe */}
      <Globe cities={cities} onCityClick={handleCityClick} />
      
      {/* Title Overlay */}
      <div className="fixed top-6 left-6 z-30">
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-lg px-6 py-4 border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-1">Cities Explorer</h1>
          <p className="text-gray-300 text-sm">Discover cultures around the world</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-6 left-6 z-30">
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-lg px-4 py-3 border border-gray-700 max-w-xs">
          <p className="text-gray-300 text-xs">
            Click on city markers or labels to explore their culture, food, and community bonds
          </p>
        </div>
      </div>

      {/* City Panel */}
      <CityPanel
        city={selectedCity}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onCompare={handleCompare}
        isCompareMode={isCompareMode}
      />

      {/* Compare View */}
      {compareCity1 && (
        <CompareView
          city1={compareCity1}
          city2={compareCity2}
          isOpen={isCompareOpen}
          onClose={handleCloseCompare}
          onSelectSecondCity={handleSelectSecondCity}
        />
      )}

      {/* Floating Message */}
      <FloatingMessage
        message={floatingMessage}
        onDismiss={handleDismissMessage}
      />
    </main>
  );
}