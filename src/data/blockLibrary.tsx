import React from 'react';
import { Type, Image, MousePointer, Minus, Share2, Grid } from 'lucide-react';

export interface BlockLibraryItem {
  type: string;
  icon: React.ReactNode;
  label: string;
  defaultContent: any;
}

export const blockLibrary: BlockLibraryItem[] = [
  {
    type: 'text',
    icon: <Type className="w-5 h-5" />,
    label: 'Text Block',
    defaultContent: { text: 'Your text here...', fontSize: 16, color: '#000000' }
  },
  {
    type: 'image',
    icon: <Image className="w-5 h-5" />,
    label: 'Image',
    defaultContent: { src: '', alt: '', width: '100%', height: 'auto' }
  },
  {
    type: 'button',
    icon: <MousePointer className="w-5 h-5" />,
    label: 'Button',
    defaultContent: { text: 'Click Here', url: '#', backgroundColor: '#007bff', color: '#ffffff' }
  },
  {
    type: 'divider',
    icon: <Minus className="w-5 h-5" />,
    label: 'Divider',
    defaultContent: { style: 'solid', color: '#cccccc', thickness: 1 }
  },
  {
    type: 'social',
    icon: <Share2 className="w-5 h-5" />,
    label: 'Social Links',
    defaultContent: { platforms: ['facebook', 'twitter', 'instagram'], style: 'icons' }
  },
  {
    type: 'spacer',
    icon: <Grid className="w-5 h-5" />,
    label: 'Spacer',
    defaultContent: { height: 20 }
  }
];

export default blockLibrary;