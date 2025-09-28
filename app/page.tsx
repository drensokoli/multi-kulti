"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { City } from '@/types';
import CityModal from '@/components/CityModal';
import ComparisonModal from '@/components/ComparisonModal';
import FloatingMessage from '@/components/FloatingMessage';
import SearchBar from '@/components/SearchBar';
import { Globe as GlobeIcon, Moon, Sun } from 'lucide-react';

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('@/components/Globe'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* <div className="text-center">
        <GlobeIcon className="mx-auto text-white mb-4 animate-spin" size={48} />
        <div className="text-white text-xl">Loading Interactive Globe...</div>
      </div> */}
    </div>
  ),
});


// Define the CityComparison interface
interface CityComparison {
  cities: string[];
  overview: string;
  population_diversity: string;
  culture_lifestyle: string;
  history_resilience: string;
  modern_life_and_economy: string;
  life_in_city: string;
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
  const [zoomToCity, setZoomToCity] = useState<City | null>(null);
  const [isNightMode, setIsNightMode] = useState(false);
  
  // State for second city modal
  const [selectedCity2, setSelectedCity2] = useState<City | null>(null);
  const [isPanel2Open, setIsPanel2Open] = useState(false);
  
  // New state for comparison modal
  const [comparisonData, setComparisonData] = useState<CityComparison[]>([]);
  const [currentComparison, setCurrentComparison] = useState<CityComparison | null>(null);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  
  // State to track when second city is being processed
  const [isProcessingSecondCity, setIsProcessingSecondCity] = useState(false);
  
  // Use refs to track current state for immediate access in click handlers
  const compareModeRef = React.useRef(false);
  const compareCity1Ref = React.useRef<City | null>(null);

