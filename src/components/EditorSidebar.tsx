import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ActivePanel, BrandKit, Template } from '../types/newsletter';
import { blockLibrary } from '../data/blockLibrary';

interface EditorSidebarProps {
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  brandKit: BrandKit;
  templates: Template[];
  onDragStart: (block: any) => void;
  onTemplatePreview: (template: Template) => void;
  onTemplateSelect: (template: Template) => void;
  isApplyingTemplate: boolean;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activePanel,
  setActivePanel,
  brandKit,
  templates,
  onDragStart,
  onTemplatePreview,
  onTemplateSelect,
  isApplyingTemplate
}) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-panel w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:text-gray-700 transition-all duration-150 rounded px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
        
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActivePanel('blocks')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              activePanel === 'blocks' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100'
            }`}
          >
            Blocks
          </button>
          <button
            onClick={() => setActivePanel('templates')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              activePanel === 'templates' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActivePanel('brand')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              activePanel === 'brand' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100'
            }`}
          >
            Brand
          </button>
        </div>
      </div>
      
      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activePanel === 'blocks' && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 mb-3">Content Blocks</h3>
            {blockLibrary.map((block) => (
              <div
                key={block.type}
                draggable
                onDragStart={() => onDragStart(block)}
                className="flex items-center p-3 border border-gray-200 rounded-lg cursor-grab hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="text-gray-600 mr-3">{block.icon}</div>
                <span className="text-sm font-medium text-gray-900">{block.label}</span>
              </div>
            ))}
          </div>
        )}
        
        {activePanel === 'templates' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">Templates</h3>
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={template.thumbnail} 
                  alt={template.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{template.category}</p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => onTemplatePreview(template)}
                      className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:bg-gray-300 transition-all duration-150"
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => onTemplateSelect(template)}
                      disabled={isApplyingTemplate}
                      className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-800 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center justify-center"
                    >
                      {isApplyingTemplate ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        'Use Template'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activePanel === 'brand' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">Brand Kit</h3>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Brand Colors</h4>
              <div className="grid grid-cols-5 gap-2">
                {brandKit.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                    style={{ backgroundColor: color } as React.CSSProperties}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Fonts</h4>
              <div className="space-y-1">
                {brandKit.fonts.map((font, index) => (
                  <div key={index} className="p-2 border border-gray-200 rounded text-sm" style={{ fontFamily: font } as React.CSSProperties}>
                    {font}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorSidebar;