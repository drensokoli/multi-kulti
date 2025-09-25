"use client";

import React, { useEffect, useRef, useState } from 'react';

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

interface GlobeProps {
  cities: City[];
  onCityClick: (city: City) => void;
}

const Globe: React.FC<GlobeProps> = ({ cities, onCityClick }) => {
  const globeEl = useRef<any>();
  const globeInstance = useRef<any>();
  const [isGlobeReady, setIsGlobeReady] = useState(false);

  useEffect(() => {
    if (!cities.length) return;

    // Dynamically import and initialize globe.gl
    import('globe.gl').then((GlobeGL) => {
      if (!globeEl.current) return;
      
      // Create globe instance
      const globe = GlobeGL.default()(globeEl.current);
      globeInstance.current = globe;
    
      // Configure globe appearance
      globe
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .pointsData(cities)
        .pointAltitude(0.01)
        .pointRadius(0.6)
        .pointColor(() => '#ff6b6b')
        .pointLabel((d: City) => `
          <div style="
            background: rgba(0,0,0,0.9);
            padding: 12px;
            border-radius: 8px;
            color: white;
            font-family: system-ui;
            border: 1px solid #ff6b6b;
            max-width: 200px;
          ">
            <div style="font-weight: bold; font-size: 16px; color: #ff6b6b;">${d.name}</div>
            <div style="font-size: 14px; opacity: 0.8; margin-top: 4px;">${d.country}</div>
            <div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">Population: ${d.population}</div>
            <div style="font-size: 11px; opacity: 0.6; margin-top: 8px;">Click to explore</div>
          </div>
        `)
        .onPointClick((point: City) => {
          onCityClick(point);
          // Animate to clicked point
          globe.pointOfView({ lat: point.lat, lng: point.lng, altitude: 2 }, 1000);
        })
        .width(window.innerWidth)
        .height(window.innerHeight);

      // Add text labels for cities
      globe
        .labelsData(cities)
        .labelLat((d: City) => d.lat)
        .labelLng((d: City) => d.lng)
        .labelText((d: City) => d.name)
        .labelSize(1.2)
        .labelDotRadius(0.4)
        .labelColor(() => 'rgba(255, 255, 255, 0.8)')
        .labelResolution(2)
        .onLabelClick((label: City) => {
          onCityClick(label);
          globe.pointOfView({ lat: label.lat, lng: label.lng, altitude: 2 }, 1000);
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
  }, [cities, onCityClick]);

  return (
    <div className="fixed inset-0 z-0">
      <div ref={globeEl} />
      {!isGlobeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-xl">Loading Globe...</div>
        </div>
      )}
    </div>
  );
};

export default Globe;