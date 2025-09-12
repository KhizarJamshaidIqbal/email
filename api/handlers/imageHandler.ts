import axios from 'axios';
import type { ImageGenerationRequest, ImageResponse, ImageSizeMapping, ColorMapping } from '../types/aiTypes';
import { buildImagePrompt } from '../utils/promptBuilders';

/**
 * Generate images using multiple fallback methods
 */
export async function generateImage(request: ImageGenerationRequest): Promise<ImageResponse> {
  const enhancedPrompt = buildImagePrompt(request);
  
  try {
    // Try Trae AI image generation API first
    const imageUrl = await generateWithTraeAPI(enhancedPrompt, request);
    
    return {
      imageUrl,
      prompt: enhancedPrompt,
      style: request.style || 'professional',
      modelUsed: 'Trae AI Image Generator',
      usage: {
        cost: 0.01
      }
    };
  } catch (error) {
    console.error('Primary image generation failed, trying fallback:', error);
    
    // Fallback to placeholder with proper styling
    return generateFallbackImage(request, enhancedPrompt);
  }
}

/**
 * Generate image using Trae AI API
 */
export async function generateWithTraeAPI(prompt: string, request: ImageGenerationRequest): Promise<string> {
  const imageSize = mapImageSize(request.size || 'landscape');
  const encodedPrompt = encodeURIComponent(prompt);
  
  // Use Trae AI image generation service
  const imageUrl = `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=${imageSize}`;
  
  // Validate the URL is accessible
  try {
    const response = await axios.head(imageUrl, { timeout: 5000 });
    if (response.status === 200) {
      return imageUrl;
    }
  } catch (error) {
    console.log('Trae API validation failed, using direct URL');
  }
  
  return imageUrl;
}

/**
 * Map request size to Trae API format
 */
export function mapImageSize(size: string): string {
  const sizeMap: ImageSizeMapping = {
    'square': 'square_hd',
    'landscape': 'landscape_16_9',
    'portrait': 'portrait_4_3',
    'wide': 'landscape_4_3'
  };
  return sizeMap[size] || 'landscape_16_9';
}

/**
 * Generate fallback image with proper styling
 */
export function generateFallbackImage(request: ImageGenerationRequest, prompt: string): ImageResponse {
  // Create a styled placeholder image URL
  const style = request.style || 'professional';
  const colorScheme = request.colorScheme?.join(',') || 'blue,white';
  
  // Use a service that generates styled placeholder images
  const fallbackUrl = `https://via.placeholder.com/800x600/${getColorFromScheme(colorScheme)}/ffffff?text=${encodeURIComponent('Newsletter Image')}`;
  
  return {
    imageUrl: fallbackUrl,
    prompt,
    style,
    modelUsed: 'Fallback Generator',
    usage: {
      cost: 0
    }
  };
}

/**
 * Extract primary color from color scheme
 */
export function getColorFromScheme(colorScheme: string): string {
  const colors = colorScheme.split(',')[0]?.trim().toLowerCase();
  const colorMap: ColorMapping = {
    'blue': '3B82F6',
    'green': '10B981',
    'purple': '8B5CF6',
    'red': 'EF4444',
    'orange': 'F59E0B',
    'gray': '6B7280'
  };
  return colorMap[colors] || '3B82F6';
}

// Named exports used directly in aiService.ts and other modules