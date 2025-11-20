export interface CreateItineraryDTO {
  destination: string;
  startDate: string; 
  endDate: string; 
  budget?: number;
  travelStyle?: "budget" | "comfort" | "luxury";
  preferences?: string[];
  useAI?: boolean; 
}

export interface UpdateItineraryDTO {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelStyle?: "budget" | "comfort" | "luxury";
  preferences?: string[];
  dayItineraries?: any[];
  aiNotes?: string;
}

export interface GenerateItineraryDTO {
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  travelStyle: "budget" | "comfort" | "luxury";
  preferences?: string[];
  numberOfDays: number;
}

export interface GetCoordinatesDTO {
  destination: string;
}

export interface GetWeatherDTO {
  latitude: number;
  longitude: number;
  date?: string;
}

export interface GenerateActivityDTO {
  day: number;
  destination: string;
  date: string;
  weather?: string;
  preferences?: string[];
  budget?: number;
}
