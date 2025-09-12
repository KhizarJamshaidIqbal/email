import { ContentGenerationRequest, ImageGenerationRequest, ToneInstructions, LengthInstructions } from '../types/aiTypes';

/**
 * Build system prompt for OpenRouter
 */
export function buildSystemPrompt(request: ContentGenerationRequest): string {
  const basePrompt = `You are an expert newsletter content creator specializing in ${request.taskType.replace('_', ' ')}. `;
  
  const toneInstructions: ToneInstructions = {
    professional: 'Use a professional, authoritative tone.',
    casual: 'Use a casual, conversational tone.',
    friendly: 'Use a warm, friendly tone.',
    urgent: 'Use an urgent, action-oriented tone.',
    promotional: 'Use an engaging, promotional tone.'
  };

  const lengthInstructions: LengthInstructions = {
    short: 'Keep the content concise and to the point (50-100 words).',
    medium: 'Provide moderate detail (100-200 words).',
    long: 'Provide comprehensive detail (200-400 words).'
  };

  return `${basePrompt}${toneInstructions[request.tone || 'professional']} ${lengthInstructions[request.length || 'medium']} ${request.brandVoice ? `Brand voice: ${request.brandVoice}.` : ''}`;
}

/**
 * Build user prompt
 */
export function buildUserPrompt(request: ContentGenerationRequest): string {
  let prompt = request.prompt;
  
  if (request.audience) {
    prompt += `\n\nTarget audience: ${request.audience}`;
  }
  
  if (request.additionalContext) {
    prompt += `\n\nAdditional context: ${request.additionalContext}`;
  }

  return prompt;
}

/**
 * Build Gemini-specific prompt
 */
export function buildGeminiPrompt(request: ContentGenerationRequest): string {
  const systemContext = buildSystemPrompt(request);
  const userPrompt = buildUserPrompt(request);
  return `${systemContext}\n\n${userPrompt}`;
}

/**
 * Build enhanced image generation prompt
 */
export function buildImagePrompt(request: ImageGenerationRequest): string {
  let prompt = request.prompt;
  
  if (request.style) {
    prompt += `, ${request.style} style`;
  }
  
  if (request.colorScheme && request.colorScheme.length > 0) {
    prompt += `, using colors: ${request.colorScheme.join(', ')}`;
  }
  
  if (request.brandElements && request.brandElements.length > 0) {
    prompt += `, incorporating: ${request.brandElements.join(', ')}`;
  }

  // Add quality and format specifications
  prompt += ', high quality, professional newsletter image, clean composition';
  
  return prompt;
}

export default {
  buildSystemPrompt,
  buildUserPrompt,
  buildGeminiPrompt,
  buildImagePrompt
};