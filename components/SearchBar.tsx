"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

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

interface SearchResult {
  city: City;
  type: 'city' | 'country';
  matchedText: string;
}

interface SearchBarProps {
  cities: City[];
  onLocationSelect: (city: City) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ cities, onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Helper function to get country flag emoji
  const getCountryFlag = (country: string): string => {
    const flagMap: { [key: string]: string } = {
      'Kosovo': '🇽🇰',
      'Bosnia & Herzegovina': '🇧🇦',
      'Albania': '🇦🇱',
      'North Macedonia': '🇲🇰',
      'Montenegro': '🇲🇪',
      'Serbia': '🇷🇸',
      'Croatia': '🇭🇷',
      'Slovenia': '🇸🇮',
      'Bulgaria': '🇧🇬',
      'Romania': '🇷🇴',
      'Greece': '🇬🇷',
      'Turkey': '🇹🇷',
      'Italy': '🇮🇹',
      'Austria': '🇦🇹',
      'Hungary': '🇭🇺',
      'Slovakia': '🇸🇰',
      'Czech Republic': '🇨🇿',
      'Poland': '🇵🇱',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Spain': '🇪🇸',
      'Portugal': '🇵🇹',
      'United Kingdom': '🇬🇧',
      'Ireland': '🇮🇪',
      'Netherlands': '🇳🇱',
      'Belgium': '🇧🇪',
      'Luxembourg': '🇱🇺',
      'Switzerland': '🇨🇭',
      'Liechtenstein': '🇱🇮',
      'Monaco': '🇲🇨',
      'Andorra': '🇦🇩',
      'San Marino': '🇸🇲',
      'Vatican City': '🇻🇦',
      'Malta': '🇲🇹',
      'Cyprus': '🇨🇾',
      'Iceland': '🇮🇸',
      'Norway': '🇳🇴',
      'Sweden': '🇸🇪',
      'Finland': '🇫🇮',
      'Denmark': '🇩🇰',
      'Estonia': '🇪🇪',
      'Latvia': '🇱🇻',
      'Lithuania': '🇱🇹',
      'Belarus': '🇧🇾',
      'Ukraine': '🇺🇦',
      'Moldova': '🇲🇩',
      'Russia': '🇷🇺',
      'Georgia': '🇬🇪',
      'Armenia': '🇦🇲',
      'Azerbaijan': '🇦🇿',
      'Kazakhstan': '🇰🇿',
      'Uzbekistan': '🇺🇿',
      'Turkmenistan': '🇹🇲',
      'Tajikistan': '🇹🇯',
      'Kyrgyzstan': '🇰🇬',
      'Afghanistan': '🇦🇫',
      'Pakistan': '🇵🇰',
      'India': '🇮🇳',
      'Nepal': '🇳🇵',
      'Bhutan': '🇧🇹',
      'Bangladesh': '🇧🇩',
      'Sri Lanka': '🇱🇰',
      'Maldives': '🇲🇻',
      'Myanmar': '🇲🇲',
      'Thailand': '🇹🇭',
      'Laos': '🇱🇦',
      'Vietnam': '🇻🇳',
      'Cambodia': '🇰🇭',
      'Malaysia': '🇲🇾',
      'Singapore': '🇸🇬',
      'Indonesia': '🇮🇩',
      'Brunei': '🇧🇳',
      'Philippines': '🇵🇭',
      'Taiwan': '🇹🇼',
      'China': '🇨🇳',
      'Mongolia': '🇲🇳',
      'North Korea': '🇰🇵',
      'South Korea': '🇰🇷',
      'Japan': '🇯🇵',
      'Canada': '🇨🇦',
      'United States': '🇺🇸',
      'Mexico': '🇲🇽',
      'Guatemala': '🇬🇹',
      'Belize': '🇧🇿',
      'El Salvador': '🇸🇻',
      'Honduras': '🇭🇳',
      'Nicaragua': '🇳🇮',
      'Costa Rica': '🇨🇷',
      'Panama': '🇵🇦',
      'Cuba': '🇨🇺',
      'Jamaica': '🇯🇲',
      'Haiti': '🇭🇹',
      'Dominican Republic': '🇩🇴',
      'Puerto Rico': '🇵🇷',
      'Trinidad and Tobago': '🇹🇹',
      'Barbados': '🇧🇧',
      'Saint Lucia': '🇱🇨',
      'Saint Vincent and the Grenadines': '🇻🇨',
      'Grenada': '🇬🇩',
      'Antigua and Barbuda': '🇦🇬',
      'Saint Kitts and Nevis': '🇰🇳',
      'Dominica': '🇩🇲',
      'Brazil': '🇧🇷',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Uruguay': '🇺🇾',
      'Paraguay': '🇵🇾',
      'Bolivia': '🇧🇴',
      'Peru': '🇵🇪',
      'Ecuador': '🇪🇨',
      'Colombia': '🇨🇴',
      'Venezuela': '🇻🇪',
      'Guyana': '🇬🇾',
      'Suriname': '🇸🇷',
      'French Guiana': '🇬🇫',
      'Egypt': '🇪🇬',
      'Libya': '🇱🇾',
      'Tunisia': '🇹🇳',
      'Algeria': '🇩🇿',
      'Morocco': '🇲🇦',
      'Sudan': '🇸🇩',
      'South Sudan': '🇸🇸',
      'Ethiopia': '🇪🇹',
      'Eritrea': '🇪🇷',
      'Djibouti': '🇩🇯',
      'Somalia': '🇸🇴',
      'Kenya': '🇰🇪',
      'Uganda': '🇺🇬',
      'Tanzania': '🇹🇿',
      'Rwanda': '🇷🇼',
      'Burundi': '🇧🇮',
      'Democratic Republic of the Congo': '🇨🇩',
      'Republic of the Congo': '🇨🇬',
      'Central African Republic': '🇨🇫',
      'Chad': '🇹🇩',
      'Cameroon': '🇨🇲',
      'Nigeria': '🇳🇬',
      'Niger': '🇳🇪',
      'Mali': '🇲🇱',
      'Burkina Faso': '🇧🇫',
      'Ghana': '🇬🇭',
      'Togo': '🇹🇬',
      'Benin': '🇧🇯',
      'Senegal': '🇸🇳',
      'Gambia': '🇬🇲',
      'Guinea-Bissau': '🇬🇼',
      'Guinea': '🇬🇳',
      'Sierra Leone': '🇸🇱',
      'Liberia': '🇱🇷',
      'Ivory Coast': '🇨🇮',
      'Côte d\'Ivoire': '🇨🇮',
      'Mauritania': '🇲🇷',
      'Western Sahara': '🇪🇭',
      'Angola': '🇦🇴',
      'Zambia': '🇿🇲',
      'Zimbabwe': '🇿🇼',
      'Botswana': '🇧🇼',
      'Namibia': '🇳🇦',
      'South Africa': '🇿🇦',
      'Lesotho': '🇱🇸',
      'Swaziland': '🇸🇿',
      'Mozambique': '🇲🇿',
      'Malawi': '🇲🇼',
      'Madagascar': '🇲🇬',
      'Mauritius': '🇲🇺',
      'Seychelles': '🇸🇨',
      'Comoros': '🇰🇲',
      'Mayotte': '🇾🇹',
      'Reunion': '🇷🇪',
      'Australia': '🇦🇺',
      'New Zealand': '🇳🇿',
      'Papua New Guinea': '🇵🇬',
      'Solomon Islands': '🇸🇧',
      'Vanuatu': '🇻🇺',
      'New Caledonia': '🇳🇨',
      'Fiji': '🇫🇯',
      'Samoa': '🇼🇸',
      'Tonga': '🇹🇴',
      'Kiribati': '🇰🇮',
      'Tuvalu': '🇹🇻',
      'Nauru': '🇳🇷',
      'Palau': '🇵🇼',
      'Marshall Islands': '🇲🇭',
      'Micronesia': '🇫🇲',
      'Cook Islands': '🇨🇰',
      'French Polynesia': '🇵🇫',
      'American Samoa': '🇦🇸',
      'Guam': '🇬🇺',
      'Northern Mariana Islands': '🇲🇵',
      'Hawaii': '🇺🇸'
    };
    return flagMap[country] || '🏳️';
  };

