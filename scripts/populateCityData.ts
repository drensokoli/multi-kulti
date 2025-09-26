import OpenAI from 'openai';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as https from 'https';

// Types
interface Currency {
  name: string;
  symbol: string;
}

interface Culture {
  traditional_arts: string;
  traditional_music: string;
  traditional_clothing: string;
  traditional_beliefs: string;
}

interface FoodDrink {
  name: string;
  description: string;
  image: string;
}

interface FamousPerson {
  name: string;
  description: string;
  image: string;
}

interface Landmark {
  name: string;
  description: string;
  image: string;
}

interface LifeIn {
  cost_of_living: string;
  quality_of_life: string;
}

interface CityData {
  id: string;
  name: string;
  country: string;
  flag: string;
  lat: string;
  lng: string;
  images: string[];
  timezones: string[];
  currency: Currency;
  city_size: string;
  population_size: string;
  population_diversity: string;
  languages: string[];
  religions: string[];
  culture: Culture;
  traditional_foods: FoodDrink[];
  traditional_drinks: FoodDrink[];
  history: string;
  adversity_resilience: string;
  famous_people: FamousPerson[];
  economy_industry: string;
  tourism_attractions: string;
  landmarks: Landmark[];
  sister_cities: string[];
  life_in: LifeIn;
}

// Configure fetch to ignore SSL certificate issues
const agent = new https.Agent({
  rejectUnauthorized: false
});

const openai = new OpenAI({
  apiKey: "",
  httpAgent: agent,
});