  // Load cities and comparison data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [citiesResponse, comparisonResponse] = await Promise.all([
          fetch('/data/cities.json'),
          fetch('/data/city_comparison.json')
        ]);
        
        const citiesData = await citiesResponse.json();
        const comparisonData = await comparisonResponse.json();
        
        setCities(citiesData);
        setComparisonData(comparisonData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to find comparison data for two cities
  const findComparison = (city1Id: string, city2Id: string): CityComparison | null => {
    return comparisonData.find(comparison => {
      const cities = comparison.cities;
      return (cities.includes(city1Id) && cities.includes(city2Id));
    }) || null;
  };

  const handleCityClick = (city: City) => {
    // Use refs to get the current state immediately without waiting for React updates
    const isInCompareMode = compareModeRef.current;
    const firstCity = compareCity1Ref.current;
    
    if (isInCompareMode && firstCity && city.id !== firstCity.id) {
      // Second city selected for comparison
      setCompareCity2(city);
      setIsProcessingSecondCity(true); // Hide compare buttons immediately
      
      // Check if we're on mobile/tablet (screen width < 1280px)
      const isMobile = window.innerWidth < 1280;
      
      if (isMobile) {
        // Mobile: Use original comparison modal
        const comparison = findComparison(firstCity.id, city.id);
        if (comparison) {
          setCurrentComparison(comparison);
          setIsComparisonModalOpen(true);
          // Reset compare mode after comparison modal opens
          setIsCompareMode(false);
          compareModeRef.current = false;
          compareCity1Ref.current = null;
          setIsProcessingSecondCity(false);
        } else {
          // Fallback to old comparison view
          setIsCompareOpen(true);
          // Reset compare mode after comparison view opens
          setIsCompareMode(false);
          compareModeRef.current = false;
          compareCity1Ref.current = null;
          setIsProcessingSecondCity(false);
        }
      } else {
        // Desktop: Use new three-modal layout
        // Zoom to second city first
        setZoomToCity(city);
        // Clear the zoom state after a short delay to allow for re-zooming to the same location
        setTimeout(() => setZoomToCity(null), 100);
        
        // Open second city modal after zoom animation completes (800ms + small buffer)
        setTimeout(() => {
          setSelectedCity2(city);
          setIsPanel2Open(true);
        }, 900);
        
        // Find comparison data
        const comparison = findComparison(firstCity.id, city.id);
        if (comparison) {
          // Use new comparison modal - delay to sync with city2 modal animation
          setCurrentComparison(comparison);
          setTimeout(() => {
            setIsComparisonModalOpen(true);
            // Reset compare mode after comparison modal opens
            setIsCompareMode(false);
            compareModeRef.current = false;
            compareCity1Ref.current = null;
            setIsProcessingSecondCity(false);
          }, 1200); // 900ms (zoom) + 300ms (modal animation)
        } else {
          // Fallback to old comparison view
          setTimeout(() => {
            setIsCompareOpen(true);
            // Reset compare mode after comparison view opens
            setIsCompareMode(false);
            compareModeRef.current = false;
            compareCity1Ref.current = null;
            setIsProcessingSecondCity(false);
          }, 1200);
        }
      }
      
      setFloatingMessage(null);
      return; // Important: prevent falling through to normal city selection
    } else if (isInCompareMode && firstCity && city.id === firstCity.id) {
      // Same city clicked, show message
      setFloatingMessage("Please select a different city to compare");
      return; // Important: prevent falling through to normal city selection
    }
    
    // Normal city selection - close any open modals first
    setIsPanelOpen(false);
    setIsPanel2Open(false);
    setSelectedCity(null);
    setSelectedCity2(null);
    setIsCompareOpen(false);
    setIsComparisonModalOpen(false);
    setCompareCity1(null);
    setCompareCity2(null);
    setCurrentComparison(null);
    setIsCompareMode(false);
    compareModeRef.current = false;
    compareCity1Ref.current = null;
    
    // Normal city selection - use same behavior as search bar
    handleLocationSelect(city);
  };

  const handleCompare = (city: City) => {
    setCompareCity1(city);
    setCompareCity2(null);
    setIsCompareMode(true);
    
    // Update refs immediately for synchronous access
    compareModeRef.current = true;
    compareCity1Ref.current = city;
    
    // Check if we're on mobile/tablet (screen width < 1280px)
    const isMobile = window.innerWidth < 1280;
    
    if (isMobile) {
      // Mobile: Close the first city modal (original behavior)
      setIsPanelOpen(false);
    }
    // Desktop: Keep the first city modal open (new behavior)
    
    setFloatingMessage("Select another city to compare with " + city.name);
  };

  const handleClosePanel = () => {
    // Close all modals
    setIsPanelOpen(false);
    setIsPanel2Open(false);
    setIsComparisonModalOpen(false);
    setSelectedCity(null);
    setSelectedCity2(null);
    setCurrentComparison(null);
    setCompareCity1(null);
    setCompareCity2(null);
    setIsCompareMode(false);
    setFloatingMessage(null);
    setIsProcessingSecondCity(false);
    
    // Reset refs
    compareModeRef.current = false;
    compareCity1Ref.current = null;
  };

  const handleClosePanel2 = () => {
    // Close all modals
    setIsPanelOpen(false);
    setIsPanel2Open(false);
    setIsComparisonModalOpen(false);
    setSelectedCity(null);
    setSelectedCity2(null);
    setCurrentComparison(null);
    setCompareCity1(null);
    setCompareCity2(null);
    setIsCompareMode(false);
    setFloatingMessage(null);
    setIsProcessingSecondCity(false);
    
    // Reset refs
    compareModeRef.current = false;
    compareCity1Ref.current = null;
  };

  const handleCloseCompare = () => {
    setIsCompareOpen(false);
    setIsCompareMode(false);
    setCompareCity1(null);
    setCompareCity2(null);
    setFloatingMessage(null);
    
    // Reset refs
    compareModeRef.current = false;
    compareCity1Ref.current = null;
  };

  const handleCloseComparisonModal = () => {
    setIsComparisonModalOpen(false);
    setIsCompareMode(false);
    setCompareCity1(null);
    setCompareCity2(null);
    setCurrentComparison(null);
    setFloatingMessage(null);
    
    // Close both city modals when comparison modal closes
    setIsPanelOpen(false);
    setIsPanel2Open(false);
    setSelectedCity(null);
    setSelectedCity2(null);
    
    // Reset refs
    compareModeRef.current = false;
    compareCity1Ref.current = null;
  };

  const handleSelectSecondCity = (message: string) => {
    setFloatingMessage(message);
  };

  const handleDismissMessage = () => {
    setFloatingMessage(null);
  };

  const toggleTheme = () => {
    setIsNightMode(!isNightMode);
  };

  const handleLocationSelect = (city: City) => {
    // Check if we're in compare mode and have a first city selected
    const isInCompareMode = compareModeRef.current;
    const firstCity = compareCity1Ref.current;
    
    if (isInCompareMode && firstCity && city.id !== firstCity.id) {
      // Second city selected for comparison
      setCompareCity2(city);
      
      // Check if we're on mobile/tablet (screen width < 1280px)
      const isMobile = window.innerWidth < 1280;
      
      if (isMobile) {
        // Mobile: Use original comparison modal
        const comparison = findComparison(firstCity.id, city.id);
        if (comparison) {
          setCurrentComparison(comparison);
          setIsComparisonModalOpen(true);
        } else {
          // Fallback to old comparison view
          setIsCompareOpen(true);
        }
      } else {
        // Desktop: Use new three-modal layout
        // Zoom to second city first
        setZoomToCity(city);
        // Clear the zoom state after a short delay to allow for re-zooming to the same location
        setTimeout(() => setZoomToCity(null), 100);
        
        // Open second city modal after zoom animation completes (800ms + small buffer)
        setTimeout(() => {
          setSelectedCity2(city);
          setIsPanel2Open(true);
        }, 900);
        
        // Find comparison data
        const comparison = findComparison(firstCity.id, city.id);
        if (comparison) {
          // Use new comparison modal - delay to sync with city2 modal animation
          setCurrentComparison(comparison);
          setTimeout(() => {
            setIsComparisonModalOpen(true);
          }, 1200); // 900ms (zoom) + 300ms (modal animation)
        } else {
          // Fallback to old comparison view
          setTimeout(() => {
            setIsCompareOpen(true);
          }, 1200);
        }
      }
      
      // Don't reset compare mode yet - keep buttons hidden until comparison modal opens
      setFloatingMessage(null);
      return; // Important: prevent falling through to normal city selection
    } else if (isInCompareMode && firstCity && city.id === firstCity.id) {
      // Same city clicked, show message
      setFloatingMessage("Please select a different city to compare");
      return; // Important: prevent falling through to normal city selection
    }
    
    // Normal city selection - close current modal if open
    if (isPanelOpen) {
      setIsPanelOpen(false);
      setSelectedCity(null);
    }
    
    // Close compare modal if open
    if (isCompareOpen) {
      setIsCompareOpen(false);
      setCompareCity1(null);
      setCompareCity2(null);
    }
    
    // Close comparison modal if open
    if (isComparisonModalOpen) {
      setIsComparisonModalOpen(false);
      setCompareCity1(null);
      setCompareCity2(null);
      setCurrentComparison(null);
    }
    
    // Close second city modal if open
    if (isPanel2Open) {
      setIsPanel2Open(false);
      setSelectedCity2(null);
    }
    
    setZoomToCity(city);
    // Clear the zoom state after a short delay to allow for re-zooming to the same location
    setTimeout(() => setZoomToCity(null), 100);
    // Open the city modal after the zoom animation completes (1200ms + small buffer)
    setTimeout(() => {
      setSelectedCity(city);
      setIsPanelOpen(true);
    }, 1300);
  };

  return (
    <main className="relative min-h-screen bg-black overflow-hidden no-select">
      {/* Top Bar with Search and Theme Toggle */}
      <div className="fixed top-6 left-0 right-0 z-50 px-4">
        {/* Mobile Layout */}
        <div className="flex items-center justify-between xl:hidden">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <SearchBar cities={cities} onLocationSelect={handleLocationSelect} />
          </div>
          
          {/* Theme Toggle */}
          <div className="ml-4">
            <button
              onClick={toggleTheme}
              className="bg-gray-900/80 backdrop-blur-lg rounded-full p-3 border border-gray-700 hover:bg-gray-800/90 transition-colors"
              aria-label={isNightMode ? "Switch to day mode" : "Switch to night mode"}
            >
              {isNightMode ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-blue-300" />
              )}
            </button>
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden xl:block relative">
          {/* Centered Search Bar */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md">
            <SearchBar cities={cities} onLocationSelect={handleLocationSelect} />
          </div>
          
          {/* Top Right Theme Toggle */}
          <div className="absolute right-0 top-0">
            <button
              onClick={toggleTheme}
              className="bg-gray-900/80 backdrop-blur-lg rounded-full p-3 border border-gray-700 hover:bg-gray-800/90 transition-colors"
              aria-label={isNightMode ? "Switch to day mode" : "Switch to night mode"}
            >
              {isNightMode ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-blue-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Globe */}
      <Globe cities={cities} onCityClick={handleCityClick} selectedCity={selectedCity} zoomToCity={zoomToCity} isNightMode={isNightMode} />

      {/* First City Modal (Left) */}
      <CityModal
        city={selectedCity}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onCompare={handleCompare}
        isCompareMode={isCompareMode || isComparisonModalOpen || isPanel2Open || isProcessingSecondCity} // Hide compare button when comparison modal is open or second city modal is open or processing second city
        position="left"
      />

      {/* Second City Modal (Right) - Desktop only */}
      <div className="hidden xl:block">
        <CityModal
          city={selectedCity2}
          isOpen={isPanel2Open}
          onClose={handleClosePanel2}
          onCompare={() => {}} // No compare button for second city
          isCompareMode={isComparisonModalOpen || isPanelOpen || isProcessingSecondCity} // Hide compare button when comparison modal is open or first city modal is open or processing second city
          position="right"
        />
      </div>


      {/* Comparison Modal */}
      <ComparisonModal
        comparison={currentComparison}
        isOpen={isComparisonModalOpen}
        onClose={handleCloseComparisonModal}
      />

      {/* Floating Message */}
      <FloatingMessage
        message={floatingMessage}
        onDismiss={handleDismissMessage}
      />
    </main>
  );
}