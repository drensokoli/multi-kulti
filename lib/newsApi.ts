interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: Array<{
    article_id: string;
    title: string;
    link: string;
    keywords: string[];
    creator: string[];
    video_url: string | null;
    description: string;
    content: string;
    pubDate: string;
    image_url: string | null;
    source_id: string;
    source_priority: number;
    source_url: string;
    source_icon: string | null;
    language: string;
    country: string[];
    category: string[];
    ai_tag: string;
    sentiment: string;
    sentiment_stats: string;
    ai_region: string;
    ai_org: string;
    duplicate: boolean;
  }>;
}

// Cache interface
interface NewsCache {
  [key: string]: {
    articles: NewsArticle[];
    timestamp: number;
  };
}

// Cache duration: 60 minutes (in milliseconds)
const CACHE_DURATION = 60 * 60 * 1000;

// Get cache from localStorage
const getCache = (): NewsCache => {
  if (typeof window === 'undefined') return {};
  try {
    const cached = localStorage.getItem('multi-kulti-news-cache');
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.warn('Failed to read news cache:', error);
    return {};
  }
};

// Save cache to localStorage
const setCache = (cache: NewsCache): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('multi-kulti-news-cache', JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save news cache:', error);
  }
};

// Generate cache key for city
const getCacheKey = (cityName: string, countryName: string): string => {
  return `${cityName.toLowerCase()}-${countryName.toLowerCase()}`;
};

// Check if cache entry is valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

export const fetchCityNews = async (cityName: string, countryName: string): Promise<NewsArticle[]> => {
  // Check cache first
  const cacheKey = getCacheKey(cityName, countryName);
  const cache = getCache();
  
  if (cache[cacheKey] && isCacheValid(cache[cacheKey].timestamp)) {
    console.log('Using cached news for:', cityName, countryName);
    return cache[cacheKey].articles;
  }

  try {
    console.log('Fetching news for:', cityName, countryName);
    
    // Call our internal API route
    const response = await fetch(`/api/news?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(countryName)}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.articles) {
      console.log('Fetched articles:', data.articles);
      
      // Save to cache
      const updatedCache = { ...cache };
      updatedCache[cacheKey] = {
        articles: data.articles,
        timestamp: Date.now()
      };
      setCache(updatedCache);
      console.log('Cached news for:', cityName, countryName);
      
      return data.articles;
    } else {
      console.error('No articles in response:', data);
      return [];
    }
    
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const formatNewsDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};
