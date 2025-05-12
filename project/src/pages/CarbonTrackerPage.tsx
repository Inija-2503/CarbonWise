import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike, Train, Utensils, Lightbulb, ShoppingBag, Check, ArrowRight, Info } from 'lucide-react';
import { CarbonDataProvider, useCarbonData, SurveyData } from '../context/CarbonDataContext';

// Wrapper component to ensure context is available
const CarbonTrackerPageWrapper: React.FC = () => {
  return (
    <CarbonDataProvider>
      <CarbonTrackerContent />
    </CarbonDataProvider>
  );
};

const CarbonTrackerContent: React.FC = () => {
  const { saveSurveyData } = useCarbonData();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    transportation: {
      primary: 'car',
      distance: 15,
      frequency: 5,
    },
    diet: 'mixed',
    energy: {
      electricityUsage: 250,
      renewablePercentage: 20,
    },
    shopping: {
      frequency: 'weekly',
      preferences: ['local'],
    },
  });

  const updateSurveyData = (field: string, value: any) => {
    setSurveyData((prev) => {
      const newData = { ...prev };
      const fields = field.split('.');
      
      if (fields.length === 1) {
        (newData as any)[fields[0]] = value;
      } else if (fields.length === 2) {
        (newData as any)[fields[0]][fields[1]] = value;
      }
      
      return newData;
    });
  };

  const handleShoppingPreferences = (preference: string) => {
    setSurveyData((prev) => {
      const newPreferences = [...prev.shopping.preferences];
      
      if (newPreferences.includes(preference)) {
        const index = newPreferences.indexOf(preference);
        newPreferences.splice(index, 1);
      } else {
        newPreferences.push(preference);
      }
      
      return {
        ...prev,
        shopping: {
          ...prev.shopping,
          preferences: newPreferences,
        },
      };
    });
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit the survey
      saveSurveyData(surveyData);
      navigate('/dashboard');
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Transportation</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Let's understand your travel habits to calculate your transportation carbon footprint.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What is your primary mode of transportation?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { value: 'car', label: 'Car', icon: <Car className="h-6 w-6 mb-2" /> },
                    { value: 'bus', label: 'Bus', icon: <Train className="h-6 w-6 mb-2" /> },
                    { value: 'train', label: 'Train', icon: <Train className="h-6 w-6 mb-2" /> },
                    { value: 'bike', label: 'Bicycle', icon: <Bike className="h-6 w-6 mb-2" /> },
                    { value: 'walk', label: 'Walking', icon: <Bike className="h-6 w-6 mb-2" /> },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateSurveyData('transportation.primary', option.value)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors duration-200 ${
                        surveyData.transportation.primary === option.value
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Approximately how many kilometers do you travel per day?
                </label>
                <input
                  type="number"
                  id="distance"
                  value={surveyData.transportation.distance}
                  onChange={(e) => updateSurveyData('transportation.distance', parseInt(e.target.value) || 0)}
                  min="0"
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How many days per week do you typically commute?
                </label>
                <input
                  type="range"
                  id="frequency"
                  min="0"
                  max="7"
                  step="1"
                  value={surveyData.transportation.frequency}
                  onChange={(e) => updateSurveyData('transportation.frequency', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center mt-2 text-gray-700 dark:text-gray-300">
                  {surveyData.transportation.frequency} days per week
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Diet & Food</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your diet has a significant impact on your carbon footprint. Let's understand your eating habits.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Which option best describes your diet?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'vegan', label: 'Vegan (plant-based only)', description: 'No animal products' },
                  { value: 'vegetarian', label: 'Vegetarian', description: 'No meat, may include dairy and eggs' },
                  { value: 'pescatarian', label: 'Pescatarian', description: 'Vegetarian plus fish/seafood' },
                  { value: 'mixed', label: 'Mixed diet with moderate meat', description: 'Meat a few times per week' },
                  { value: 'highMeat', label: 'High meat consumption', description: 'Meat daily, often multiple times' },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => updateSurveyData('diet', option.value)}
                    className={`flex items-center p-4 border rounded-lg transition-all duration-200 cursor-pointer ${
                      surveyData.diet === option.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Utensils className={`h-5 w-5 mr-2 ${surveyData.diet === option.value ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={`font-medium ${surveyData.diet === option.value ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>
                          {option.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                    {surveyData.diet === option.value && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Home Energy</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your energy consumption at home contributes to your carbon footprint. Let's understand your energy usage.
            </p>
            
            <div>
              <label htmlFor="electricityUsage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Approximately how many kilowatt-hours (kWh) of electricity does your household use per month?
                <span className="inline-block ml-1 text-gray-500 dark:text-gray-400">
                  <Info className="h-4 w-4 inline-block" />
                  <span className="ml-1 text-xs">(Check your electricity bill or estimate)</span>
                </span>
              </label>
              <input
                type="number"
                id="electricityUsage"
                value={surveyData.energy.electricityUsage}
                onChange={(e) => updateSurveyData('energy.electricityUsage', parseInt(e.target.value) || 0)}
                min="0"
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Average household in USA: ~900 kWh, in Europe: ~400 kWh
              </p>
            </div>
            
            <div>
              <label htmlFor="renewablePercentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What percentage of your electricity comes from renewable sources?
                <span className="inline-block ml-1 text-gray-500 dark:text-gray-400">
                  <Info className="h-4 w-4 inline-block" />
                  <span className="ml-1 text-xs">(Check with your utility provider or estimate)</span>
                </span>
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="renewablePercentage"
                  min="0"
                  max="100"
                  step="5"
                  value={surveyData.energy.renewablePercentage}
                  onChange={(e) => updateSurveyData('energy.renewablePercentage', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-3 w-12 text-gray-700 dark:text-gray-300">
                  {surveyData.energy.renewablePercentage}%
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${surveyData.energy.renewablePercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <div className="flex">
                <Lightbulb className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Energy-Saving Tip</h4>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">
                    Switching to LED bulbs, unplugging devices when not in use, and using a programmable thermostat can significantly reduce your energy consumption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Shopping & Consumption</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your shopping habits impact your carbon footprint through the production, transportation, and disposal of goods.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How often do you shop for non-essential items (clothing, electronics, etc.)?
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { value: 'rarely', label: 'Rarely' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'frequently', label: 'Frequently' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateSurveyData('shopping.frequency', option.value)}
                    className={`flex items-center justify-center p-3 border rounded-lg transition-colors duration-200 ${
                      surveyData.shopping.frequency === option.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Which of the following do you prioritize when shopping? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'local', label: 'Locally made products' },
                  { value: 'sustainable', label: 'Sustainable/eco-friendly' },
                  { value: 'secondhand', label: 'Secondhand/used goods' },
                  { value: 'minimal', label: 'Minimal packaging' },
                  { value: 'durable', label: 'Durable/long-lasting' },
                  { value: 'organic', label: 'Organic products' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleShoppingPreferences(option.value)}
                    className={`flex items-center justify-center p-3 border rounded-lg transition-colors duration-200 ${
                      surveyData.shopping.preferences.includes(option.value)
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {surveyData.shopping.preferences.includes(option.value) && (
                      <Check className="h-5 w-5 mr-2" />
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Almost done!</strong> After submitting this survey, we'll calculate your carbon footprint and provide personalized recommendations to help you reduce your environmental impact.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="py-10 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Carbon Footprint Survey</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Help us understand your lifestyle to calculate your carbon footprint and provide personalized recommendations.
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="px-6 py-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Transportation</span>
              <span>Diet</span>
              <span>Energy</span>
              <span>Shopping</span>
            </div>
          </div>
          
          {/* Survey content */}
          <div className="px-6 py-6">
            {renderStep()}
          </div>
          
          {/* Navigation buttons */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-between transition-colors duration-300">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={step === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              {step < 4 ? (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                'Complete Survey'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonTrackerPageWrapper;