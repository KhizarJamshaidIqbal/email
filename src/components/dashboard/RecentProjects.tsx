import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Loader2, FileText, Calendar } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  status: string;
  updated_at: string;
  template_id?: string;
  content_data?: {
    blocks?: any[];
  };
}

interface RecentProjectsProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ projects, loading, error }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' },
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 ${config.bg} ${config.text} text-xs rounded`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Mail className="w-5 h-5 mr-2 text-green-600" />
        Recent Projects
      </h2>
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading projects...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">Failed to load projects</p>
            <p className="text-gray-400 text-xs">{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">No projects yet</p>
            <p className="text-gray-400 text-xs">Create your first newsletter to get started</p>
          </div>
        ) : (
          projects.slice(0, 3).map((project) => (
            <div 
              key={project.id} 
              className="p-3 border border-gray-200 rounded-md hover:border-gray-300 transition-colors cursor-pointer"
              onClick={() => navigate(`/editor/${project.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{project.name}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Updated {formatDate(project.updated_at)}</span>
                  </div>
                </div>
                {getStatusBadge(project.status)}
              </div>
              <div className="mt-2 flex space-x-2">
                {project.content_data?.blocks?.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      AI Powered {project.content_data.blocks.length}
                    </span>
                  )}
                {project.template_id && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Template</span>
                )}
                {project.content_data?.blocks?.length && project.content_data.blocks.length > 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {project.content_data.blocks.length} Blocks
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        {projects.length > 0 && (
          <button 
            onClick={() => navigate('/projects')} // Navigate to projects page when available
            className="w-full text-blue-600 hover:text-blue-700 focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:text-blue-800 text-sm font-medium py-2 transition-all duration-150 rounded"
          >
            View All Projects ({projects.length}) →
          </button>
        )}
      </div>
    </div>
  );
};

export default RecentProjects;