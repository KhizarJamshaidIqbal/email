import React from 'react';
import { Zap } from 'lucide-react';

interface QuickActionsProps {
  onCreateNewsletter: () => void;
  onBrowseTemplates: () => void;
  onViewAnalytics: () => void;
  onManageBrandKit: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateNewsletter,
  onBrowseTemplates,
  onViewAnalytics,
  onManageBrandKit
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-blue-600" />
        Quick Actions
      </h2>
      <div className="space-y-3">
        <button 
          onClick={onCreateNewsletter}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-md hover:from-blue-700 hover:to-purple-700 focus:from-blue-700 focus:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:from-blue-800 active:to-purple-800 transition-all duration-300 font-medium transform hover:scale-105 active:scale-95"
        >
          ✨ Create AI-Powered Newsletter
        </button>
        <button 
          onClick={onBrowseTemplates}
          className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:bg-gray-100 transition-all duration-300 font-medium transform hover:scale-105 active:scale-95"
        >
          📚 Browse 130+ Templates
        </button>
        <button 
          onClick={onViewAnalytics}
          className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:bg-gray-100 transition-all duration-300 font-medium transform hover:scale-105 active:scale-95"
        >
          📊 View Email Analytics
        </button>
        <button 
          onClick={onManageBrandKit}
          className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:bg-gray-100 transition-all duration-300 font-medium transform hover:scale-105 active:scale-95"
        >
          🎨 Manage Brand Kit
        </button>
      </div>
    </div>
  );
};

export default QuickActions;