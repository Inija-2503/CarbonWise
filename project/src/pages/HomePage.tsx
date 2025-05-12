import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, BarChart2, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-green-500" />,
      title: "Calculate Your Carbon Footprint",
      description: "Understand your environmental impact through our comprehensive carbon footprint calculator that analyzes your lifestyle choices."
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-blue-500" />,
      title: "Track Your Progress",
      description: "Monitor your carbon footprint over time with intuitive charts and visualizations that highlight your improvement areas."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      title: "Get AI-Powered Insights",
      description: "Receive personalized recommendations powered by AI to help you make more sustainable choices in your daily life."
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: "Earn Eco Achievements",
      description: "Celebrate your milestones and sustainable actions with badges and achievements as you reduce your carbon footprint."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-20 md:py-32 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <svg className="w-full h-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="300" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-green-500 animate-spin-slow" />
            <circle cx="400" cy="400" r="200" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500 animate-pulse" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Track and Reduce Your</span>
              <span className="block text-green-600 dark:text-green-400">Carbon Footprint</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Empower yourself with data-driven insights and personalized recommendations to live a more sustainable lifestyle.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:-translate-y-1"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:-translate-y-1"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:-translate-y-1"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="bg-white dark:bg-gray-900">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-white dark:fill-gray-900"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-white dark:fill-gray-900"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-white dark:fill-gray-900"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              How CarbonWise Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Understand and reduce your carbon footprint with these powerful features
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex justify-center items-center h-12 w-12 rounded-md bg-green-50 dark:bg-gray-700 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-center text-lg font-medium text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 dark:bg-green-800 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Start Your Sustainability Journey Today
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-green-100">
              Join thousands of others who are tracking and reducing their carbon footprint with CarbonWise.
            </p>
            {!user && (
              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-700 focus:ring-white transition-all duration-200"
                >
                  Sign Up - It's Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              What The Experts Say
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Alex Chen",
                role: "Environmental Enthusiast",
                quote: "CarbonWise has completely changed how I think about my daily choices. The personalized suggestions helped me reduce my carbon footprint by 30% in just three months!",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Sarah Johnson",
                role: "Small Business Owner",
                quote: "As a business owner, I wanted to make more sustainable choices. CarbonWise provided clear insights that helped us implement eco-friendly practices across our operations.",
                image: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Michael Torres",
                role: "Urban Planner",
                quote: "The data visualization in CarbonWise is exceptional. It's helped me understand complex environmental impacts in a simple, actionable way that I can share with others.",
                image: "https://randomuser.me/api/portraits/men/67.jpg"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <img 
                    className="h-12 w-12 rounded-full" 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;