export interface IActivity {
  id: string;
  name: string;
  description: string;
  time: string; // HH:MM format
  duration: number; // in minutes
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  category: "attraction" | "dining" | "accommodation" | "transport" | "shopping" | "activity";
  estimatedCost?: number;
  notes?: string;
}

export interface IDayItinerary {
  day: number;
  date: Date;
  weather?: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  activities: IActivity[];
  summary?: string;
}

export interface IItinerary {
  userId: string;
  destination: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  startDate: Date;
  endDate: Date;
  duration: number; // in days
  dayItineraries: IDayItinerary[];
  budget?: number;
  travelStyle?: "budget" | "comfort" | "luxury";
  preferences?: string[]; // e.g., ["beaches", "hiking", "local food"]
  aiGenerated: boolean;
  aiNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
