import React from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { ContentBlock } from '../types/newsletter';

interface BlockRendererProps {
  block: ContentBlock;
  isSelected: boolean;
  isEditing: boolean;
  isDragging: boolean;
  onSelect: (blockId: string) => void;
  onMouseDown: (e: React.MouseEvent, blockId: string, canvasRef: React.RefObject<HTMLDivElement>) => void;
  onDoubleClick: (blockId: string) => void;
  onTextChange: (blockId: string, text: string) => void;
  onTextBlur: () => void;
  onTextKeyDown: (e: React.KeyboardEvent) => void;
  onDuplicate: (blockId: string) => void;
  onDelete: (blockId: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected,
  isEditing,
  isDragging,
  onSelect,
  onMouseDown,
  onDoubleClick,
  onTextChange,
  onTextBlur,
  onTextKeyDown,
  onDuplicate,
  onDelete,
  canvasRef
}) => {
  return (
    <div
      key={block.id}
      className={`absolute border-2 transition-all ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
      } ${isDragging && isSelected ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: block.position.x,
        top: block.position.y,
        ...block.styles
      } as React.CSSProperties}
      onClick={() => onSelect(block.id)}
      onMouseDown={(e) => onMouseDown(e, block.id, canvasRef)}
    >
      {block.type === 'text' && (
        <div 
          className="p-4 min-w-32 min-h-8"
          style={{ 
            fontSize: block.content.fontSize,
            color: block.content.color,
            fontFamily: block.styles?.fontFamily || 'inherit'
          }}
          onDoubleClick={() => onDoubleClick(block.id)}
        >
          {isEditing ? (
            <input
              type="text"
              value={block.content.text}
              onChange={(e) => onTextChange(block.id, e.target.value)}
              onBlur={onTextBlur}
              onKeyDown={onTextKeyDown}
              className="w-full bg-transparent border-none outline-none"
              style={{
                fontSize: block.content.fontSize,
                color: block.content.color,
                fontFamily: block.styles?.fontFamily || 'inherit'
              }}
              autoFocus
            />
          ) : (
            block.content.text
          )}
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
          {block.content.platforms.map((platform: string) => (
            <div key={platform} className="w-8 h-8 bg-gray-300 rounded"></div>
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
      
      {/* Block Controls */}
      {isSelected && (
        <div className="absolute -top-8 left-0 flex space-x-1 bg-white shadow-lg rounded border">
          <button 
            onClick={() => onDuplicate(block.id)}
            className="p-1 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-gray-200 transition-all duration-150 rounded"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(block.id)}
            className="p-1 hover:bg-red-50 focus:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 active:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-150 rounded"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BlockRenderer;