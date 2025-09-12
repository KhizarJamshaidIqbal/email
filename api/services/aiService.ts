// Import types and configurations from extracted modules
import { AITaskType } from '../types/aiTypes';
import type { 
  ContentGenerationRequest, 
  ImageGenerationRequest, 
  AIResponse, 
  ImageResponse 
} from '../types/aiTypes';
import { 
  getAIConfig, 
  ensureValidation, 
  selectOptimalModel 
} from '../config/aiConfig';
import { generateWithOpenRouter } from '../handlers/openRouterHandler';
import { generateWithGemini } from '../handlers/geminiHandler';
import { generateImage } from '../handlers/imageHandler';

// Re-export enum for backward compatibility
export { AITaskType } from '../types/aiTypes';
// Note: Interfaces are type-only and cannot be re-exported at runtime
export type { 
  ContentGenerationRequest, 
  ImageGenerationRequest, 
  AIResponse, 
  ImageResponse 
} from '../types/aiTypes';

class MultiModelAIService {
  /**
   * Generate images using multiple fallback methods
   */
  async generateImage(request: ImageGenerationRequest): Promise<ImageResponse> {
    // Ensure API keys are validated
    ensureValidation();
    
    return generateImage(request);
  }

  // Content generation and image generation methods are now handled by separate handlers

  /**
   * Main content generation method with intelligent model selection
   */
  async generateContent(request: ContentGenerationRequest): Promise<AIResponse> {
    try {
      // Ensure API keys are validated
      ensureValidation();
      
      // Validate request
      if (!request.prompt || !request.taskType) {
        throw new Error('Missing required fields: prompt and taskType');
      }

      const selectedModel = selectOptimalModel(request.taskType);
      console.log(`🤖 Using ${selectedModel} for ${request.taskType}`);

      // Check API key availability
      const aiConfig = getAIConfig();
      if (selectedModel === 'openrouter' && !aiConfig.openRouter.apiKey) {
        throw new Error('OpenRouter API key not configured');
      }
      
      if (selectedModel === 'gemini' && !aiConfig.gemini.apiKey) {
        throw new Error('Gemini API key not configured');
      }

      if (selectedModel === 'openrouter') {
        return await generateWithOpenRouter(request);
      } else {
        return await generateWithGemini(request);
      }
    } catch (error) {
      console.error('❌ AI Content Generation Error:', error);
      throw error;
    }
  }

  /**
   * Parallel content generation for A/B testing
   */
  async generateAlternatives(request: ContentGenerationRequest): Promise<AIResponse[]> {
    const promises = [
      generateWithOpenRouter(request),
      generateWithGemini(request)
    ];

    try {
      const results = await Promise.allSettled(promises);
      return results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<AIResponse>).value);
    } catch (error) {
      console.error('Error generating alternatives:', error);
      return [];
    }
  }

  // All utility methods (prompt building, temperature, tokens, cost calculation) 
  // have been extracted to separate modules for better organization
}

// Export singleton instance
export const aiService = new MultiModelAIService();