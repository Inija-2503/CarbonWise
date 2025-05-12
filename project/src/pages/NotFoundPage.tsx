import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full text-center">
        <Leaf className="h-16 w-16 text-green-500 mx-auto mb-4" />
        
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Oops! The page you're looking for does not exist or has been moved.
        </p>
        
        <div className="mt-8">
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
      
      <div className="mt-16 max-w-2xl">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">
          Looking for something else?
        </h3>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Carbon Tracker', path: '/carbon-tracker' },
            { name: 'Insights', path: '/insights' },
            { name: 'About Us', path: '/about' },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;