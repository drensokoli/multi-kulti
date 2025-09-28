import { NextRequest, NextResponse } from 'next/server';

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

const NEWS_API_KEY_1 = process.env.NEWS_API_KEY_1;
const NEWS_API_KEY_2 = process.env.NEWS_API_KEY_2;

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cityName = searchParams.get('city');
  const countryName = searchParams.get('country');

  if (!cityName || !countryName) {
    return NextResponse.json({ error: 'City and country parameters are required' }, { status: 400 });
  }

  if (!NEWS_API_KEY_1 && !NEWS_API_KEY_2) {
    return NextResponse.json({ error: 'No API keys configured' }, { status: 500 });
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
    
    let data: NewsDataResponse | undefined;
    let lastError: Error | null = null;
    
    // Try API key 1 first
    if (NEWS_API_KEY_1) {
      try {
        data = await tryApiRequest(url, NEWS_API_KEY_1);
      } catch (error) {
        lastError = error as Error;
      }
    }
    
    // If API key 1 failed or doesn't exist, try API key 2
    if (!data && NEWS_API_KEY_2) {
      try {
        data = await tryApiRequest(url, NEWS_API_KEY_2);
      } catch (error) {
        lastError = error as Error;
      }
    }
    
    // If both keys failed, throw the last error
    if (!data) {
      throw lastError || new Error('All API keys failed');
    }
    
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
      
      return NextResponse.json({ articles });
    } else {
      return NextResponse.json({ error: 'News API returned error status' }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
