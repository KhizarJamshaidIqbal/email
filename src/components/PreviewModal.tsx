import React from 'react';
import { X, Mail } from 'lucide-react';
import { ContentBlock } from '../types/newsletter';

interface PreviewModalProps {
  isOpen: boolean;
  blocks: ContentBlock[];
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  blocks,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Newsletter Preview</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="bg-gray-100 p-8 rounded-lg">
            <div className="bg-white shadow-lg mx-auto relative" style={{ maxWidth: '600px', minHeight: '400px' }}>
              {/* Render actual newsletter blocks */}
              {blocks.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No Content Yet</p>
                    <p className="text-sm">Add some blocks to see your newsletter preview</p>
                  </div>
                </div>
              ) : (
                blocks.map((block) => (
                  <div
                    key={`preview-${block.id}`}
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
                          fontFamily: block.styles?.fontFamily || 'inherit'
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
                        className="px-6 py-3 rounded font-medium cursor-default"
                        style={{
                          backgroundColor: block.content.backgroundColor,
                          color: block.content.color
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
                          <div key={`${platform}-${idx}`} className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600">
                            {platform.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {block.type === 'spacer' && (
                      <div 
                        className="w-full bg-transparent"
                        style={{ height: block.content.height }}
                      >
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            This preview shows how your newsletter will appear to recipients
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;