// AI Service Type Definitions

// Task Types for AI Model Selection
export enum AITaskType {
  NEWSLETTER_CONTENT = 'newsletter_content',
  SUBJECT_LINE = 'subject_line',
  PREHEADER_TEXT = 'preheader_text',
  PRODUCT_DESCRIPTION = 'product_description',
  EVENT_ANNOUNCEMENT = 'event_announcement',
  BUSINESS_UPDATE = 'business_update',
  IMAGE_GENERATION = 'image_generation',
  CONTENT_OPTIMIZATION = 'content_optimization',
  TONE_ADJUSTMENT = 'tone_adjustment',
  TRANSLATION = 'translation'
}

// AI Service Configuration
export interface AIConfig {
  openRouter: {
    apiKey: string;
    baseURL: string;
  };
  gemini: {
    apiKey: string;
    baseURL: string;
    textModel: string;
    imagenModel: string;
  };
}

// Content Generation Request Interface
export interface ContentGenerationRequest {
  taskType: AITaskType;
  prompt: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'urgent' | 'promotional';
  length?: 'short' | 'medium' | 'long';
  audience?: string;
  brandVoice?: string;
  additionalContext?: string;
}

// Image Generation Request Interface
export interface ImageGenerationRequest {
  prompt: string;
  style?: 'professional' | 'modern' | 'minimalist' | 'creative' | 'corporate';
  size?: 'square' | 'landscape' | 'portrait';
  colorScheme?: string[];
  brandElements?: string[];
}

// AI Response Interface
export interface AIResponse {
  content: string;
  alternatives?: string[];
  confidence: number;
  modelUsed: string;
  usage: {
    tokens?: number;
    cost?: number;
  };
}

// Image Generation Response Interface
export interface ImageResponse {
  imageUrl: string;
  prompt: string;
  style: string;
  modelUsed: string;
  usage: {
    cost?: number;
  };
}

// Model Provider Type
export type ModelProvider = 'openrouter' | 'gemini';

// Temperature Configuration Type
export type TemperatureConfig = Record<AITaskType, number>;

// Token Configuration Type
export type TokenConfig = Record<string, number>;

// Cost Rate Configuration Type
export type CostRateConfig = Record<string, number>;

// Model Mapping Configuration Type
export type ModelMapping = Record<AITaskType, ModelProvider>;

// Tone Instructions Type
export type ToneInstructions = Record<string, string>;

// Length Instructions Type
export type LengthInstructions = Record<string, string>;

// Image Size Mapping Type
export type ImageSizeMapping = Record<string, string>;

// Color Mapping Type
export type ColorMapping = Record<string, string>;