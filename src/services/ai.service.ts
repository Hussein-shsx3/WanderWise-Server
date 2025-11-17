import axios from "axios";
import { AppError } from "../middleware/errorMiddleware";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.io/api/v1";

interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Generate a travel itinerary using AI
 */
export const generateTravelItinerary = async (
  destination: string,
  startDate: string,
  endDate: string,
  budget: number | undefined,
  travelStyle: "budget" | "comfort" | "luxury",
  preferences: string[] | undefined,
  numberOfDays: number
): Promise<string> => {
  try {
    const preferencesText = preferences ? preferences.join(", ") : "general tourism";
    const budgetText = budget ? `$${budget}` : "flexible";

    const prompt = `You are an expert travel planner for the AI trip planner app "WanderWise". Create a detailed ${numberOfDays}-day travel itinerary for a trip to ${destination}.

Trip Details:
- Dates: ${startDate} to ${endDate}
- Travel Style: ${travelStyle}
- Budget: ${budgetText}
- Interests: ${preferencesText}

Please provide:
1. A brief summary of the trip
2. For each day:
   - Recommended activities with estimated times
   - Local restaurants or dining recommendations
   - Estimated costs
   - Travel tips specific to that location
3. Overall tips for the destination
4. Best areas to stay
5. Transportation recommendations

Format your response in a structured way that can be parsed. Use clear day-by-day breakdown.`;

    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.CORS_ORIGIN || "http://localhost:3000",
          "X-Title": "WanderWise",
        },
      }
    );

    if (!response.data.choices || !response.data.choices[0].message) {
      throw new Error("Invalid response from AI service");
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new AppError(
      "Failed to generate itinerary with AI",
      500,
      "AI_SERVICE_ERROR"
    );
  }
};

/**
 * Generate activity suggestions for a specific day
 */
export const generateDayActivities = async (
  destination: string,
  dayNumber: number,
  totalDays: number,
  weather: string,
  preferences: string[] | undefined,
  budget: number | undefined,
  travelStyle: "budget" | "comfort" | "luxury"
): Promise<string> => {
  try {
    const preferencesText = preferences ? preferences.join(", ") : "general sightseeing";
    const budgetPerDay = budget ? Math.round(budget / totalDays) : "flexible";

    const prompt = `You are a travel expert for the WanderWise app. Generate activity suggestions for Day ${dayNumber} of a ${totalDays}-day trip to ${destination}.

Constraints:
- Weather: ${weather}
- Daily Budget: $${budgetPerDay}
- Travel Style: ${travelStyle}
- Interests: ${preferencesText}

Please suggest:
1. 4-5 activities with specific times (HH:MM format)
2. Duration for each activity (in minutes)
3. Estimated cost
4. Brief description of each activity
5. Location type (attraction, dining, accommodation, etc.)

Format as a clear list with exact times and costs.`;

    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.CORS_ORIGIN || "http://localhost:3000",
          "X-Title": "WanderWise",
        },
      }
    );

    if (!response.data.choices || !response.data.choices[0].message) {
      throw new Error("Invalid response from AI service");
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new AppError(
      "Failed to generate day activities",
      500,
      "AI_SERVICE_ERROR"
    );
  }
};

/**
 * Get travel tips for a destination
 */
export const getTravelTips = async (
  destination: string,
  travelStyle: "budget" | "comfort" | "luxury"
): Promise<string> => {
  try {
    const prompt = `As a travel expert, provide 5-7 essential travel tips for ${destination} for a ${travelStyle} traveler. Cover topics like: local customs, transportation, safety, food, best times to visit, local language, and money-saving tips (if applicable). Keep it concise and practical.`;

    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.CORS_ORIGIN || "http://localhost:3000",
          "X-Title": "WanderWise",
        },
      }
    );

    if (!response.data.choices || !response.data.choices[0].message) {
      throw new Error("Invalid response from AI service");
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new AppError(
      "Failed to get travel tips",
      500,
      "AI_SERVICE_ERROR"
    );
  }
};
