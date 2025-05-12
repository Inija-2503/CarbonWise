import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, Utensils, Lightbulb, ShoppingBag, TrendingDown, Award, Share2, 
  RefreshCw, ArrowRight, AlertTriangle
} from 'lucide-react';
import { CarbonDataProvider, useCarbonData } from '../context/CarbonDataContext';

// Wrapper component to ensure context is available
const DashboardPageWrapper: React.FC = () => {
  return (
    <CarbonDataProvider>
      <DashboardContent />
    </CarbonDataProvider>
  );
};

const DashboardContent: React.FC = () => {
  const { footprint, insights, getRecommendations, loading, surveyData } = useCarbonData();
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (!footprint || !surveyData) {
    return (
      <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            We need some information first
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            To calculate your carbon footprint and provide personalized insights, we need to know more about your lifestyle. Please complete the carbon footprint survey.
          </p>
          <Link
            to="/carbon-tracker"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            Take Survey Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  // Calculate total to get percentages
  const refreshRecommendations = async () => {
    setRefreshing(true);
    await getRecommendations();
    setRefreshing(false);
  };

  const categories = [
    { 
      name: 'Transportation', 
      value: footprint.transportation, 
      icon: <Car className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-500',
      percent: Math.round((footprint.transportation / footprint.total) * 100)
    },
    { 
      name: 'Diet', 
      value: footprint.diet, 
      icon: <Utensils className="h-5 w-5 text-yellow-500" />,
      color: 'bg-yellow-500',
      percent: Math.round((footprint.diet / footprint.total) * 100)
    },
    { 
      name: 'Energy', 
      value: footprint.energy, 
      icon: <Lightbulb className="h-5 w-5 text-purple-500" />,
      color: 'bg-purple-500',
      percent: Math.round((footprint.energy / footprint.total) * 100)
    },
    { 
      name: 'Shopping', 
      value: footprint.shopping, 
      icon: <ShoppingBag className="h-5 w-5 text-pink-500" />,
      color: 'bg-pink-500',
      percent: Math.round((footprint.shopping / footprint.total) * 100)
    },
  ];

  // Calculate how much trees are needed to offset carbon
  const treesNeeded = Math.round(footprint.total / 21); // Approx 21kg CO2 absorbed by a tree per year

  return (
    <div className="py-10 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Carbon Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Monitor your carbon footprint and track your progress toward a more sustainable lifestyle.
          </p>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Carbon Footprint Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Carbon Footprint Card */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-300">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Carbon Footprint</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  {footprint.unit}
                </span>
              </div>
              
              <div className="px-6 py-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Total Footprint</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{footprint.total.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-full">
                    <TrendingDown className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                
                {/* Breakdown by category */}
                <div className="space-y-4">
                  {categories.map(category => (
                    <div key={category.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          {category.icon}
                          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.value.toLocaleString()} ({category.percent}%)
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`${category.color} h-2.5 rounded-full transition-all duration-1000 ease-out`} 
                          style={{ width: `${category.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center transition-colors duration-300">
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-900/50 rounded-full p-2 mr-3">
                    <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    You're doing better than 65% of users in your region!
                  </span>
                </div>
                <Link
                  to="/carbon-tracker"
                  className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
                >
                  Update
                </Link>
              </div>
            </div>
            
            {/* Environmental Impact Visualization */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-300">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Environmental Impact</h2>
              </div>
              
              <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 text-center transition-colors duration-300">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Trees needed to offset</p>
                  <div className="mt-2 flex items-center justify-center">
                    <div className="relative">
                      <div className="flex items-end">
                        {Array.from({ length: Math.min(treesNeeded, 5) }).map((_, i) => (
                          <svg key={i} className="h-12 w-12 text-green-500 mx-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L14.5 8H19L15 12L16.5 18L12 15L7.5 18L9 12L5 8H9.5L12 2Z" fill="currentColor" />
                          </svg>
                        ))}
                      </div>
                      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{treesNeeded} trees</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">per year to offset your footprint</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 text-center transition-colors duration-300">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Equivalent to</p>
                  <div className="mt-2 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(footprint.total / 12.2).toLocaleString()} km
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">driven by an average car</p>
                    
                    <div className="mt-4 w-full h-1 bg-gray-200 dark:bg-gray-600"></div>
                    
                    <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(footprint.total / 0.06).toLocaleString()} hours
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">of LED light bulb usage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Insights and Actions */}
          <div className="space-y-8">
            {/* AI-Powered Recommendations */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-300">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Recommendations</h2>
                <button 
                  onClick={refreshRecommendations}
                  disabled={loading || refreshing}
                  className="inline-flex items-center justify-center p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="sr-only">Refresh recommendations</span>
                </button>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <RefreshCw className="h-6 w-6 text-green-500 animate-spin" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Loading recommendations...</span>
                  </div>
                ) : (
                  insights.slice(0, 4).map((insight) => (
                    <div key={insight.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200">
                      <div className="flex items-start">
                        <div 
                          className={`p-2 rounded-lg text-white mr-4 flex-shrink-0 ${
                            insight.category === 'transportation' ? 'bg-blue-500' :
                            insight.category === 'diet' ? 'bg-yellow-500' :
                            insight.category === 'energy' ? 'bg-purple-500' : 'bg-pink-500'
                          }`}
                        >
                          {insight.category === 'transportation' ? <Car className="h-5 w-5" /> :
                           insight.category === 'diet' ? <Utensils className="h-5 w-5" /> :
                           insight.category === 'energy' ? <Lightbulb className="h-5 w-5" /> :
                           <ShoppingBag className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{insight.title}</h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{insight.description}</p>
                          <div className="mt-2 flex items-center">
                            <div className="flex items-center">
                              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                                Potential {Math.round(insight.impact * 100)}% reduction
                              </span>
                            </div>
                            <button className="ml-4 text-xs text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 font-medium flex items-center">
                              <Share2 className="h-3 w-3 mr-1" />
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
                <Link
                  to="/insights"
                  className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
                >
                  View all recommendations
                  <ArrowRight className="inline-block ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Progress & Achievements */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-300">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Achievements</h2>
              </div>
              
              <div className="px-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { 
                      name: 'Green Starter', 
                      description: 'Complete your first carbon footprint survey', 
                      achieved: true,
                      color: 'bg-green-500'
                    },
                    { 
                      name: 'Data-Driven', 
                      description: 'Update your carbon data 3 times', 
                      achieved: false,
                      progress: 33,
                      color: 'bg-blue-500'
                    },
                    { 
                      name: 'Carbon Reducer', 
                      description: 'Reduce your footprint by 10%', 
                      achieved: false,
                      progress: 0,
                      color: 'bg-yellow-500'
                    },
                    { 
                      name: 'Action Taker', 
                      description: 'Implement 5 recommendations', 
                      achieved: false,
                      progress: 20,
                      color: 'bg-purple-500'
                    },
                  ].map((badge) => (
                    <div 
                      key={badge.name} 
                      className={`bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border-2 ${
                        badge.achieved 
                          ? 'border-green-500 dark:border-green-400' 
                          : 'border-gray-200 dark:border-gray-700'
                      } transition-colors duration-300`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`h-12 w-12 rounded-full ${badge.color} flex items-center justify-center mb-2`}>
                          {badge.achieved ? (
                            <Award className="h-6 w-6 text-white" />
                          ) : (
                            <span className="text-white font-medium text-sm">{badge.progress}%</span>
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{badge.name}</h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageWrapper;