import axios from 'axios';
import type { ContentGenerationRequest, AIResponse } from '../types/aiTypes';
import { getAIConfig, getMaxTokens, getTemperature, calculateCost } from '../config/aiConfig';
import { buildSystemPrompt, buildUserPrompt } from '../utils/promptBuilders';

/**
 * Generate content using OpenRouter
 */
export async function generateWithOpenRouter(request: ContentGenerationRequest): Promise<AIResponse> {
  const systemPrompt = buildSystemPrompt(request);
  const userPrompt = buildUserPrompt(request);
  const config = getAIConfig();

  try {
    const response = await axios.post(
      `${config.openRouter.baseURL}/chat/completions`,
      {
        model: 'anthropic/claude-3.5-sonnet', // High-quality model for content
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: getMaxTokens(request.length),
        temperature: getTemperature(request.taskType)
      },
      {
        headers: {
          'Authorization': `Bearer ${config.openRouter.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    return {
      content,
      confidence: 0.9,
      modelUsed: 'OpenRouter (Claude 3.5 Sonnet)',
      usage: {
        tokens: response.data.usage?.total_tokens || 0,
        cost: calculateCost(response.data.usage?.total_tokens || 0, 'openrouter')
      }
    };
  } catch (error: any) {
    console.error('OpenRouter API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method
      }
    });
    
    if (error.response?.status === 401) {
      throw new Error('OpenRouter API key is invalid or expired');
    } else if (error.response?.status === 429) {
      throw new Error('OpenRouter API rate limit exceeded');
    } else if (error.response?.data?.error) {
      throw new Error(`OpenRouter API Error: ${error.response.data.error.message || error.response.data.error}`);
    } else {
      throw new Error(`Failed to generate content with OpenRouter: ${error.message}`);
    }
  }
}

// Named export used directly in aiService.ts