import nodemailer from 'nodemailer';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import axios from 'axios';

// Legacy email service configurations (for backward compatibility)
const emailConfig = {
  sendGrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'info@imagehosts.site',
    fromName: process.env.SENDGRID_FROM_NAME || 'Newsletter Creator'
  },
  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY || '',
    serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || 'us1'
  }
};

// Mock SendGrid mail object for legacy compatibility
const sgMail = {
  send: async (emailData: any) => {
    throw new Error('SendGrid is disabled. Please use SMTP provider instead.');
  }
};

// SMTP Email Service Configuration
interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  fromEmail: string;
  fromName: string;
}

const smtpConfig: SMTPConfig = {
  host: process.env.SMTP_HOST || 'imagehosts.site',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: (process.env.SMTP_SECURE || 'true').toLowerCase() === 'true',
  auth: {
    user: process.env.SMTP_USER || 'info@imagehosts.site',
    pass: process.env.SMTP_PASS || 'JinnahEnt786'
  },
  fromEmail: process.env.SMTP_FROM_EMAIL || 'info@imagehosts.site',
  fromName: process.env.SMTP_FROM_NAME || 'Newsletter Creator'
};

console.log('🔧 SMTP Config loaded:', {
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  user: smtpConfig.auth.user,
  hasPassword: !!smtpConfig.auth.pass
});

// Email Provider Types
export enum EmailProvider {
  SMTP = 'smtp',
  SENDGRID = 'sendgrid', // Legacy support
  MAILCHIMP = 'mailchimp' // Legacy support
}

// Newsletter Distribution Request
export interface NewsletterDistributionRequest {
  provider: EmailProvider;
  subject: string;
  htmlContent: string;
  textContent?: string;
  recipients: EmailRecipient[];
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
  trackingEnabled?: boolean;
  scheduledTime?: Date;
}

// Email Recipient Interface
export interface EmailRecipient {
  email: string;
  name?: string;
  customFields?: Record<string, any>;
}

// Campaign Creation Request (for Mailchimp)
export interface CampaignRequest {
  listId: string;
  subject: string;
  htmlContent: string;
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  trackingOptions?: {
    opens: boolean;
    htmlClicks: boolean;
    textClicks: boolean;
  };
}

// Distribution Response
export interface DistributionResponse {
  success: boolean;
  messageId?: string;
  campaignId?: string;
  recipientCount: number;
  provider: EmailProvider;
  scheduledTime?: Date;
  estimatedDeliveryTime?: Date;
  cost?: number;
  errors?: string[];
}

// Analytics Response
export interface EmailAnalytics {
  campaignId: string;
  provider: EmailProvider;
  sentCount: number;
  deliveredCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  unsubscribeCount: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  topClickedLinks?: Array<{
    url: string;
    clicks: number;
  }>;
  deviceStats?: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  locationStats?: Array<{
    country: string;
    opens: number;
    clicks: number;
  }>;
}