async function generateCityData(cityName: string): Promise<CityData> {
  const prompt = `Generate detailed information about ${cityName} following this exact JSON structure:

{
  "id": "",
  "name": "${cityName}",
  "country": "",
  "flag": "",
  "lat": "",
  "lng": "",
  "images": ["", "", ""],
  "timezones": [""],
  "currency": {
    "name": "",
    "symbol": ""
  },
  "city_size": "",
  "population_size": "",
  "population_diversity": "",
  "languages": [""],
  "religions": [""],
  "culture": {
    "traditional_arts": "",
    "traditional_music": "",
    "traditional_clothing": "",
    "traditional_beliefs": ""
  },
  "traditional_foods": [
    {
      "name": "",
      "description": "",
      "image": ""
    },
    {
      "name": "",
      "description": "",
      "image": ""
    },
    {
      "name": "",
      "description": "",
      "image": ""
    }
  ],
  "traditional_drinks": [
    {
      "name": "",
      "description": "",
      "image": ""
    },
    {
      "name": "",
      "description": "",
      "image": ""
    }
  ],
  "history": "",
  "adversity_resilience": "",
  "famous_people": [
    {
      "name": "",
      "description": "",
      "image": ""
    },
    {
      "name": "",
      "description": "",
      "image": ""
    },
    {
      "name": "",
      "description": "",
      "image": ""
    }
  ],
  "economy_industry": "",
  "tourism_attractions": "",
  "landmarks": [
    {
      "name": "",
      "description": "",
      "image": ""
    },
    {
      "name": "",
      "description": "",
      "image": ""
    },
    {
      "name": "",
      "description": "",
      "image": ""
    }
  ],
  "sister_cities": ["", "", ""],
  "life_in": {
    "cost_of_living": "",
    "quality_of_life": ""
  }
}

Fill in all fields with engaging, vivid information about ${cityName} that captures the reader's interest while remaining accurate. Make the content feel like a story rather than just facts.

Word count guidelines for longer texts:
- population_diversity: ~50 words - Paint a picture of the city's diverse communities and how they interact
- culture fields (arts/music/clothing/beliefs): ~50 words each - Focus on unique, fascinating aspects that make the culture special
- history: ~100 words - Tell the city's story as an engaging narrative
- adversity_resilience: ~100 words - Share compelling stories of how the city overcame challenges
- economy_industry: ~100 words - Describe the economic landscape in an interesting way
- life_in fields (cost/quality): ~50 words each - Give readers a accurate data and a real feel for daily life based on good sources

For descriptions (foods/drinks/landmarks/people):
- Use 2 sentences to describe the food/drink/landmark/person

Array requirements:
- images: exactly 3 items
- traditional_foods: exactly 3 signature dishes
- traditional_drinks: exactly 2 unique beverages
- famous_people: exactly 3 notable figures
- landmarks: exactly 3 must-see places
- sister_cities: exactly 3 city IDs

For all image fields, try to find a good image URL from the internet that is related to the field and the content. If you can't find a good image, use "TO_BE_REPLACED" as the value.

Remember: Write in an engaging and interesting way while maintaining accuracy.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable assistant and cultural expert who provides detailed, accurate information about cities worldwide in a structured JSON format. At the same time, you present each city in a clear, engaging, and interesting way, helping readers understand its character and key features through vivid but accurate descriptions, keeping the content interesting without over-dramatizing."
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

    let cityData = JSON.parse(completion.choices[0].message.content);
    
    // Validate and ensure required arrays exist with correct length
    cityData.images = Array.isArray(cityData.images) ? cityData.images.slice(0, 3) : ["TO_BE_REPLACED", "TO_BE_REPLACED", "TO_BE_REPLACED"];
    cityData.traditional_foods = Array.isArray(cityData.traditional_foods) ? cityData.traditional_foods.slice(0, 3) : Array(3).fill({ name: "", description: "", image: "TO_BE_REPLACED" });
    cityData.traditional_drinks = Array.isArray(cityData.traditional_drinks) ? cityData.traditional_drinks.slice(0, 2) : Array(2).fill({ name: "", description: "", image: "TO_BE_REPLACED" });
    cityData.famous_people = Array.isArray(cityData.famous_people) ? cityData.famous_people.slice(0, 3) : Array(3).fill({ name: "", description: "", image: "TO_BE_REPLACED" });
    cityData.landmarks = Array.isArray(cityData.landmarks) ? cityData.landmarks.slice(0, 3) : Array(3).fill({ name: "", description: "", image: "TO_BE_REPLACED" });
    cityData.sister_cities = Array.isArray(cityData.sister_cities) ? cityData.sister_cities.slice(0, 3) : ["", "", ""];
    
    // Ensure arrays have minimum length
    while (cityData.images.length < 3) cityData.images.push("TO_BE_REPLACED");
    while (cityData.traditional_foods.length < 3) cityData.traditional_foods.push({ name: "", description: "", image: "TO_BE_REPLACED" });
    while (cityData.traditional_drinks.length < 2) cityData.traditional_drinks.push({ name: "", description: "", image: "TO_BE_REPLACED" });
    while (cityData.famous_people.length < 3) cityData.famous_people.push({ name: "", description: "", image: "TO_BE_REPLACED" });
    while (cityData.landmarks.length < 3) cityData.landmarks.push({ name: "", description: "", image: "TO_BE_REPLACED" });
    while (cityData.sister_cities.length < 3) cityData.sister_cities.push("");

    // Ensure the ID and name are set correctly
    cityData.id = cityName.toLowerCase().replace(/\s+/g, '-');
    cityData.name = cityName;

    // Ensure all image fields are set
    cityData.images = cityData.images.map((img: string) => img || "TO_BE_REPLACED");
    cityData.traditional_foods = cityData.traditional_foods.map((food: FoodDrink) => ({
      ...food,
      name: food.name || "",
      description: food.description || "",
      image: food.image || "TO_BE_REPLACED"
    }));
    cityData.traditional_drinks = cityData.traditional_drinks.map((drink: FoodDrink) => ({
      ...drink,
      name: drink.name || "",
      description: drink.description || "",
      image: drink.image || "TO_BE_REPLACED"
    }));
    cityData.famous_people = cityData.famous_people.map((person: FamousPerson) => ({
      ...person,
      name: person.name || "",
      description: person.description || "",
      image: person.image || "TO_BE_REPLACED"
    }));
    cityData.landmarks = cityData.landmarks.map((landmark: Landmark) => ({
      ...landmark,
      name: landmark.name || "",
      description: landmark.description || "",
      image: landmark.image || "TO_BE_REPLACED"
    }));

    return cityData;
  } catch (error) {
    console.error(`Error generating data for ${cityName}:`, error);
    throw error;
  }
}

async function saveToFile(data: CityData[], filePath: string): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data saved successfully to ${filePath}`);
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
}

async function loadExistingData(filePath: string): Promise<CityData[]> {
  try {
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!fileExists) {
      return [];
    }
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading existing data:', error);
    return [];
  }
}

async function main() {
  const cities = [
    "Prishtina",
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
    "New York City",
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
    "Stockholm"
  ];

  const outputPath = path.join(process.cwd(), 'public/data/cities.json');
  let existingData = await loadExistingData(outputPath);
  const processedCities = new Set(existingData.map(city => city.name));

  for (const city of cities) {
    if (processedCities.has(city)) {
      console.log(`Skipping ${city} - already processed`);
      continue;
    }

    try {
      console.log(`Processing ${city}...`);
      const cityData = await generateCityData(city);
      existingData.push(cityData);
      await saveToFile(existingData, outputPath);
      console.log(`Successfully processed ${city}`);
      
      // Add a delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to process ${city}:`, error);
      // Continue with the next city
      continue;
    }
  }

  console.log('All cities processed successfully!');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
