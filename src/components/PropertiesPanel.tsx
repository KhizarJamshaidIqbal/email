import React from 'react';
import { ContentBlock, BrandKit } from '../types/newsletter';

interface PropertiesPanelProps {
  selectedBlock: ContentBlock | null;
  brandKit: BrandKit;
  onUpdateProperty: (blockId: string, property: string, value: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  brandKit,
  onUpdateProperty
}) => {
  if (!selectedBlock) return null;

  const updateBlockProperty = (blockId: string, property: string, value: any) => {
    onUpdateProperty(blockId, property, value);
  };

  return (
    <div className="properties-panel w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Block Type</label>
          <p className="text-sm text-gray-600 capitalize">{selectedBlock.type}</p>
        </div>
        
        {/* Text Block Properties */}
        {selectedBlock.type === 'text' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
              <textarea
                value={selectedBlock.content.text}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
              <input
                type="number"
                value={selectedBlock.content.fontSize || 16}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.fontSize', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                min="8"
                max="72"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <input
                type="color"
                value={selectedBlock.content.color || '#000000'}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.color', e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
              <select
                value={selectedBlock.styles?.fontFamily || 'Arial'}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'styles.fontFamily', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                {brandKit.fonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
          </>
        )}
        
        {/* Button Block Properties */}
        {selectedBlock.type === 'button' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={selectedBlock.content.text}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
              <input
                type="url"
                value={selectedBlock.content.url || ''}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.url', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input
                type="color"
                value={selectedBlock.content.backgroundColor || '#007bff'}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.backgroundColor', e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <input
                type="color"
                value={selectedBlock.content.color || '#ffffff'}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.color', e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </div>
          </>
        )}
        
        {/* Image Block Properties */}
        {selectedBlock.type === 'image' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={selectedBlock.content.src || ''}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.src', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
              <input
                type="text"
                value={selectedBlock.content.alt || ''}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.alt', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="Image description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
              <input
                type="text"
                value={selectedBlock.content.width || '100%'}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.width', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="100% or 300px"
              />
            </div>
          </>
        )}
        
        {/* Divider Block Properties */}
        {selectedBlock.type === 'divider' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={selectedBlock.content.color || '#cccccc'}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.color', e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thickness</label>
              <input
                type="number"
                value={selectedBlock.content.thickness || 1}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.thickness', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
              <select
                value={selectedBlock.content.style || 'solid'}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.style', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
          </>
        )}
        
        {/* Spacer Block Properties */}
        {selectedBlock.type === 'spacer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
            <input
              type="number"
              value={selectedBlock.content.height || 20}
              onChange={(e) => updateBlockProperty(selectedBlock.id, 'content.height', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              min="5"
              max="200"
            />
          </div>
        )}
        
        {/* Position Controls */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">X</label>
              <input
                type="number"
                value={Math.round(selectedBlock.position.x)}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'position.x', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Y</label>
              <input
                type="number"
                value={Math.round(selectedBlock.position.y)}
                onChange={(e) => updateBlockProperty(selectedBlock.id, 'position.y', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Spacing Controls */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Spacing</label>
          
          {/* Padding Controls */}
          <div className="mb-3">
            <label className="block text-xs text-gray-600 mb-2">Padding</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Top/Bottom</label>
                <input
                  type="number"
                  value={parseInt(selectedBlock.styles?.paddingTop?.replace('px', '') || '0')}
                  onChange={(e) => {
                    const value = `${e.target.value}px`;
                    updateBlockProperty(selectedBlock.id, 'styles.paddingTop', value);
                    updateBlockProperty(selectedBlock.id, 'styles.paddingBottom', value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Left/Right</label>
                <input
                  type="number"
                  value={parseInt(selectedBlock.styles?.paddingLeft?.replace('px', '') || '0')}
                  onChange={(e) => {
                    const value = `${e.target.value}px`;
                    updateBlockProperty(selectedBlock.id, 'styles.paddingLeft', value);
                    updateBlockProperty(selectedBlock.id, 'styles.paddingRight', value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Margin Controls */}
          <div>
            <label className="block text-xs text-gray-600 mb-2">Margin</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Top/Bottom</label>
                <input
                  type="number"
                  value={parseInt(selectedBlock.styles?.marginTop?.replace('px', '') || '0')}
                  onChange={(e) => {
                    const value = `${e.target.value}px`;
                    updateBlockProperty(selectedBlock.id, 'styles.marginTop', value);
                    updateBlockProperty(selectedBlock.id, 'styles.marginBottom', value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Left/Right</label>
                <input
                  type="number"
                  value={parseInt(selectedBlock.styles?.marginLeft?.replace('px', '') || '0')}
                  onChange={(e) => {
                    const value = `${e.target.value}px`;
                    updateBlockProperty(selectedBlock.id, 'styles.marginLeft', value);
                    updateBlockProperty(selectedBlock.id, 'styles.marginRight', value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;