  // Search function
  const searchLocations = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    const searchResults: SearchResult[] = [];
    const seenCountries = new Set<string>();

    // Search for cities and countries
    cities.forEach(city => {
      const cityName = city.name.toLowerCase();
      const countryName = city.country.toLowerCase();

      // Check city name match
      if (cityName.includes(query)) {
        searchResults.push({
          city,
          type: 'city',
          matchedText: city.name
        });
      }

      // Check country name match (only add one city per country)
      if (countryName.includes(query) && !seenCountries.has(city.country)) {
        seenCountries.add(city.country);
        searchResults.push({
          city,
          type: 'country',
          matchedText: city.country
        });
      }
    });

    // Sort results: exact matches first, then by relevance
    return searchResults.sort((a, b) => {
      const aExact = a.matchedText.toLowerCase() === query;
      const bExact = b.matchedText.toLowerCase() === query;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Prioritize cities over countries
      if (a.type === 'city' && b.type === 'country') return -1;
      if (a.type === 'country' && b.type === 'city') return 1;
      
      return a.matchedText.localeCompare(b.matchedText);
    }).slice(0, 8); // Limit to 8 results
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      const searchResults = searchLocations(value);
      setResults(searchResults);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultSelect(results[selectedIndex]);
        } else if (results.length > 0) {
          handleResultSelect(results[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    onLocationSelect(result.city);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  // Handle clear
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
          <Search className="h-5 w-5 text-white/70" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search cities and countries..."
          className="w-full bg-black/50 backdrop-blur-xl border border-white/10 rounded-full py-3 pl-12 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-200"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-white text-gray-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
        >
          {results.map((result, index) => (
            <button
              key={`${result.city.id}-${result.type}`}
              onClick={() => handleResultSelect(result)}
              className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 ${
                selectedIndex === index ? 'bg-white/10' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{getCountryFlag(result.city.country)}</span>
                <div className="flex-1 min-w-0">
                  {result.type === 'city' ? (
                    <>
                      <div className="text-white text-sm font-medium truncate">
                        {result.city.name}
                      </div>
                      <div className="text-gray-400 text-xs truncate">
                        {result.city.country}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-white text-sm font-medium truncate">
                        {result.city.country}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Country
                      </div>
                    </>
                  )}
                </div>
                <div className="text-gray-500 text-xs">
                  {result.type === 'city' ? 'City' : 'Country'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