class EmailDistributionService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    // Initialize SMTP Transporter with secure SSL/TLS connection
    this.transporter = createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure, // true for 465, false for other ports
      auth: {
        user: smtpConfig.auth.user,
        pass: smtpConfig.auth.pass
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 15000, // 15 seconds
      socketTimeout: 30000, // 30 seconds
      debug: process.env.NODE_ENV === 'development', // Enable debug in development
      logger: process.env.NODE_ENV === 'development' // Enable logging in development
    });

    console.log('📧 SMTP Email Service initialized with secure connection');
    console.log(`🔧 SMTP Config: ${smtpConfig.host}:${smtpConfig.port} (secure: ${smtpConfig.secure})`);
  }

  /**
   * Distribute newsletter using the specified provider
   */
  async distributeNewsletter(request: NewsletterDistributionRequest): Promise<DistributionResponse> {
    console.log(`📧 Distributing newsletter via ${request.provider} to ${request.recipients.length} recipients`);

    switch (request.provider) {
      case EmailProvider.SMTP:
        return await this.distributeViaSMTP(request);
      case EmailProvider.SENDGRID:
        return await this.distributeViaSendGrid(request);
      case EmailProvider.MAILCHIMP:
        return await this.distributeViaMailchimp(request);
      default:
        throw new Error(`Unsupported email provider: ${request.provider}`);
    }
  }

  /**
   * SMTP Distribution with Custom Email Server
   * Purpose: Direct email sending using custom SMTP server with SSL/TLS encryption
   * Best for: Complete control, cost-effective bulk sending, custom domain authentication
   */
  private async distributeViaSMTP(request: NewsletterDistributionRequest): Promise<DistributionResponse> {
    try {
      console.log('🔐 Starting secure SMTP distribution...');
      
      // Verify SMTP connection
      await this.verifyConnection();
      
      const sentEmails: string[] = [];
      const failedEmails: string[] = [];
      
      // Send emails in batches to avoid overwhelming the server
      const batchSize = 10;
      const batches = this.chunkArray(request.recipients, batchSize);
      
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`📤 Processing batch ${i + 1}/${batches.length} (${batch.length} recipients)`);
        
        const batchPromises = batch.map(async (recipient) => {
          try {
            const mailOptions = {
              from: {
                name: request.fromName || smtpConfig.fromName,
                address: request.fromEmail || smtpConfig.fromEmail
              },
              to: {
                name: recipient.name || '',
                address: recipient.email
              },
              replyTo: request.replyTo,
              subject: request.subject,
              html: request.htmlContent,
              text: request.textContent,
              headers: {
                'X-Newsletter-ID': `newsletter-${Date.now()}`,
                'X-Recipient-ID': recipient.email,
                'List-Unsubscribe': '<mailto:unsubscribe@imagehosts.site>'
              }
            };
            
            const info = await this.transporter.sendMail(mailOptions);
            sentEmails.push(recipient.email);
            console.log(`✅ Email sent to ${recipient.email}: ${info.messageId}`);
            return { success: true, email: recipient.email, messageId: info.messageId };
          } catch (error) {
            failedEmails.push(recipient.email);
            console.error(`❌ Failed to send email to ${recipient.email}:`, error);
            return { success: false, email: recipient.email, error: error instanceof Error ? error.message : 'Unknown error' };
          }
        });
        
        await Promise.all(batchPromises);
        
        // Add delay between batches to respect rate limits
        if (i < batches.length - 1) {
          await this.delay(1000); // 1 second delay
        }
      }
      
      const successCount = sentEmails.length;
      const failureCount = failedEmails.length;
      
      console.log(`📊 SMTP Distribution completed: ${successCount} sent, ${failureCount} failed`);
      
      return {
        success: successCount > 0,
        messageId: `smtp-batch-${Date.now()}`,
        recipientCount: successCount,
        provider: EmailProvider.SMTP,
        scheduledTime: request.scheduledTime,
        estimatedDeliveryTime: new Date(),
        cost: 0, // Custom SMTP is cost-free
        errors: failureCount > 0 ? [`${failureCount} emails failed to send`] : undefined
      };
    } catch (error) {
      console.error('SMTP distribution error:', error);
      return {
        success: false,
        recipientCount: 0,
        provider: EmailProvider.SMTP,
        errors: [error instanceof Error ? error.message : 'Unknown SMTP error']
      };
    }
  }

  /**
   * Verify SMTP connection
   */
  public async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (error) {
      console.error('❌ SMTP connection verification failed:', error);
      throw new Error(`SMTP connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Utility function to chunk array into smaller batches
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
    * Utility function to add delay
    */
   private delay(ms: number): Promise<void> {
     return new Promise(resolve => setTimeout(resolve, ms));
   }

   /**
    * Validate email address format
    */
   validateEmail(email: string): boolean {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
   }

   /**
    * Validate multiple email addresses
    */
   validateEmailList(emails: string[]): { valid: string[]; invalid: string[] } {
     const valid: string[] = [];
     const invalid: string[] = [];
     
     emails.forEach(email => {
       if (this.validateEmail(email)) {
         valid.push(email);
       } else {
         invalid.push(email);
       }
     });
     
     return { valid, invalid };
   }

   /**
    * Test SMTP connection and send a test email
    */
   async sendTestEmail(toEmail: string, subject: string = 'SMTP Test Email'): Promise<{ success: boolean; messageId?: string; error?: string }> {
     try {
       // Validate email first
       if (!this.validateEmail(toEmail)) {
         throw new Error('Invalid email address format');
       }
       
       // Verify connection
       await this.verifyConnection();
       
       const testMailOptions = {
         from: {
           name: smtpConfig.fromName,
           address: smtpConfig.fromEmail
         },
         to: toEmail,
         subject: subject,
         html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
             <h2 style="color: #2563EB;">🎉 SMTP Configuration Test</h2>
             <p>Congratulations! Your custom SMTP email configuration is working perfectly.</p>
             <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
               <h3 style="margin-top: 0; color: #374151;">Configuration Details:</h3>
               <ul style="color: #6b7280;">
                 <li><strong>SMTP Server:</strong> ${smtpConfig.host}</li>
                 <li><strong>Port:</strong> ${smtpConfig.port} (SSL/TLS)</li>
                 <li><strong>From Email:</strong> ${smtpConfig.fromEmail}</li>
                 <li><strong>Security:</strong> ${smtpConfig.secure ? 'Enabled' : 'Disabled'}</li>
               </ul>
             </div>
             <p style="color: #6b7280;">This email was sent at: ${new Date().toLocaleString()}</p>
             <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
             <p style="font-size: 12px; color: #9ca3af;">Newsletter Creator Platform - Custom SMTP Service</p>
           </div>
         `,
         text: `
           SMTP Configuration Test
           
           Congratulations! Your custom SMTP email configuration is working perfectly.
           
           Configuration Details:
           - SMTP Server: ${smtpConfig.host}
           - Port: ${smtpConfig.port} (SSL/TLS)
           - From Email: ${smtpConfig.fromEmail}
           - Security: ${smtpConfig.secure ? 'Enabled' : 'Disabled'}
           
           This email was sent at: ${new Date().toLocaleString()}
           
           Newsletter Creator Platform - Custom SMTP Service
         `
       };
       
       const info = await this.transporter.sendMail(testMailOptions);
       console.log('✅ Test email sent successfully:', info.messageId);
       
       return {
         success: true,
         messageId: info.messageId
       };
     } catch (error) {
       console.error('❌ Test email failed:', error);
       return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error'
       };
     }
   }

   /**
    * Get SMTP service status and configuration info
    */
   getServiceStatus(): {
     configured: boolean;
     host: string;
     port: number;
     secure: boolean;
     fromEmail: string;
     fromName: string;
   } {
     const isConfigured = !!(smtpConfig.auth.user && smtpConfig.auth.pass && smtpConfig.host);
     console.log(`📊 SMTP Status Check: configured=${isConfigured}, user=${!!smtpConfig.auth.user}, pass=${!!smtpConfig.auth.pass}, host=${!!smtpConfig.host}`);
     
     return {
       configured: isConfigured,
       host: smtpConfig.host,
       port: smtpConfig.port,
       secure: smtpConfig.secure,
       fromEmail: smtpConfig.fromEmail,
       fromName: smtpConfig.fromName
     };
   }

  /**
   * SendGrid Distribution
   * Purpose: Direct email sending with high deliverability
   * Best for: Transactional emails, immediate sends, personalized content
   */
  private async distributeViaSendGrid(request: NewsletterDistributionRequest): Promise<DistributionResponse> {
    try {
      const personalizations = request.recipients.map(recipient => ({
        to: [{
          email: recipient.email,
          name: recipient.name
        }],
        custom_args: recipient.customFields || {}
      }));

      const emailData = {
        personalizations,
        from: {
          email: request.fromEmail || emailConfig.sendGrid.fromEmail,
          name: request.fromName || emailConfig.sendGrid.fromName
        },
        reply_to: request.replyTo ? {
          email: request.replyTo
        } : undefined,
        subject: request.subject,
        content: [
          {
            type: 'text/html',
            value: request.htmlContent
          },
          ...(request.textContent ? [{
            type: 'text/plain',
            value: request.textContent
          }] : [])
        ],
        tracking_settings: request.trackingEnabled ? {
          click_tracking: { enable: true },
          open_tracking: { enable: true },
          subscription_tracking: { enable: true }
        } : undefined,
        send_at: request.scheduledTime ? Math.floor(request.scheduledTime.getTime() / 1000) : undefined
      };

      const response = await sgMail.send(emailData as any);
      
      return {
        success: true,
        messageId: Array.isArray(response) && response[0] && (response[0] as any).headers ? (response[0] as any).headers['x-message-id'] : 'mock-message-id',
        recipientCount: request.recipients.length,
        provider: EmailProvider.SENDGRID,
        scheduledTime: request.scheduledTime,
        estimatedDeliveryTime: request.scheduledTime || new Date(),
        cost: this.calculateSendGridCost(request.recipients.length)
      };
    } catch (error) {
      console.error('SendGrid distribution error:', error);
      return {
        success: false,
        recipientCount: 0,
        provider: EmailProvider.SENDGRID,
        errors: [error instanceof Error ? error.message : 'Unknown SendGrid error']
      };
    }
  }

  /**
   * Mailchimp Distribution
   * Purpose: Campaign management with advanced segmentation and automation
   * Best for: Marketing campaigns, subscriber management, A/B testing
   */
  private async distributeViaMailchimp(request: NewsletterDistributionRequest): Promise<DistributionResponse> {
    try {
      // First, create a campaign
      const campaignResponse = await this.createMailchimpCampaign({
        listId: 'default_list', // This should be configurable
        subject: request.subject,
        htmlContent: request.htmlContent,
        fromEmail: request.fromEmail || emailConfig.sendGrid.fromEmail,
        fromName: request.fromName || emailConfig.sendGrid.fromName,
        replyTo: request.replyTo,
        trackingOptions: {
          opens: true,
          htmlClicks: true,
          textClicks: true
        }
      });

      // Schedule or send the campaign
      let sendResponse;
      if (request.scheduledTime) {
        sendResponse = await this.scheduleMailchimpCampaign(campaignResponse.id, request.scheduledTime);
      } else {
        sendResponse = await this.sendMailchimpCampaign(campaignResponse.id);
      }

      return {
        success: true,
        campaignId: campaignResponse.id,
        recipientCount: request.recipients.length,
        provider: EmailProvider.MAILCHIMP,
        scheduledTime: request.scheduledTime,
        estimatedDeliveryTime: request.scheduledTime || new Date(),
        cost: this.calculateMailchimpCost(request.recipients.length)
      };
    } catch (error) {
      console.error('Mailchimp distribution error:', error);
      return {
        success: false,
        recipientCount: 0,
        provider: EmailProvider.MAILCHIMP,
        errors: [error instanceof Error ? error.message : 'Unknown Mailchimp error']
      };
    }
  }

  /**
   * Create Mailchimp Campaign
   */
  private async createMailchimpCampaign(request: CampaignRequest): Promise<{ id: string }> {
    const response = await axios.post(
      `https://${emailConfig.mailchimp.serverPrefix}.api.mailchimp.com/3.0/campaigns`,
      {
        type: 'regular',
        recipients: {
          list_id: request.listId
        },
        settings: {
          subject_line: request.subject,
          from_name: request.fromName,
          reply_to: request.replyTo || request.fromEmail,
          tracking: request.trackingOptions
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${emailConfig.mailchimp.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Set campaign content
    await axios.put(
      `https://${emailConfig.mailchimp.serverPrefix}.api.mailchimp.com/3.0/campaigns/${response.data.id}/content`,
      {
        html: request.htmlContent
      },
      {
        headers: {
          'Authorization': `Bearer ${emailConfig.mailchimp.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return { id: response.data.id };
  }

  /**
   * Send Mailchimp Campaign immediately
   */
  private async sendMailchimpCampaign(campaignId: string): Promise<void> {
    await axios.post(
      `https://${emailConfig.mailchimp.serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/send`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${emailConfig.mailchimp.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  /**
   * Schedule Mailchimp Campaign
   */
  private async scheduleMailchimpCampaign(campaignId: string, scheduleTime: Date): Promise<void> {
    await axios.post(
      `https://${emailConfig.mailchimp.serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/schedule`,
      {
        schedule_time: scheduleTime.toISOString()
      },
      {
        headers: {
          'Authorization': `Bearer ${emailConfig.mailchimp.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  /**
   * Get email analytics from SendGrid
   */
  async getSendGridAnalytics(messageId: string): Promise<EmailAnalytics | null> {
    try {
      const response = await axios.get(
        `https://api.sendgrid.com/v3/messages/${messageId}`,
        {
          headers: {
            'Authorization': `Bearer ${emailConfig.sendGrid.apiKey}`
          }
        }
      );

      // Transform SendGrid response to our analytics format
      const data = response.data;
      return {
        campaignId: messageId,
        provider: EmailProvider.SENDGRID,
        sentCount: data.stats?.sent || 0,
        deliveredCount: data.stats?.delivered || 0,
        openCount: data.stats?.opens || 0,
        clickCount: data.stats?.clicks || 0,
        bounceCount: data.stats?.bounces || 0,
        unsubscribeCount: data.stats?.unsubscribes || 0,
        openRate: data.stats?.open_rate || 0,
        clickRate: data.stats?.click_rate || 0,
        bounceRate: data.stats?.bounce_rate || 0,
        unsubscribeRate: data.stats?.unsubscribe_rate || 0
      };
    } catch (error) {
      console.error('Error fetching SendGrid analytics:', error);
      return null;
    }
  }

  /**
   * Get email analytics from Mailchimp
   */
  async getMailchimpAnalytics(campaignId: string): Promise<EmailAnalytics | null> {
    try {
      const response = await axios.get(
        `https://${emailConfig.mailchimp.serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/reports`,
        {
          headers: {
            'Authorization': `Bearer ${emailConfig.mailchimp.apiKey}`
          }
        }
      );

      const data = response.data;
      return {
        campaignId,
        provider: EmailProvider.MAILCHIMP,
        sentCount: data.emails_sent || 0,
        deliveredCount: data.emails_sent - (data.bounces?.hard_bounces || 0) - (data.bounces?.soft_bounces || 0),
        openCount: data.opens?.opens_total || 0,
        clickCount: data.clicks?.clicks_total || 0,
        bounceCount: (data.bounces?.hard_bounces || 0) + (data.bounces?.soft_bounces || 0),
        unsubscribeCount: data.unsubscribed || 0,
        openRate: data.opens?.open_rate || 0,
        clickRate: data.clicks?.click_rate || 0,
        bounceRate: data.bounces?.bounce_rate || 0,
        unsubscribeRate: data.unsubscribed / data.emails_sent || 0,
        topClickedLinks: data.clicks?.clicks_by_link?.slice(0, 5) || [],
        deviceStats: {
          desktop: data.opens?.opens_by_client?.desktop || 0,
          mobile: data.opens?.opens_by_client?.mobile || 0,
          tablet: data.opens?.opens_by_client?.tablet || 0
        }
      };
    } catch (error) {
      console.error('Error fetching Mailchimp analytics:', error);
      return null;
    }
  }

  /**
   * Calculate SendGrid cost estimation
   */
  private calculateSendGridCost(recipientCount: number): number {
    // SendGrid pricing: approximately $0.0006 per email
    return recipientCount * 0.0006;
  }

  /**
   * Calculate Mailchimp cost estimation
   */
  private calculateMailchimpCost(recipientCount: number): number {
    // Mailchimp pricing varies by plan, this is an estimate
    return recipientCount * 0.001;
  }

  /**
   * Validate email configuration
   */
  validateConfiguration(): {
    sendGrid: boolean;
    mailchimp: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const sendGridValid = !!emailConfig.sendGrid.apiKey;
    const mailchimpValid = !!emailConfig.mailchimp.apiKey;

    if (!sendGridValid) {
      errors.push('SendGrid API key is missing');
    }

    if (!mailchimpValid) {
      errors.push('Mailchimp API key is missing');
    }

    return {
      sendGrid: sendGridValid,
      mailchimp: mailchimpValid,
      errors
    };
  }

  /**
   * Test email connectivity
   */
  async testConnectivity(provider: EmailProvider): Promise<boolean> {
    try {
      switch (provider) {
        case EmailProvider.SENDGRID:
          await axios.get('https://api.sendgrid.com/v3/user/profile', {
            headers: {
              'Authorization': `Bearer ${emailConfig.sendGrid.apiKey}`
            }
          });
          return true;

        case EmailProvider.MAILCHIMP:
          await axios.get(
            `https://${emailConfig.mailchimp.serverPrefix}.api.mailchimp.com/3.0/ping`,
            {
              headers: {
                'Authorization': `Bearer ${emailConfig.mailchimp.apiKey}`
              }
            }
          );
          return true;

        default:
          return false;
      }
    } catch (error) {
      console.error(`${provider} connectivity test failed:`, error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailDistributionService();