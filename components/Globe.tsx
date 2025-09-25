"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

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

interface GlobeProps {
  cities: City[];
  onCityClick: (city: City) => void;
}

const Globe: React.FC<GlobeProps> = ({ cities, onCityClick }) => {
  const globeEl = useRef<any>();
  const globeInstance = useRef<any>();
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);

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
            background: rgba(0,0,0,0.9);
            padding: 12px;
            border-radius: 8px;
            color: white;
            font-family: system-ui;
            border: 1px solid #ff6b6b;
            max-width: 200px;
          ">
            <div style="font-weight: bold; font-size: 16px; color: #ff6b6b;">${(d as City).name}</div>
            <div style="font-size: 14px; opacity: 0.8; margin-top: 4px;">${(d as City).country}</div>
            <div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">${(d as City).population_diversity || 'Population data coming soon'}</div>
            ${(d as City).fun_fact ? `<div style="font-size: 12px; opacity: 0.7; margin-top: 4px; font-style: italic;">"${(d as City).fun_fact}"</div>` : ''}
            <div style="font-size: 11px; opacity: 0.6; margin-top: 8px;">Click to explore</div>
          </div>
        `)
        .onPointClick((point) => {
          onCityClick(point as City);
          // Animate to clicked point
          globe.pointOfView({ lat: (point as City).lat, lng: (point as City).lng, altitude: 2 }, 1000);
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
          onCityClick(label as City);
          globe.pointOfView({ lat: (label as City).lat, lng: (label as City).lng, altitude: 2 }, 1000);
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
  }, [cities, onCityClick, isNightMode]);

  const toggleTheme = () => {
    setIsNightMode(!isNightMode);
  };

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