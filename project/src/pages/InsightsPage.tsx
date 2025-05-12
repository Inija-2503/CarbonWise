import React, { useState, useEffect } from 'react';
import { 
  Car, Utensils, Lightbulb, ShoppingBag, Share2, Star, Filter, ChevronDown,
  ThumbsUp, ThumbsDown, ArrowUpRight, BarChart2
} from 'lucide-react';
import { CarbonDataProvider, useCarbonData, UserInsight } from '../context/CarbonDataContext';

// Wrapper component to ensure context is available
const InsightsPageWrapper: React.FC = () => {
  return (
    <CarbonDataProvider>
      <InsightsContent />
    </CarbonDataProvider>
  );
};

const InsightsContent: React.FC = () => {
  const { insights, loading, getRecommendations } = useCarbonData();
  const [filter, setFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'impact' | 'date'>('impact');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [likedInsights, setLikedInsights] = useState<Record<string, boolean>>({});
  const [dislikedInsights, setDislikedInsights] = useState<Record<string, boolean>>({});
  const [savedInsights, setSavedInsights] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Load user preferences from localStorage
    const storedLikedInsights = localStorage.getItem('likedInsights');
    const storedDislikedInsights = localStorage.getItem('dislikedInsights');
    const storedSavedInsights = localStorage.getItem('savedInsights');
    
    if (storedLikedInsights) {
      setLikedInsights(JSON.parse(storedLikedInsights));
    }
    
    if (storedDislikedInsights) {
      setDislikedInsights(JSON.parse(storedDislikedInsights));
    }
    
    if (storedSavedInsights) {
      setSavedInsights(JSON.parse(storedSavedInsights));
    }
    
    // Fetch recommendations if not loading
    if (!loading && insights.length === 0) {
      getRecommendations();
    }
  }, [getRecommendations, insights.length, loading]);

  const toggleLike = (id: string) => {
    setLikedInsights(prev => {
      const newLiked = { ...prev, [id]: !prev[id] };
      
      // If liking, remove from disliked
      if (newLiked[id] && dislikedInsights[id]) {
        setDislikedInsights(prevDisliked => {
          const newDisliked = { ...prevDisliked };
          delete newDisliked[id];
          localStorage.setItem('dislikedInsights', JSON.stringify(newDisliked));
          return newDisliked;
        });
      }
      
      localStorage.setItem('likedInsights', JSON.stringify(newLiked));
      return newLiked;
    });
  };

  const toggleDislike = (id: string) => {
    setDislikedInsights(prev => {
      const newDisliked = { ...prev, [id]: !prev[id] };
      
      // If disliking, remove from liked
      if (newDisliked[id] && likedInsights[id]) {
        setLikedInsights(prevLiked => {
          const newLiked = { ...prevLiked };
          delete newLiked[id];
          localStorage.setItem('likedInsights', JSON.stringify(newLiked));
          return newLiked;
        });
      }
      
      localStorage.setItem('dislikedInsights', JSON.stringify(newDisliked));
      return newDisliked;
    });
  };

  const toggleSave = (id: string) => {
    setSavedInsights(prev => {
      const newSaved = { ...prev, [id]: !prev[id] };
      localStorage.setItem('savedInsights', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  // Filter insights based on selected category
  const filteredInsights = filter 
    ? insights.filter(insight => insight.category === filter)
    : insights;
  
  // Sort insights based on selected option
  const sortedInsights = [...filteredInsights].sort((a, b) => {
    if (sortBy === 'impact') {
      return b.impact - a.impact;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  
  // Saved insights filter
  const displayedInsights = filter === 'saved'
    ? sortedInsights.filter(insight => savedInsights[insight.id])
    : sortedInsights;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transportation':
        return <Car className="h-5 w-5 text-white" />;
      case 'diet':
        return <Utensils className="h-5 w-5 text-white" />;
      case 'energy':
        return <Lightbulb className="h-5 w-5 text-white" />;
      case 'shopping':
        return <ShoppingBag className="h-5 w-5 text-white" />;
      default:
        return <BarChart2 className="h-5 w-5 text-white" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transportation':
        return 'bg-blue-500';
      case 'diet':
        return 'bg-yellow-500';
      case 'energy':
        return 'bg-purple-500';
      case 'shopping':
        return 'bg-pink-500';
      default:
        return 'bg-green-500';
    }
  };

  const getImpactLevel = (impact: number) => {
    if (impact > 0.8) return 'High';
    if (impact > 0.5) return 'Medium';
    return 'Low';
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0.8) return 'text-green-600 dark:text-green-400';
    if (impact > 0.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div className="py-10 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI-Powered Insights</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Personalized recommendations to help you reduce your carbon footprint.
              </p>
            </div>
            
            <div className="flex space-x-3">
              {/* Category Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowFilterMenu(!showFilterMenu);
                    setShowSortMenu(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {filter === 'transportation' ? 'Transportation' :
                   filter === 'diet' ? 'Diet & Food' :
                   filter === 'energy' ? 'Energy' :
                   filter === 'shopping' ? 'Shopping' :
                   filter === 'saved' ? 'Saved' : 'All Categories'}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                
                {showFilterMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setFilter(null);
                          setShowFilterMenu(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          filter === null 
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        All Categories
                      </button>
                      {['transportation', 'diet', 'energy', 'shopping', 'saved'].map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setFilter(category);
                            setShowFilterMenu(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            filter === category 
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {category === 'transportation' ? 'Transportation' :
                           category === 'diet' ? 'Diet & Food' :
                           category === 'energy' ? 'Energy' :
                           category === 'shopping' ? 'Shopping' : 'Saved'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSortMenu(!showSortMenu);
                    setShowFilterMenu(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  Sort: {sortBy === 'impact' ? 'Impact' : 'Newest'}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                
                {showSortMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSortBy('impact');
                          setShowSortMenu(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortBy === 'impact' 
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        Impact
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('date');
                          setShowSortMenu(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortBy === 'date' 
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        Newest
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Insights Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading insights...</span>
          </div>
        ) : displayedInsights.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center transition-colors duration-300">
            <ShoppingBag className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No insights found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'saved' 
                ? "You haven't saved any insights yet. Click the star icon on insights you want to save for later." 
                : "No insights are available for this category. Try selecting a different category or check back later."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedInsights.map((insight) => (
              <div 
                key={insight.id} 
                className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="px-6 py-4">
                  <div className="flex items-start mb-4">
                    <div className={`p-2 rounded-lg text-white mr-4 flex-shrink-0 ${getCategoryColor(insight.category)}`}>
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{insight.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs font-medium ${getImpactColor(insight.impact)}`}>
                          {getImpactLevel(insight.impact)} Impact
                        </span>
                        <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {insight.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleLike(insight.id)}
                        className={`p-1.5 rounded-full ${
                          likedInsights[insight.id] 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                            : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        aria-label="Like"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => toggleDislike(insight.id)}
                        className={`p-1.5 rounded-full ${
                          dislikedInsights[insight.id] 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                            : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        aria-label="Dislike"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleSave(insight.id)}
                        className={`p-1.5 rounded-full ${
                          savedInsights[insight.id] 
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' 
                            : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        aria-label="Save"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        className="p-1.5 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Share"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1.5 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="View Details"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPageWrapper;