import React from 'react';
import { Zap, Globe, Users, TrendingUp } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const StatsGrid: React.FC = () => {
  const stats: StatItem[] = [
    { label: "AI Models Available", value: "5+", icon: <Zap className="w-5 h-5" /> },
    { label: "Email Providers", value: "2", icon: <Globe className="w-5 h-5" /> },
    { label: "Template Categories", value: "5", icon: <Users className="w-5 h-5" /> },
    { label: "Success Rate", value: "99%", icon: <TrendingUp className="w-5 h-5" /> }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className="text-blue-600">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;