import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

interface Service {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  description: string;
  lastChecked: string;
}

interface ServiceStatusProps {
  services?: Service[];
}

const ServiceStatus: React.FC<ServiceStatusProps> = ({ services }) => {
  const defaultServices: Service[] = [
    {
      name: "OpenRouter API",
      status: "operational",
      description: "AI content generation service",
      lastChecked: "2 minutes ago"
    },
    {
      name: "Gemini API",
      status: "operational",
      description: "Google's AI model service",
      lastChecked: "2 minutes ago"
    },
    {
      name: "SendGrid",
      status: "operational",
      description: "Email delivery service",
      lastChecked: "5 minutes ago"
    },
    {
      name: "Supabase",
      status: "operational",
      description: "Database and authentication",
      lastChecked: "1 minute ago"
    }
  ];

  const serviceList = services || defaultServices;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'outage':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'outage':
        return 'Service Outage';
      case 'maintenance':
        return 'Under Maintenance';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'outage':
        return 'text-red-600';
      case 'maintenance':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const overallStatus = serviceList.every(service => service.status === 'operational') 
    ? 'All systems operational' 
    : 'Some services experiencing issues';

  const overallStatusColor = serviceList.every(service => service.status === 'operational')
    ? 'text-green-600'
    : 'text-yellow-600';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Service Status</h2>
        <div className="flex items-center space-x-2">
          {serviceList.every(service => service.status === 'operational') ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          )}
          <span className={`text-sm font-medium ${overallStatusColor}`}>
            {overallStatus}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {serviceList.map((service, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-3">
              {getStatusIcon(service.status)}
              <div>
                <p className="font-medium text-gray-900">{service.name}</p>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                {getStatusText(service.status)}
              </p>
              <p className="text-xs text-gray-500">{service.lastChecked}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default ServiceStatus;