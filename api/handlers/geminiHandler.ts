import axios from 'axios';
import type { ContentGenerationRequest, AIResponse } from '../types/aiTypes';
import { getAIConfig, getMaxTokens, getTemperature, calculateCost } from '../config/aiConfig';
import { buildGeminiPrompt } from '../utils/promptBuilders';

/**
 * Generate content using Gemini
 */
export async function generateWithGemini(request: ContentGenerationRequest): Promise<AIResponse> {
  const prompt = buildGeminiPrompt(request);
  const aiConfig = getAIConfig();

  try {
    const response = await axios.post(
      `${aiConfig.gemini.baseURL}/models/${aiConfig.gemini.textModel}:generateContent`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: getTemperature(request.taskType),
          maxOutputTokens: getMaxTokens(request.length),
          topP: 0.8,
          topK: 40
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          key: aiConfig.gemini.apiKey
        }
      }
    );

    const content = response.data.candidates[0].content.parts[0].text;
    return {
      content,
      confidence: 0.85,
      modelUsed: 'Google Gemini Pro',
      usage: {
        tokens: response.data.usageMetadata?.totalTokenCount || 0,
        cost: calculateCost(response.data.usageMetadata?.totalTokenCount || 0, 'gemini')
      }
    };
  } catch (error: any) {
    console.error('Gemini API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method
      }
    });
    
    if (error.response?.status === 400) {
      throw new Error('Gemini API: Invalid request or API key');
    } else if (error.response?.status === 403) {
      throw new Error('Gemini API: Access forbidden - check API key permissions');
    } else if (error.response?.status === 429) {
      throw new Error('Gemini API rate limit exceeded');
    } else if (error.response?.data?.error) {
      throw new Error(`Gemini API Error: ${error.response.data.error.message || error.response.data.error}`);
    } else {
      throw new Error(`Failed to generate content with Gemini: ${error.message}`);
    }
  }
}

// Named export used directly in aiService.ts