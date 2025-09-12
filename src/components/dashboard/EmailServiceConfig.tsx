import React from 'react';
import { Mail } from 'lucide-react';

const EmailServiceConfig: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Mail className="w-5 h-5 mr-2 text-green-600" />
        Email Service Configuration
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">SendGrid</h3>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Configure</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            High-deliverability transactional email service for immediate newsletter distribution
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• 99%+ delivery rates</li>
            <li>• Real-time analytics</li>
            <li>• Advanced personalization</li>
            <li>• Immediate sending</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Mailchimp</h3>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Configure</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Comprehensive marketing platform with advanced campaign management and automation
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Advanced segmentation</li>
            <li>• A/B testing</li>
            <li>• Automation workflows</li>
            <li>• Subscriber management</li>
          </ul>
        </div>
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          💡 <strong>Pro Tip:</strong> Configure both services for redundancy and optimal performance. Use SendGrid for immediate sends and Mailchimp for complex campaigns.
        </p>
      </div>
    </div>
  );
};

export default EmailServiceConfig;