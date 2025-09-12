import { AIConfig, AITaskType, ModelProvider, ModelMapping, TemperatureConfig, TokenConfig, CostRateConfig } from '../types/aiTypes';

// Lazy load configuration to ensure environment variables are available
export function getAIConfig(): AIConfig {
  return {
    openRouter: {
      apiKey: process.env.OPENROUTER_API_KEY || '',
      baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
      baseURL: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
      textModel: process.env.GEMINI_TEXT_MODEL || 'gemini-pro',
      imagenModel: process.env.GEMINI_IMAGEN_MODEL || 'gemini-pro-vision',
    },
  };
}

// Validate API keys when needed
export function validateAPIKeys(): void {
  console.log('🔍 Environment variables debug:');
  console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? `${process.env.OPENROUTER_API_KEY.substring(0, 10)}...` : 'undefined');
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : 'undefined');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  const config = getAIConfig();
  const missingKeys = [];
  
  if (!config.openRouter.apiKey) {
    missingKeys.push('OPENROUTER_API_KEY');
  }
  
  if (!config.gemini.apiKey) {
    missingKeys.push('GEMINI_API_KEY');
  }
  
  if (missingKeys.length > 0) {
    console.warn('⚠️ Missing AI API keys:', missingKeys.join(', '));
    console.warn('AI services may not function properly without these keys.');
  } else {
    console.log('✅ AI API keys loaded successfully');
  }
}

// Lazy validation - only validate when service is first used
let isValidated = false;
export function ensureValidation(): void {
  if (!isValidated) {
    validateAPIKeys();
    isValidated = true;
  }
}

/**
 * Smart Model Selection based on task type
 * Different models excel at different tasks
 */
export function selectOptimalModel(taskType: AITaskType): ModelProvider {
  const modelMapping: ModelMapping = {
    [AITaskType.NEWSLETTER_CONTENT]: 'openrouter', // Better for long-form content
    [AITaskType.SUBJECT_LINE]: 'gemini', // Better for creative, short text
    [AITaskType.PREHEADER_TEXT]: 'gemini', // Better for concise, engaging text
    [AITaskType.PRODUCT_DESCRIPTION]: 'openrouter', // Better for detailed descriptions
    [AITaskType.EVENT_ANNOUNCEMENT]: 'gemini', // Better for engaging announcements
    [AITaskType.BUSINESS_UPDATE]: 'openrouter', // Better for professional content
    [AITaskType.CONTENT_OPTIMIZATION]: 'openrouter', // Better for content refinement
    [AITaskType.TONE_ADJUSTMENT]: 'gemini', // Better for style changes
    [AITaskType.TRANSLATION]: 'gemini', // Better multilingual capabilities
    [AITaskType.IMAGE_GENERATION]: 'gemini' // Gemini Imagen for images
  };

  return modelMapping[taskType] || 'openrouter';
}

/**
 * Get appropriate temperature for task type
 */
export function getTemperature(taskType: AITaskType): number {
  const temperatureMap: TemperatureConfig = {
    [AITaskType.NEWSLETTER_CONTENT]: 0.7,
    [AITaskType.SUBJECT_LINE]: 0.8,
    [AITaskType.PREHEADER_TEXT]: 0.8,
    [AITaskType.PRODUCT_DESCRIPTION]: 0.6,
    [AITaskType.EVENT_ANNOUNCEMENT]: 0.7,
    [AITaskType.BUSINESS_UPDATE]: 0.5,
    [AITaskType.CONTENT_OPTIMIZATION]: 0.4,
    [AITaskType.TONE_ADJUSTMENT]: 0.6,
    [AITaskType.TRANSLATION]: 0.3,
    [AITaskType.IMAGE_GENERATION]: 0.7
  };

  return temperatureMap[taskType] || 0.7;
}

/**
 * Get max tokens based on content length
 */
export function getMaxTokens(length?: string): number {
  const tokenMap: TokenConfig = {
    short: 150,
    medium: 300,
    long: 600
  };

  return tokenMap[length || 'medium'] || 300;
}

/**
 * Calculate estimated cost
 */
export function calculateCost(tokens: number, provider: string): number {
  const rates: CostRateConfig = {
    openrouter: 0.00003, // $0.03 per 1K tokens (estimated)
    gemini: 0.00001 // $0.01 per 1K tokens (estimated)
  };

  return (tokens / 1000) * (rates[provider] || 0.00002);
}

export default {
  getAIConfig,
  validateAPIKeys,
  ensureValidation,
  selectOptimalModel,
  getTemperature,
  getMaxTokens,
  calculateCost
};