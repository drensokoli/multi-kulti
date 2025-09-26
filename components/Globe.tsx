"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getCountryFlag } from '@/lib/utils';

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

interface GlobeProps {
  cities: City[];
  onCityClick: (city: City) => void;
  selectedCity: City | null;
  zoomToCity?: City | null;
}

const Globe: React.FC<GlobeProps> = ({ cities, onCityClick, selectedCity, zoomToCity }) => {
  const globeEl = useRef<any>();
  const globeInstance = useRef<any>();
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);

  // Stable click handler to prevent globe re-initialization
  const handleCityClick = useCallback((city: City) => {
    onCityClick(city);
  }, [onCityClick]);

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

  // Helper function to get first few words of fun fact
  const getFunFactPreview = (funFact: string): string => {
    if (!funFact || funFact.trim() === '') return '';
    const words = funFact.trim().split(' ').slice(0, 15).join(' ');
    return words.length < funFact.length ? `${words}...` : words;
  };

  // Helper function to get country flag emoji

  useEffect(() => {
    if (!cities?.length) return;

    // Dynamically import and initialize globe.gl
    import('globe.gl').then((GlobeGL) => {
      if (!globeEl.current) return;
      
      // Create globe instance
      const globe = new GlobeGL.default(globeEl.current);
      globeInstance.current = globe;
    
      // Configure globe appearance
      globe
        .globeImageUrl(isNightMode ? '//unpkg.com/three-globe/example/img/earth-night.jpg' : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .pointsData(cities)
        .pointAltitude(0.001)
        .pointRadius(0.3)
        .pointResolution(48)
        .pointColor(() => '#ff6b6b')
        .pointLabel((d) => `
          <div style="
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(20px);
            padding: 16px 20px;
            border-radius: 16px;
            color: #1a1a1a;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            max-width: 240px;
            min-width: 180px;
            transition: all 0.2s ease;
            position: relative;
            z-index: 1000;
          ">
            <div style="margin-bottom: 8px;">
              <div style="font-weight: 600; font-size: 16px; color: #1a1a1a; line-height: 1.2; margin-bottom: 4px;">${(d as City).name}</div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">${getCountryFlag((d as City).country)}</span>
                <span style="font-size: 15px; color: #666; font-weight: 500;">${(d as City).country}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0, 0, 0, 0.1);">
              <div style="width: 6px; height: 6px; background: #ff6b6b; border-radius: 50%;"></div>
              <span style="font-size: 12px; color: #666; font-weight: 500;">${formatPopulation((d as City).population_size)} people</span>
            </div>
            ${getFunFactPreview((d as City).fun_fact) ? `
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                <div style="font-size: 11px; color: #888; font-style: italic; line-height: 1.3;">"${getFunFactPreview((d as City).fun_fact)}"</div>
              </div>
            ` : ''}
            <div style="font-size: 11px; color: #999; margin-top: 8px; text-align: center; font-style: italic;">Click to explore</div>
          </div>
        `)
        .onPointClick((point) => {
          handleCityClick(point as City);
        })
        .width(window.innerWidth)
        .height(window.innerHeight);

      // City name labels are hidden by default
      // Uncomment the following lines to show city names on the map:
      globe
        .labelsData(cities)
        .labelLat((d) => (d as City).lat)
        .labelLng((d) => (d as City).lng)
        .labelText((d) => (d as City).name)
        .labelSize(0.5)
        .labelDotRadius(0.2)
        .labelAltitude(0.0001)
        .labelColor(() => 'rgba(255, 255, 255, 0.8)')
        .labelResolution(2)
        .onLabelClick((label) => {
          handleCityClick(label as City);
        });

      setIsGlobeReady(true);

      // Handle window resize
      const handleResize = () => {
        globe.width(window.innerWidth).height(window.innerHeight);
      };

      window.addEventListener('resize', handleResize);
    });

    return () => {
      if (globeInstance.current) {
        window.removeEventListener('resize', () => {
          globeInstance.current.width(window.innerWidth).height(window.innerHeight);
        });
      }
    };
  }, [cities, isNightMode]);

  const toggleTheme = () => {
    setIsNightMode(!isNightMode);
  };

  // Zoom to location function
  const zoomToLocation = useCallback((city: City) => {
    if (globeInstance.current) {
      // Point the camera at the city's coordinates
      globeInstance.current.pointOfView({
        lat: city.lat,
        lng: city.lng,
        altitude: 0.8 // Zoom level (0.8 is closer zoom for better city view)
      }, 1200); // Animation duration in milliseconds
    }
  }, []);

  // Effect to handle zoom requests from parent
  useEffect(() => {
    if (zoomToCity && isGlobeReady) {
      zoomToLocation(zoomToCity);
    }
  }, [zoomToCity, isGlobeReady, zoomToLocation]);

  return (
    <div className="fixed inset-0 z-0">
      <div ref={globeEl} />
      
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-30">
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

      {!isGlobeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-xl">Loading Globe...</div>
        </div>
      )}
    </div>
  );
};

export default Globe;