import React from 'react';
import { Sparkles, Mail, Palette, BarChart3 } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
  color: string;
}

const FeatureCards: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
      title: "AI Content Generation",
      description: "Multi-model AI system with OpenRouter & Gemini",
      status: "Active",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Mail className="w-6 h-6 text-green-600" />,
      title: "Email Distribution",
      description: "SendGrid & Mailchimp integration",
      status: "Ready",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Palette className="w-6 h-6 text-purple-600" />,
      title: "Image Generation",
      description: "Gemini Imagen for custom visuals",
      status: "Beta",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
      title: "Analytics Dashboard",
      description: "Real-time performance tracking",
      status: "Coming Soon",
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Ready':
        return 'bg-blue-100 text-blue-800';
      case 'Beta':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className={`border-2 rounded-lg p-6 ${feature.color}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {feature.icon}
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(feature.status)}`}>
                {feature.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;