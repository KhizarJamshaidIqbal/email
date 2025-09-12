import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import AIAssistant from '../components/AIAssistant';
import StatsGrid from '../components/dashboard/StatsGrid';
import QuickActions from '../components/dashboard/QuickActions';
import RecentProjects from '../components/dashboard/RecentProjects';
import FeatureCards from '../components/dashboard/FeatureCards';
import ServiceStatus from '../components/dashboard/ServiceStatus';
import EmailServiceConfig from '../components/dashboard/EmailServiceConfig';
// All icons are now used in extracted components

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { projects, loading: projectsLoading, error: projectsError, createProject } = useProjects();
  const navigate = useNavigate();

  const handleCreateNewsletter = async () => {
    try {
      const newProject = await createProject({
        name: `Newsletter ${new Date().toLocaleDateString()}`,
        status: 'draft',
        content_data: { blocks: [] }
      });
      navigate(`/editor/${newProject.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      // Fallback to temporary ID if creation fails
      const tempProjectId = 'new-' + Date.now();
      navigate(`/editor/${tempProjectId}`);
    }
  };

  const handleBrowseTemplates = () => {
    navigate('/templates');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  const handleManageBrandKit = () => {
    navigate('/brand-kit');
  };

  // Extracted utility functions and data moved to separate components

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Newsletter Creator Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                🚀 Multi-Model AI Powered
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid />
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <QuickActions 
            onCreateNewsletter={handleCreateNewsletter}
            onBrowseTemplates={handleBrowseTemplates}
            onViewAnalytics={handleViewAnalytics}
            onManageBrandKit={handleManageBrandKit}
          />
          
          <RecentProjects 
            projects={projects}
            loading={projectsLoading}
            error={projectsError}
          />
          
          <ServiceStatus />
        </div>

        {/* Platform Features */}
        <FeatureCards />

        {/* Email Service Configuration */}
        <EmailServiceConfig />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            🚀 Newsletter Creator v1.0.0 • Multi-Model AI System • Email Distribution Ready
          </div>
          <button
            onClick={signOut}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 active:bg-red-800 transition-all duration-150"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      {/* AI Assistant Component */}
      <AIAssistant />
    </div>
  );
};

export default Dashboard;