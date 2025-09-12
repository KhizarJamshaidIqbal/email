import { Router, Request, Response } from 'express';
import { aiService, AITaskType, ContentGenerationRequest, ImageGenerationRequest } from '../services/aiService';

const router = Router();

/**
 * POST /api/ai/generate-content
 * Generate newsletter content using AI
 */
router.post('/generate-content', async (req: Request, res: Response) => {
  try {
    const {
      taskType,
      prompt,
      tone = 'professional',
      length = 'medium',
      audience,
      brandVoice,
      additionalContext
    } = req.body;

    // Validate required fields
    if (!taskType || !prompt) {
      return res.status(400).json({
        error: 'Missing required fields: taskType and prompt'
      });
    }

    // Validate task type
    if (!Object.values(AITaskType).includes(taskType)) {
      return res.status(400).json({
        error: 'Invalid task type',
        validTypes: Object.values(AITaskType)
      });
    }

    const request: ContentGenerationRequest = {
      taskType,
      prompt,
      tone,
      length,
      audience,
      brandVoice,
      additionalContext
    };

    const result = await aiService.generateContent(request);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI content generation error:', error);
    res.status(500).json({
      error: 'Failed to generate content',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/ai/generate-alternatives
 * Generate multiple content alternatives using different AI models
 */
router.post('/generate-alternatives', async (req: Request, res: Response) => {
  try {
    const {
      taskType,
      prompt,
      tone = 'professional',
      length = 'medium',
      audience,
      brandVoice,
      additionalContext
    } = req.body;

    if (!taskType || !prompt) {
      return res.status(400).json({
        error: 'Missing required fields: taskType and prompt'
      });
    }

    const request: ContentGenerationRequest = {
      taskType,
      prompt,
      tone,
      length,
      audience,
      brandVoice,
      additionalContext
    };

    const alternatives = await aiService.generateAlternatives(request);

    res.json({
      success: true,
      data: {
        alternatives,
        count: alternatives.length,
        recommendation: alternatives.length > 0 ? alternatives[0] : null
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI alternatives generation error:', error);
    res.status(500).json({
      error: 'Failed to generate alternatives',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/ai/generate-image
 * Generate images using Gemini Imagen
 */
router.post('/generate-image', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      style = 'professional',
      size = 'landscape',
      colorScheme,
      brandElements
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Missing required field: prompt'
      });
    }

    const request: ImageGenerationRequest = {
      prompt,
      style,
      size,
      colorScheme,
      brandElements
    };

    const result = await aiService.generateImage(request);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI image generation error:', error);
    res.status(500).json({
      error: 'Failed to generate image',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/ai/task-types
 * Get available AI task types
 */
router.get('/task-types', (req: Request, res: Response) => {
  const taskTypes = Object.values(AITaskType).map(type => ({
    value: type,
    label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: getTaskTypeDescription(type)
  }));

  res.json({
    success: true,
    data: taskTypes
  });
});

/**
 * POST /api/ai/optimize-content
 * Optimize existing content for better engagement
 */
router.post('/optimize-content', async (req: Request, res: Response) => {
  try {
    const { content, optimizationGoal = 'engagement', targetAudience } = req.body;

    if (!content) {
      return res.status(400).json({
        error: 'Missing required field: content'
      });
    }

    const optimizationPrompt = `Optimize the following newsletter content for ${optimizationGoal}${targetAudience ? ` targeting ${targetAudience}` : ''}:\n\n${content}\n\nProvide an improved version that maintains the original message while enhancing ${optimizationGoal}.`;

    const request: ContentGenerationRequest = {
      taskType: AITaskType.CONTENT_OPTIMIZATION,
      prompt: optimizationPrompt,
      tone: 'professional',
      length: 'medium'
    };

    const result = await aiService.generateContent(request);

    res.json({
      success: true,
      data: {
        original: content,
        optimized: result.content,
        optimizationGoal,
        modelUsed: result.modelUsed,
        confidence: result.confidence
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Content optimization error:', error);
    res.status(500).json({
      error: 'Failed to optimize content',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/ai/suggest-subject-lines
 * Generate multiple subject line suggestions
 */
router.post('/suggest-subject-lines', async (req: Request, res: Response) => {
  try {
    const { content, tone = 'professional', count = 5 } = req.body;

    if (!content) {
      return res.status(400).json({
        error: 'Missing required field: content'
      });
    }

    const subjectPrompt = `Based on this newsletter content, generate ${count} compelling subject lines that would encourage opens:\n\n${content}\n\nProvide diverse options with different approaches (curiosity, urgency, benefit-focused, etc.).`;

    const request: ContentGenerationRequest = {
      taskType: AITaskType.SUBJECT_LINE,
      prompt: subjectPrompt,
      tone,
      length: 'short'
    };

    const result = await aiService.generateContent(request);

    // Parse the generated content to extract individual subject lines
    const subjectLines = result.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, count);

    res.json({
      success: true,
      data: {
        subjectLines,
        count: subjectLines.length,
        modelUsed: result.modelUsed
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Subject line generation error:', error);
    res.status(500).json({
      error: 'Failed to generate subject lines',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Helper function to get task type descriptions
 */
function getTaskTypeDescription(taskType: AITaskType): string {
  const descriptions = {
    [AITaskType.NEWSLETTER_CONTENT]: 'Generate comprehensive newsletter content with engaging copy',
    [AITaskType.SUBJECT_LINE]: 'Create compelling subject lines that increase open rates',
    [AITaskType.PREHEADER_TEXT]: 'Write preview text that complements the subject line',
    [AITaskType.PRODUCT_DESCRIPTION]: 'Craft detailed product descriptions for e-commerce newsletters',
    [AITaskType.EVENT_ANNOUNCEMENT]: 'Create exciting event announcements and invitations',
    [AITaskType.BUSINESS_UPDATE]: 'Write professional business updates and company news',
    [AITaskType.IMAGE_GENERATION]: 'Generate custom images for newsletter content',
    [AITaskType.CONTENT_OPTIMIZATION]: 'Improve existing content for better engagement',
    [AITaskType.TONE_ADJUSTMENT]: 'Adjust content tone to match brand voice',
    [AITaskType.TRANSLATION]: 'Translate content to different languages'
  };

  return descriptions[taskType] || 'AI-powered content generation';
}

export default router;