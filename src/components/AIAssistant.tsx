import React, { useState } from 'react';
import { Sparkles, Send, Image, Zap, RefreshCw, CheckCircle } from 'lucide-react';

// AI Task Types
const AI_TASK_TYPES = [
  { value: 'newsletter_content', label: 'Newsletter Content', icon: '📝' },
  { value: 'subject_line', label: 'Subject Line', icon: '✨' },
  { value: 'preheader_text', label: 'Preheader Text', icon: '👀' },
  { value: 'product_description', label: 'Product Description', icon: '🛍️' },
  { value: 'event_announcement', label: 'Event Announcement', icon: '🎉' },
  { value: 'business_update', label: 'Business Update', icon: '📊' },
  { value: 'image_generation', label: 'Image Generation', icon: '🎨' }
];

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'promotional', label: 'Promotional' }
];

const LENGTH_OPTIONS = [
  { value: 'short', label: 'Short (50-100 words)' },
  { value: 'medium', label: 'Medium (100-200 words)' },
  { value: 'long', label: 'Long (200-400 words)' }
];

interface AIResponse {
  content: string;
  alternatives?: string[];
  confidence: number;
  modelUsed: string;
  usage: {
    tokens?: number;
    cost?: number;
  };
}

interface ImageResponse {
  imageUrl: string;
  prompt: string;
  style: string;
  modelUsed: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'image'>('content');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | ImageResponse | null>(null);
  
  // Content generation form state
  const [taskType, setTaskType] = useState('newsletter_content');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [audience, setAudience] = useState('');
  const [brandVoice, setBrandVoice] = useState('');
  
  // Image generation form state
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('professional');
  const [colorScheme, setColorScheme] = useState('');

  const generateContent = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskType,
          prompt,
          tone,
          length,
          audience: audience || undefined,
          brandVoice: brandVoice || undefined
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        console.error('AI generation failed:', data.error);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          style: imageStyle,
          colorScheme: colorScheme ? colorScheme.split(',').map(c => c.trim()) : undefined
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        console.error('Image generation failed:', data.error);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAlternatives = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-alternatives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskType,
          prompt,
          tone,
          length,
          audience: audience || undefined,
          brandVoice: brandVoice || undefined
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResult(data.data.recommendation);
      }
    } catch (error) {
      console.error('Error generating alternatives:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'content'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📝 Content
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'image'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🎨 Images
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'content' ? (
          <div className="space-y-4">
            {/* Task Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Type
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {AI_TASK_TYPES.filter(type => type.value !== 'image_generation').map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Describe what you want to create
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a summer sale announcement for outdoor gear..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3}
              />
            </div>

            {/* Tone and Length */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {TONE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {LENGTH_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional fields */}
            <div className="space-y-3">
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Target audience (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="text"
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                placeholder="Brand voice (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2">
              <button
                onClick={generateContent}
                disabled={loading || !prompt.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span>Generate</span>
              </button>
              <button
                onClick={generateAlternatives}
                disabled={loading || !prompt.trim()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Alternatives
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Describe the image you want to create
              </label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="e.g., Professional newsletter header for summer sale, modern design with outdoor theme..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3}
              />
            </div>

            {/* Style and Colors */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Style
                </label>
                <select
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="professional">Professional</option>
                  <option value="modern">Modern</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="creative">Creative</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>
              <input
                type="text"
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                placeholder="Color scheme (e.g., #2563EB, #10B981)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Generate button */}
            <button
              onClick={generateImage}
              disabled={loading || !imagePrompt.trim()}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Image className="w-4 h-4" />
              )}
              <span>Generate Image</span>
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {'content' in result ? 'Generated Content' : 'Generated Image'}
              </span>
              <div className="flex items-center space-x-2">
                {'confidence' in result && (
                  <span className="text-xs text-gray-500">
                    {Math.round(result.confidence * 100)}% confidence
                  </span>
                )}
                <button
                  onClick={() => copyToClipboard('content' in result ? result.content : result.imageUrl)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  📋
                </button>
              </div>
            </div>
            
            {'content' in result ? (
              <div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {result.content}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Generated by {result.modelUsed}
                  {result.usage.tokens && ` • ${result.usage.tokens} tokens`}
                  {result.usage.cost && ` • $${result.usage.cost.toFixed(4)}`}
                </div>
              </div>
            ) : (
              <div>
                <img 
                  src={result.imageUrl} 
                  alt="Generated image" 
                  className="w-full rounded-md mb-2"
                />
                <div className="text-xs text-gray-500">
                  Generated by {result.modelUsed} • {result.style} style
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;