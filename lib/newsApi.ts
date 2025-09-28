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

const NEWS_API_KEY_1 = process.env.NEXT_PUBLIC_NEWS_API_KEY_1;
const NEWS_API_KEY_2 = process.env.NEXT_PUBLIC_NEWS_API_KEY_2;

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

// Helper function to try API request with a specific key
const tryApiRequest = async (url: string, apiKey: string): Promise<NewsDataResponse> => {
  const response = await fetch(url.replace('${API_KEY}', apiKey), {
    headers: {
      'User-Agent': 'Multi-Kulti/1.0'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const fetchCityNews = async (cityName: string, countryName: string): Promise<NewsArticle[]> => {
  if (!NEWS_API_KEY_1 && !NEWS_API_KEY_2) {
    console.warn('No News API keys found');
    return [];
  }

  // Check cache first
  const cacheKey = getCacheKey(cityName, countryName);
  const cache = getCache();
  
  if (cache[cacheKey] && isCacheValid(cache[cacheKey].timestamp)) {
    console.log('Using cached news for:', cityName, countryName);
    return cache[cacheKey].articles;
  }

  try {
    // Map country names to ISO country codes for newsdata.io
    const countryCodeMap: { [key: string]: string } = {
      'Kosovo': 'xk',
      'United States': 'us',
      'United Kingdom': 'gb',
      'Germany': 'de',
      'France': 'fr',
      'Italy': 'it',
      'Spain': 'es',
      'Netherlands': 'nl',
      'Belgium': 'be',
      'Switzerland': 'ch',
      'Austria': 'at',
      'Sweden': 'se',
      'Norway': 'no',
      'Denmark': 'dk',
      'Finland': 'fi',
      'Poland': 'pl',
      'Czech Republic': 'cz',
      'Hungary': 'hu',
      'Romania': 'ro',
      'Bulgaria': 'bg',
      'Greece': 'gr',
      'Turkey': 'tr',
      'Russia': 'ru',
      'Ukraine': 'ua',
      'Japan': 'jp',
      'South Korea': 'kr',
      'China': 'cn',
      'India': 'in',
      'Australia': 'au',
      'Canada': 'ca',
      'Brazil': 'br',
      'Argentina': 'ar',
      'Mexico': 'mx',
      'South Africa': 'za',
      'Egypt': 'eg',
      'Nigeria': 'ng',
      'Kenya': 'ke',
      'Morocco': 'ma',
      'Tunisia': 'tn',
      'Algeria': 'dz',
      'Israel': 'il',
      'Saudi Arabia': 'sa',
      'United Arab Emirates': 'ae',
      'Qatar': 'qa',
      'Kuwait': 'kw',
      'Bahrain': 'bh',
      'Oman': 'om',
      'Jordan': 'jo',
      'Lebanon': 'lb',
      'Syria': 'sy',
      'Iraq': 'iq',
      'Iran': 'ir',
      'Afghanistan': 'af',
      'Pakistan': 'pk',
      'Bangladesh': 'bd',
      'Sri Lanka': 'lk',
      'Nepal': 'np',
      'Bhutan': 'bt',
      'Myanmar': 'mm',
      'Thailand': 'th',
      'Vietnam': 'vn',
      'Cambodia': 'kh',
      'Laos': 'la',
      'Malaysia': 'my',
      'Singapore': 'sg',
      'Indonesia': 'id',
      'Philippines': 'ph',
      'Taiwan': 'tw',
      'Hong Kong': 'hk',
      'Macau': 'mo',
      'New Zealand': 'nz',
      'Fiji': 'fj',
      'Papua New Guinea': 'pg',
      'Chile': 'cl',
      'Peru': 'pe',
      'Colombia': 'co',
      'Venezuela': 've',
      'Ecuador': 'ec',
      'Bolivia': 'bo',
      'Paraguay': 'py',
      'Uruguay': 'uy',
      'Guyana': 'gy',
      'Suriname': 'sr',
      'French Guiana': 'gf'
    };

    const countryCode = countryCodeMap[countryName] || countryName.toLowerCase();
    
    // Use newsdata.io API with placeholder for key rotation
    const url = `https://newsdata.io/api/1/latest?apikey=\${API_KEY}&q=${encodeURIComponent(cityName)}&country=${countryCode}&size=3`;
    
    console.log('Fetching news for:', cityName, countryName);
    console.log('Country code:', countryCode);
    
    let data: NewsDataResponse | undefined;
    let lastError: Error | null = null;
    
    // Try API key 1 first
    if (NEWS_API_KEY_1) {
      try {
        console.log('Trying API key 1...');
        data = await tryApiRequest(url, NEWS_API_KEY_1);
        console.log('API key 1 successful');
      } catch (error) {
        console.warn('API key 1 failed:', error);
        lastError = error as Error;
      }
    }
    
    // If API key 1 failed or doesn't exist, try API key 2
    if (!data && NEWS_API_KEY_2) {
      try {
        console.log('Trying API key 2...');
        data = await tryApiRequest(url, NEWS_API_KEY_2);
        console.log('API key 2 successful');
      } catch (error) {
        console.warn('API key 2 failed:', error);
        lastError = error as Error;
      }
    }
    
    // If both keys failed, throw the last error
    if (!data) {
      throw lastError || new Error('All API keys failed');
    }
    
    console.log('News API response:', data);
    
    if (data.status === 'success') {
      const articles: NewsArticle[] = data.results.map(article => ({
        title: article.title,
        description: article.description,
        url: article.link,
        urlToImage: article.image_url,
        publishedAt: article.pubDate,
        source: {
          name: article.source_id
        }
      })).filter(article => 
        article.title && 
        article.url && 
        !article.title.includes('[Removed]')
      );
      
      console.log('Mapped articles:', articles);
      
      // Save to cache
      const updatedCache = { ...cache };
      updatedCache[cacheKey] = {
        articles,
        timestamp: Date.now()
      };
      setCache(updatedCache);
      console.log('Cached news for:', cityName, countryName);
      
      return articles;
    } else {
      console.error('News API returned error status:', data.status);
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
