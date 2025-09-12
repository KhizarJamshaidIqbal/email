/**
 * Type definitions for newsletter editor
 */

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider' | 'social' | 'spacer';
  content: {
    text?: string;
    fontSize?: number;
    color?: string;
    src?: string;
    alt?: string;
    width?: string;
    height?: string | number;
    url?: string;
    backgroundColor?: string;
    style?: string;
    thickness?: number;
    platforms?: string[];
    [key: string]: any;
  };
  styles?: {
    textAlign?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    marginBottom?: string;
    marginTop?: string;
    padding?: string;
    fontSize?: string;
    [key: string]: any;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface BrandKit {
  colors: string[];
  fonts: string[];
  logos: string[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  blocks: ContentBlock[];
}

export interface Project {
  id: string;
  name: string;
  content_data: {
    blocks: ContentBlock[];
    brandKit: BrandKit;
    viewMode: string;
  };
  type: 'newsletter';
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface SaveDialogData {
  name: string;
  description?: string;
}

export type ViewMode = 'desktop' | 'tablet' | 'mobile';
export type AutoSaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';
export type ActivePanel = 'blocks' | 'templates' | 'brand';