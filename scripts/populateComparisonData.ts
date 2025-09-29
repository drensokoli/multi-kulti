import OpenAI from 'openai';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as https from 'https';
import type { CityComparison } from '@/types/comparison';
import type { City } from '@/types/index';

// Configure fetch to ignore SSL certificate issues
const agent = new https.Agent({
  rejectUnauthorized: false
});

const openai = new OpenAI({
  apiKey: "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",
  httpAgent: agent,
});

async function generateComparisonData(cities: string[], shouldSwapOrder: boolean): Promise<CityComparison> {
  const cityNames = shouldSwapOrder ? `${cities[1]} and ${cities[0]}` : `${cities[0]} and ${cities[1]}`;
  const cityIds = cities.map(city => city.toLowerCase().replace(/\s+/g, '-'));

  const prompt = `You are an expert city analyst who creates engaging, memorable comparisons between cities. Your task is to compare these two cities: ${cityNames} and return a JSON object with specific categories that highlight their similarities and differences in an interesting, narrative style.

REQUIREMENTS:
1. Write in an engaging, memorable style
2. Focus on real, concrete details that people can visualize
3. Highlight both similarities and differences between the cities
4. Keep each category concise but vivid
5. Do not use the phrase "melting pot" or "melting pot of cultures"
6. Don't be overly poetic or flowery
7. Don't use cliche phrases like "vibrant city" or "vibrant city life" or "melting pot" or "melting pot of cultures"
8. Don't be overly dramatic

RESPONSE FORMAT:
Return ONLY a valid JSON object with these exact keys:
{
  "cities": ${JSON.stringify(cityIds)},
  "overview": "",
  "population_diversity": "",
  "culture_lifestyle": "",
  "history_resilience": "",
  "modern_life_and_economy": "",
  "life_in_city": ""
}

Overview: A vivid, comparison that captures the essence of both cities in 1-2 sentences,
Population diversity: Compare population sizes, ethnic makeup, and cultural diversity with specific numbers and interesting details,
Culture lifestyle: Contrast cultural practices, entertainment, food scenes, and daily rhythms with concrete examples,
History resilience: Compare historical challenges, defining moments, and how past events shaped each city's character,
Modern life and economy: Contrast current economic drivers, industries, and the pace/feel of contemporary life,
Life in city: State which city is more expensive and by what percentage, which has higher purchasing power and by what percentage, then briefly compare their global quality-of-life rankings
  
STYLE GUIDELINES:
- Use specific numbers, percentages, and concrete details
- Create memorable phrases and comparisons
- Avoid generic descriptions - focus on what makes each city unique
- Balance factual accuracy with engaging narrative
- Make each category feel informative and distinctive`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a cultural expert and comparative analyst who specializes in understanding the connections, similarities, and differences between cities worldwide. You excel at creating engaging narratives that weave together various aspects of urban life, culture, and society while maintaining factual accuracy."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    if (!completion.choices[0].message.content) {
      throw new Error('No content received from OpenAI API');
    }

    const comparisonData = JSON.parse(completion.choices[0].message.content);
    return comparisonData as CityComparison;
  } catch (error) {
    console.error(`Error generating comparison data for ${cityNames}:`, error);
    throw error;
  }
}

async function loadExistingComparisonData(filePath: string): Promise<CityComparison[]> {
  try {
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!fileExists) {
      return [];
    }
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading existing comparison data:', error);
    return [];
  }
}

async function saveToFile(data: CityComparison[], filePath: string): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data saved successfully to ${filePath}`);
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
}

async function main() {
  const cities = [
    "Prishtina",
    "Stockholm",
    "Sarajevo",
    "Tirana",
    "Berlin",
    "Paris",
    "London",    
    "Rome",
    "Madrid",
    "Moscow",
    "Tokyo",
    "Seoul",
    "Delhi",
    "Bangkok",
    "New York",    
    "Los Angeles",
    "San Francisco",
    "Toronto",
    "Mexico City",
    "Chicago",    
    "Buenos Aires",
    "Lima",
    "Bogota",
    "Santiago",
    "Cairo",
    "Johannesburg",    
    "Nairobi",
    "Lagos",
    "Casablanca",
    "Sydney",
    "Melbourne",
    "Addis Ababa",    
    "Dakar",
    "Kinshasa",
    "Istanbul",
    "Dubai",
    "Riyadh",
    "Tehran",
    "Beijing",    
    "Shanghai",
    "Mumbai",
    "Warsaw",
    "Jerusalem",
    "Rio de Janeiro",
    "Karachi",    
    "Singapore",
    "Caracas",
    "Havana",
    "Kyiv",
    "Vienna",
    "Belgrade"
  ];
  
  const comparisonsPath = path.join(process.cwd(), 'public/data/city_comparison.json');

  try {
    let existingComparisons = await loadExistingComparisonData(comparisonsPath);
    
    // Track processed pairs to avoid duplicates
    const processedPairs = new Set(existingComparisons.map(comp => 
      comp.cities.sort().join('-')
    ));

    // Process comparisons for each city with all cities that come after it
    for (let i = 0; i < cities.length - 1; i++) {
      const currentCity = cities[i];
      let comparisonCount = 0;

      for (let j = i + 1; j < cities.length; j++) {
        const otherCity = cities[j];
        const shouldSwapOrder = comparisonCount % 2 === 1; // Alternate order
        const cityPair = shouldSwapOrder ? [otherCity, currentCity] : [currentCity, otherCity];
        
        const pairKey = [currentCity.toLowerCase().replace(/\s+/g, '-'), otherCity.toLowerCase().replace(/\s+/g, '-')].sort().join('-');
        
        if (processedPairs.has(pairKey)) {
          console.log(`Skipping comparison for ${cityPair.join(' and ')} - already processed`);
          continue;
        }

        try {
          console.log(`Generating comparison for ${cityPair.join(' and ')}...`);
          const comparisonData = await generateComparisonData(cityPair, shouldSwapOrder);
          existingComparisons.push(comparisonData);
          await saveToFile(existingComparisons, comparisonsPath);
          console.log(`Successfully processed comparison for ${cityPair.join(' and ')}`);
          
          comparisonCount++;
          
          // Add a delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Failed to process comparison for ${cityPair.join(' and ')}:`, error);
          continue;
        }
      }
    }

    console.log('All city comparisons processed successfully!');
  } catch (error) {
    console.error('Error in main execution:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});