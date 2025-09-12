import React from 'react';
import { X } from 'lucide-react';
import { Template, BrandKit } from '../types/newsletter';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  template: Template | null;
  brandKit: BrandKit;
  onClose: () => void;
  onUseTemplate: () => void;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  template,
  brandKit,
  onClose,
  onUseTemplate
}) => {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Template Preview: {template.name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="bg-gray-100 p-8 rounded-lg">
            <div className="bg-white shadow-lg mx-auto relative" style={{ maxWidth: '600px', minHeight: '400px' }}>
              {template.blocks.map((block, index) => (
                <div
                  key={`preview-${block.id}-${index}`}
                  className="absolute"
                  style={{
                    left: block.position.x,
                    top: block.position.y,
                    ...block.styles
                  } as React.CSSProperties}
                >
                  {block.type === 'text' && (
                    <div 
                      className="p-4 min-w-32 min-h-8"
                      style={{ 
                        fontSize: block.content.fontSize,
                        color: block.content.color,
                        fontFamily: brandKit.fonts[0]
                      }}
                    >
                      {block.content.text}
                    </div>
                  )}
                  
                  {block.type === 'image' && (
                    <div className="p-2">
                      <img 
                        src={block.content.src || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=placeholder%20image%20for%20newsletter&image_size=landscape_4_3'} 
                        alt={block.content.alt}
                        className="max-w-64 h-auto"
                      />
                    </div>
                  )}
                  
                  {block.type === 'button' && (
                    <button 
                      className="px-6 py-3 rounded font-medium"
                      style={{
                        backgroundColor: brandKit.colors[0],
                        color: '#ffffff'
                      }}
                    >
                      {block.content.text}
                    </button>
                  )}
                  
                  {block.type === 'divider' && (
                    <hr 
                      className="w-full"
                      style={{
                        borderColor: block.content.color,
                        borderWidth: block.content.thickness,
                        borderStyle: block.content.style
                      }}
                    />
                  )}
                  
                  {block.type === 'social' && (
                    <div className="flex space-x-2 p-2">
                      {block.content.platforms.map((platform: string, idx: number) => (
                        <div key={`${platform}-${idx}`} className="w-8 h-8 bg-gray-300 rounded"></div>
                      ))}
                    </div>
                  )}
                  
                  {block.type === 'spacer' && (
                    <div 
                      className="w-full bg-gray-100 border-dashed border-2 border-gray-300"
                      style={{ height: block.content.height }}
                    >
                      <span className="text-xs text-gray-500 p-1">Spacer</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={onUseTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;