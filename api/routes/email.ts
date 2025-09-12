import { Router, Request, Response } from 'express';
import { emailService, EmailProvider, NewsletterDistributionRequest, EmailRecipient } from '../services/emailService';

const router = Router();

/**
 * POST /api/email/distribute
 * Distribute newsletter via email service providers
 */
router.post('/distribute', async (req: Request, res: Response) => {
  try {
    const {
      provider,
      subject,
      htmlContent,
      textContent,
      recipients,
      fromEmail,
      fromName,
      replyTo,
      trackingEnabled = true,
      scheduledTime
    } = req.body;

    // Validate required fields
    if (!provider || !subject || !htmlContent || !recipients || !Array.isArray(recipients)) {
      return res.status(400).json({
        error: 'Missing required fields: provider, subject, htmlContent, recipients'
      });
    }

    // Validate provider
    if (!Object.values(EmailProvider).includes(provider)) {
      return res.status(400).json({
        error: 'Invalid email provider',
        validProviders: Object.values(EmailProvider)
      });
    }

    // Validate recipients
    const validRecipients: EmailRecipient[] = recipients.filter((recipient: any) => {
      return recipient.email && typeof recipient.email === 'string' && recipient.email.includes('@');
    });

    if (validRecipients.length === 0) {
      return res.status(400).json({
        error: 'No valid recipients found. Each recipient must have a valid email address.'
      });
    }

    const distributionRequest: NewsletterDistributionRequest = {
      provider,
      subject,
      htmlContent,
      textContent,
      recipients: validRecipients,
      fromEmail,
      fromName,
      replyTo,
      trackingEnabled,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined
    };

    const result = await emailService.distributeNewsletter(distributionRequest);

    res.json({
      success: result.success,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email distribution error:', error);
    res.status(500).json({
      error: 'Failed to distribute newsletter',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/email/analytics/:provider/:campaignId
 * Get email campaign analytics
 */
router.get('/analytics/:provider/:campaignId', async (req: Request, res: Response) => {
  try {
    const { provider, campaignId } = req.params;

    if (!Object.values(EmailProvider).includes(provider as EmailProvider)) {
      return res.status(400).json({
        error: 'Invalid email provider',
        validProviders: Object.values(EmailProvider)
      });
    }

    let analytics;
    if (provider === EmailProvider.SENDGRID) {
      analytics = await emailService.getSendGridAnalytics(campaignId);
    } else if (provider === EmailProvider.MAILCHIMP) {
      analytics = await emailService.getMailchimpAnalytics(campaignId);
    }

    if (!analytics) {
      return res.status(404).json({
        error: 'Analytics not found for the specified campaign'
      });
    }

    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/email/providers
 * Get available email providers and their status
 */
router.get('/providers', async (req: Request, res: Response) => {
  try {
    const smtpStatus = emailService.getServiceStatus();
    
    const providers = [
      {
        name: EmailProvider.SMTP,
        displayName: 'Custom SMTP',
        description: 'Direct email sending using your own SMTP server with SSL/TLS encryption',
        features: [
          'Complete control over email delivery',
          'Cost-effective bulk sending',
          'Custom domain authentication',
          'SSL/TLS encryption',
          'No third-party dependencies',
          'Batch processing with rate limiting'
        ],
        bestFor: 'High-volume newsletters, cost-effective sending, complete control',
        configured: smtpStatus.configured,
        pricing: 'Free (using your own SMTP server)',
        limits: 'Depends on your SMTP server configuration',
        status: smtpStatus
      },
      {
        name: EmailProvider.SENDGRID,
        displayName: 'SendGrid (Legacy)',
        description: 'High-deliverability email service for transactional and marketing emails',
        features: [
          'Real-time analytics',
          'High deliverability rates',
          'Advanced personalization',
          'Immediate sending',
          'Detailed bounce handling'
        ],
        bestFor: 'Transactional emails, immediate sends, personalized content',
        configured: false, // Disabled in favor of SMTP
        pricing: 'Pay-per-email ($0.0006 per email)',
        limits: 'Up to 100 emails/day on free tier'
      },
      {
        name: EmailProvider.MAILCHIMP,
        displayName: 'Mailchimp (Legacy)',
        description: 'Comprehensive marketing platform with advanced campaign management',
        features: [
          'Advanced segmentation',
          'A/B testing',
          'Automation workflows',
          'Subscriber management',
          'Template library',
          'Social media integration'
        ],
        bestFor: 'Marketing campaigns, subscriber management, automation',
        configured: false, // Disabled in favor of SMTP
        pricing: 'Subscription-based (starts at $10/month)',
        limits: '2,000 contacts and 10,000 emails/month on free tier'
      }
    ];

    res.json({
      success: true,
      data: {
        providers,
        activeProvider: EmailProvider.SMTP,
        smtpConfiguration: smtpStatus
      }
    });
  } catch (error) {
    console.error('Provider status error:', error);
    res.status(500).json({
      error: 'Failed to get provider status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/email/test-connection
 * Test SMTP connection
 */
router.post('/test-connection', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Testing SMTP connection...');
    
    // Test SMTP connection by verifying the transporter
    const testResult = await emailService.verifyConnection();
    
    res.json({
      success: true,
      message: 'SMTP connection verified successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('SMTP connection test failed:', error);
    res.status(500).json({
      success: false,
      error: 'SMTP connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/email/send-test
 * Send a test email using SMTP
 */
router.post('/send-test', async (req: Request, res: Response) => {
  try {
    const { toEmail, subject } = req.body;
    
    if (!toEmail) {
      return res.status(400).json({
        error: 'Missing required field: toEmail'
      });
    }
    
    // Validate email format
    if (!emailService.validateEmail(toEmail)) {
      return res.status(400).json({
        error: 'Invalid email address format'
      });
    }
    
    console.log(`📧 Sending test email to: ${toEmail}`);
    
    const result = await emailService.sendTestEmail(toEmail, subject);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send test email',
        message: result.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/email/validate
 * Validate email addresses
 */
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { emails } = req.body;
    
    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({
        error: 'Missing required field: emails (array)'
      });
    }
    
    const validation = emailService.validateEmailList(emails);
    
    res.json({
      success: true,
      data: {
        total: emails.length,
        valid: validation.valid,
        invalid: validation.invalid,
        validCount: validation.valid.length,
        invalidCount: validation.invalid.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate emails',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/email/status
 * Get SMTP service status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const status = emailService.getServiceStatus();
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get service status',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/email/preview
 * Generate email preview for testing
 */
router.post('/preview', async (req: Request, res: Response) => {
  try {
    const { htmlContent, textContent, subject, preheaderText } = req.body;

    if (!htmlContent || !subject) {
      return res.status(400).json({
        error: 'Missing required fields: htmlContent and subject'
      });
    }

    // Generate preview data
    const preview = {
      subject,
      preheaderText: preheaderText || '',
      htmlContent,
      textContent: textContent || stripHtml(htmlContent),
      estimatedSize: {
        html: Buffer.byteLength(htmlContent, 'utf8'),
        text: Buffer.byteLength(textContent || stripHtml(htmlContent), 'utf8')
      },
      recommendations: generateEmailRecommendations(subject, htmlContent)
    };

    res.json({
      success: true,
      data: preview,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email preview error:', error);
    res.status(500).json({
      error: 'Failed to generate email preview',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/email/validate-recipients
 * Validate email recipient list
 */
router.post('/validate-recipients', async (req: Request, res: Response) => {
  try {
    const { recipients } = req.body;

    if (!recipients || !Array.isArray(recipients)) {
      return res.status(400).json({
        error: 'Recipients must be an array'
      });
    }

    const validation = {
      total: recipients.length,
      valid: 0,
      invalid: 0,
      duplicates: 0,
      validRecipients: [] as EmailRecipient[],
      invalidRecipients: [] as any[],
      duplicateEmails: [] as string[]
    };

    const emailSet = new Set<string>();
    const duplicateSet = new Set<string>();

    recipients.forEach((recipient: any, index: number) => {
      const email = recipient.email?.toLowerCase().trim();
      
      if (!email || !isValidEmail(email)) {
        validation.invalid++;
        validation.invalidRecipients.push({
          index,
          email: recipient.email,
          reason: 'Invalid email format'
        });
        return;
      }

      if (emailSet.has(email)) {
        validation.duplicates++;
        if (!duplicateSet.has(email)) {
          validation.duplicateEmails.push(email);
          duplicateSet.add(email);
        }
        validation.invalidRecipients.push({
          index,
          email,
          reason: 'Duplicate email'
        });
        return;
      }

      emailSet.add(email);
      validation.valid++;
      validation.validRecipients.push({
        email,
        name: recipient.name || '',
        customFields: recipient.customFields || {}
      });
    });

    res.json({
      success: true,
      data: validation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Recipient validation error:', error);
    res.status(500).json({
      error: 'Failed to validate recipients',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Helper function to strip HTML tags
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Helper function to validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Helper function to generate email recommendations
 */
function generateEmailRecommendations(subject: string, htmlContent: string): string[] {
  const recommendations: string[] = [];
  
  // Subject line recommendations
  if (subject.length > 50) {
    recommendations.push('Consider shortening your subject line (currently ' + subject.length + ' characters). Aim for 30-50 characters for better mobile display.');
  }
  
  if (subject.length < 20) {
    recommendations.push('Your subject line might be too short. Consider adding more descriptive text to improve engagement.');
  }

  // Content recommendations
  const textContent = stripHtml(htmlContent);
  const wordCount = textContent.split(/\s+/).length;
  
  if (wordCount > 500) {
    recommendations.push('Your email content is quite long (' + wordCount + ' words). Consider breaking it into sections or using a "read more" approach.');
  }

  // Check for common issues
  if (!htmlContent.includes('unsubscribe')) {
    recommendations.push('Consider adding an unsubscribe link to comply with email regulations and improve deliverability.');
  }

  if (!htmlContent.includes('alt=')) {
    recommendations.push('Add alt text to your images for better accessibility and email client compatibility.');
  }

  return recommendations;
}

export default router;