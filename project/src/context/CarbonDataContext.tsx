import React, { createContext, useContext, useState, useEffect } from 'react';
import { openai } from '../utils/openaiClient'
export interface SurveyData {
  transportation: {
    primary: string;
    distance: number;
    frequency: number;
  };
  diet: string;
  energy: {
    electricityUsage: number;
    renewablePercentage: number;
  };
  shopping: {
    frequency: string;
    preferences: string[];
  };
}

export interface CarbonFootprint {
  transportation: number;
  diet: number;
  energy: number;
  shopping: number;
  total: number;
  unit: string;
}

export interface UserInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: number;
  createdAt: Date;
}

interface CarbonDataContextType {
  surveyData: SurveyData | null;
  footprint: CarbonFootprint | null;
  insights: UserInsight[];
  saveSurveyData: (data: SurveyData) => void;
  calculateFootprint: (data: SurveyData) => CarbonFootprint;
  getRecommendations: () => Promise<UserInsight[]>;
  loading: boolean;
}

// Removed unused defaultSurveyData to resolve the compile error.

// Carbon emission factors (simplified for demo)
const emissionFactors = {
  transportation: {
    car: 0.192, // kg CO2 per km
    bus: 0.105, // kg CO2 per km
    train: 0.041, // kg CO2 per km
    bike: 0, // kg CO2 per km
    walk: 0, // kg CO2 per km
  },
  diet: {
    vegan: 1.5, // kg CO2 per day
    vegetarian: 2.5, // kg CO2 per day
    pescatarian: 3.5, // kg CO2 per day
    mixed: 4.5, // kg CO2 per day
    highMeat: 7.2, // kg CO2 per day
  },
  energy: {
    // Base factor for electricity (kg CO2 per kWh)
    electricityBase: 0.233,
  },
  shopping: {
    rarely: 0.5, // multiplier
    monthly: 1.0, // multiplier
    weekly: 1.5, // multiplier
    frequently: 2.0, // multiplier
  },
};

// Sample insights
const sampleInsights: UserInsight[] = [
  {
    id: '1',
    category: 'transportation',
    title: 'Consider carpooling to work',
    description: 'Sharing your ride to work just twice a week could reduce your transportation emissions by up to 20%.',
    impact: 0.8,
    createdAt: new Date(),
  },
  {
    id: '2',
    category: 'diet',
    title: 'Try a meatless Monday',
    description: 'Replacing meat with plant-based alternatives one day a week can reduce your diet-related carbon footprint.',
    impact: 0.7,
    createdAt: new Date(),
  },
  {
    id: '3',
    category: 'energy',
    title: 'Optimize your thermostat',
    description: 'Adjusting your thermostat by just 1-2 degrees can save energy and reduce your carbon emissions.',
    impact: 0.6,
    createdAt: new Date(),
  },
  {
    id: '4',
    category: 'shopping',
    title: 'Buy local seasonal produce',
    description: 'Local and seasonal foods require less transportation and often less energy to produce.',
    impact: 0.5,
    createdAt: new Date(),
  },
];

const CarbonDataContext = createContext<CarbonDataContextType | undefined>(undefined);

export const useCarbonData = () => {
  const context = useContext(CarbonDataContext);
  if (context === undefined) {
    throw new Error('useCarbonData must be used within a CarbonDataProvider');
  }
  return context;
};

export const CarbonDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [footprint, setFootprint] = useState<CarbonFootprint | null>(null);
  const [insights, setInsights] = useState<UserInsight[]>([]);
  const [loading, setLoading] = useState(false);

  // Load saved data on initial render
  useEffect(() => {
    const savedSurveyData = localStorage.getItem('surveyData');
    const savedFootprint = localStorage.getItem('footprint');
    const savedInsights = localStorage.getItem('insights');
    
    if (savedSurveyData) {
      setSurveyData(JSON.parse(savedSurveyData));
    }
    
    if (savedFootprint) {
      setFootprint(JSON.parse(savedFootprint));
    }
    
    if (savedInsights) {
      setInsights(JSON.parse(savedInsights));
    } else {
      // Use sample insights if none are saved
      setInsights(sampleInsights);
      localStorage.setItem('insights', JSON.stringify(sampleInsights));
    }
  }, []);

  const saveSurveyData = (data: SurveyData) => {
    setSurveyData(data);
    localStorage.setItem('surveyData', JSON.stringify(data));
    
    // Calculate and save footprint
    const calculatedFootprint = calculateFootprint(data);
    setFootprint(calculatedFootprint);
    localStorage.setItem('footprint', JSON.stringify(calculatedFootprint));
  };

  const calculateFootprint = (data: SurveyData): CarbonFootprint => {
    // Transportation emissions
    const transportEmissions = 
      emissionFactors.transportation[data.transportation.primary as keyof typeof emissionFactors.transportation] * 
      data.transportation.distance * 
      data.transportation.frequency * 
      4.3; // Average weeks in a month
    
    // Diet emissions
    const dietEmissions = 
      emissionFactors.diet[data.diet as keyof typeof emissionFactors.diet] * 30; // Monthly
    
    // Energy emissions
    const energyEmissions = 
      (data.energy.electricityUsage * emissionFactors.energy.electricityBase) * 
      (1 - (data.energy.renewablePercentage / 100)); // Adjust for renewable percentage
    
    // Shopping emissions - base value with multiplier based on frequency
    const shoppingBase = 100; // kg CO2 baseline
    const shoppingEmissions = 
      shoppingBase * 
      emissionFactors.shopping[data.shopping.frequency as keyof typeof emissionFactors.shopping];
    
    // Calculate total emissions
    const totalEmissions = transportEmissions + dietEmissions + energyEmissions + shoppingEmissions;
    
    return {
      transportation: parseFloat(transportEmissions.toFixed(2)),
      diet: parseFloat(dietEmissions.toFixed(2)),
      energy: parseFloat(energyEmissions.toFixed(2)),
      shopping: parseFloat(shoppingEmissions.toFixed(2)),
      total: parseFloat(totalEmissions.toFixed(2)),
      unit: 'kg CO₂e/month',
    };
  };

  // Mock API call to get AI recommendations
  const getRecommendations = async (): Promise<UserInsight[]> => {
    setLoading(true);
    try {
      const prompt = `
        Based on a user's carbon footprint, suggest 3 personalized sustainability tips.
        Each tip should include:
        - category (e.g. transportation, energy, diet, shopping)
        - title
        - description
        - impact (scale from 0.1 to 1.0)
  
        Respond in JSON array format with keys: id, category, title, description, impact.
      `;
  
      const completion = await openai.chat.completions.create({
        model: 'gpt-4', // or 'gpt-3.5-turbo'
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });
  
      const responseText = completion.choices[0].message.content || '';
      const parsedInsights: UserInsight[] = JSON.parse(responseText).map((item: { category: string; title: string; description: string; impact: number; id?: string }, index: number) => ({
        ...item,
        createdAt: new Date(),
        id: item.id ?? String(index + 1),
      }));
  
      setInsights(parsedInsights);
      localStorage.setItem('insights', JSON.stringify(parsedInsights));
      return parsedInsights;
  
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      return sampleInsights; // fallback to mock
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <CarbonDataContext.Provider
      value={{
        surveyData,
        footprint,
        insights,
        saveSurveyData,
        calculateFootprint,
        getRecommendations,
        loading,
      }}
    >
      {children}
    </CarbonDataContext.Provider>
    );
  };