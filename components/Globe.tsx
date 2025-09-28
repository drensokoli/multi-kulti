"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getCountryFlag } from '@/lib/utils';
import type { City } from '@/types';
import { Globe as GlobeIcon } from 'lucide-react';

interface GlobeProps {
  cities: Array<{
    id: string;
    name: string;
    country: string;
    lat: string;
    lng: string;
    population_size: string;
  }>;
  onCityClick: (city: any) => void;
  selectedCity: any | null;
  zoomToCity?: any | null;
  isNightMode?: boolean;
  userLocation?: {lat: number, lng: number} | null;
}

const Globe: React.FC<GlobeProps> = ({ cities, onCityClick, selectedCity, zoomToCity, isNightMode = false, userLocation }) => {
  const globeEl = useRef<any>();
  const globeInstance = useRef<any>();
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!cities?.length) return;

    // Dynamically import and initialize globe.gl
    import('globe.gl').then((GlobeGL) => {
      if (!globeEl.current) return;

      // Create globe instance
      const globe = new GlobeGL.default(globeEl.current);
      globeInstance.current = globe;

      // Combine cities and user location data
      const allPoints: any[] = [...cities];
      if (userLocation) {
        allPoints.push({
          id: 'user-location',
          name: 'Your Location',
          country: 'Current Position',
          lat: userLocation.lat.toString(),
          lng: userLocation.lng.toString(),
          population_size: '0'
        });
      }

      // Configure globe appearance
      globe
        .globeImageUrl(isNightMode ? '//unpkg.com/three-globe/example/img/earth-night.jpg' : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .pointsData(allPoints)
        .pointAltitude((d: any) => d.id === 'user-location' ? 0.002 : 0.001)
        .pointRadius((d: any) => d.id === 'user-location' ? 0.2 : 0.3)
        .pointResolution(48)
        .pointColor((d: any) => d.id === 'user-location' ? '#00ff00' : '#ff6b6b')
        .onPointClick((point: any) => {
          if (point.id === 'user-location') {
            // On mobile, show the same tooltip as desktop hover
            if (isMobile) {
              // Create a temporary tooltip element
              const tooltip = document.createElement('div');
              tooltip.innerHTML = `
                <div style="
                  background: rgba(0, 255, 0, 0.95) !important;
                  backdrop-filter: blur(20px);
                  padding: 12px 16px;
                  border-radius: 12px;
                  color: #1a1a1a;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  border: 1px solid rgba(0, 255, 0, 0.3);
                  box-shadow: 0 8px 32px rgba(0, 255, 0, 0.2);
                  max-width: 160px;
                  min-width: 140px;
                  transition: all 0.2s ease;
                  position: fixed;
                  z-index: 1000;
                  white-space: nowrap;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                ">
                  <div style="font-weight: 600; font-size: 14px; color: #1a1a1a; line-height: 1.2; text-align: center;">📍 Your Location</div>
                </div>
              `;
              
              document.body.appendChild(tooltip);
              
              // Remove tooltip after 2 seconds
              setTimeout(() => {
                if (tooltip.parentNode) {
                  tooltip.parentNode.removeChild(tooltip);
                }
              }, 2000);
            }
          } else {
            handleCityClick(point as City);
          }
        })
        .width(window.innerWidth)
        .height(window.innerHeight);

      // Only add point labels on desktop
      if (!isMobile) {
        globe.pointLabel((d: any) => {
          if (d.id === 'user-location') {
            return `
              <div style="
                background: rgba(0, 255, 0, 0.95) !important;
                backdrop-filter: blur(20px);
                padding: 12px 16px;
                border-radius: 12px;
                color: #1a1a1a;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                border: 1px solid rgba(0, 255, 0, 0.3);
                box-shadow: 0 8px 32px rgba(0, 255, 0, 0.2);
                max-width: 160px;
                min-width: 140px;
                transition: all 0.2s ease;
                position: relative;
                z-index: 30;
                white-space: nowrap;
              ">
                <div style="font-weight: 600; font-size: 14px; color: #1a1a1a; line-height: 1.2; text-align: center;">📍 Your Location</div>
              </div>
            `;
          }
          
          return `
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
              z-index: 30;
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
          `;
        });
      }

      // City name labels are hidden by default
      // Uncomment the following lines to show city names on the map:
      globe
        .labelsData(cities)
        .labelLat((d) => parseFloat((d as City).lat))
        .labelLng((d) => parseFloat((d as City).lng))
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
  }, [cities, isMobile]);

  // Update globe texture when theme changes
  useEffect(() => {
    if (globeInstance.current) {
      globeInstance.current.globeImageUrl(
        isNightMode 
          ? '//unpkg.com/three-globe/example/img/earth-night.jpg' 
          : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
      );
    }
  }, [isNightMode]);

  // Update globe points when user location changes
  useEffect(() => {
    if (globeInstance.current && isGlobeReady) {
      // Combine cities and user location data
      const allPoints = [...cities];
      if (userLocation) {
        allPoints.push({
          id: 'user-location',
          name: 'Your Location',
          country: 'Current Position',
          lat: userLocation.lat.toString(),
          lng: userLocation.lng.toString(),
          population_size: '0'
        });
      }

      // Update points data
      globeInstance.current
        .pointsData(allPoints)
        .pointAltitude((d: any) => d.id === 'user-location' ? 0.002 : 0.001)
        .pointRadius((d: any) => d.id === 'user-location' ? 0.2 : 0.3)
        .pointColor((d: any) => d.id === 'user-location' ? '#00ff00' : '#ff6b6b');
    }
  }, [userLocation, cities, isGlobeReady]);

  // Zoom to location function
  const zoomToLocation = useCallback((city: City) => {
    if (globeInstance.current) {
      // Point the camera at the city's coordinates
      globeInstance.current.pointOfView({
        lat: parseFloat(city.lat),
        lng: parseFloat(city.lng),
        altitude: 0.5 // Zoom level (0.5 is closer zoom for better city view)
      }, 800); // Animation duration in milliseconds (faster zoom)
    }
  }, []);

  // Effect to handle zoom requests from parent
  useEffect(() => {
    if (zoomToCity && isGlobeReady) {
      zoomToLocation(zoomToCity);
    }
  }, [zoomToCity, isGlobeReady, zoomToLocation]);

  return (
    <div className="fixed inset-0 z-0 no-select">
      <div ref={globeEl} className="no-select" />

      {!isGlobeReady && (

        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <div className="text-center">
            <GlobeIcon className="mx-auto text-white mb-4 animate-spin" size={48} />
            <div className="text-white text-xl">Loading Interactive Globe...</div>
          </div>
        </div>

      )}
    </div>
  );
};

export type { GlobeProps };
export default Globe;