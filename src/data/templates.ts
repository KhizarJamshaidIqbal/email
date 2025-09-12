import { Template } from '../types/newsletter';
import { Type, Image, MousePointer, Minus, Share2, Grid } from 'lucide-react';

// Default brand colors for templates
const DEFAULT_BRAND_COLORS = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1'];

export const templates: Template[] = [
  {
    id: 'newsletter-basic',
    name: 'Basic Newsletter',
    category: 'Newsletter',
    thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=clean%20newsletter%20template%20design%20with%20header%20and%20content%20sections&image_size=square',
    blocks: [
      {
        id: 'header-1',
        type: 'text',
        content: { text: 'Newsletter Header', fontSize: 32, color: DEFAULT_BRAND_COLORS[0] },
        styles: { textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' },
        position: { x: 50, y: 50 }
      },
      {
        id: 'content-1',
        type: 'text',
        content: { text: 'Welcome to our newsletter! Here\'s what\'s new this week.', fontSize: 16, color: '#333333' },
        styles: { lineHeight: '1.6', marginBottom: '20px' },
        position: { x: 50, y: 120 }
      },
      {
        id: 'cta-1',
        type: 'button',
        content: { text: 'Read More', url: '#', backgroundColor: DEFAULT_BRAND_COLORS[0], color: '#ffffff' },
        styles: { marginTop: '20px' },
        position: { x: 50, y: 200 }
      }
    ]
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    category: 'Marketing',
    thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=product%20launch%20email%20template%20with%20hero%20image%20and%20call%20to%20action&image_size=square',
    blocks: [
      {
        id: 'hero-image',
        type: 'image',
        content: { src: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20product%20launch%20hero%20image&image_size=landscape_16_9', alt: 'Product Launch', width: '100%', height: 'auto' },
        styles: { marginBottom: '20px' },
        position: { x: 50, y: 50 }
      },
      {
        id: 'product-title',
        type: 'text',
        content: { text: 'Introducing Our Latest Product', fontSize: 28, color: DEFAULT_BRAND_COLORS[0] },
        styles: { textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' },
        position: { x: 50, y: 250 }
      },
      {
        id: 'product-description',
        type: 'text',
        content: { text: 'Experience innovation like never before with our groundbreaking new product.', fontSize: 16, color: '#666666' },
        styles: { textAlign: 'center', lineHeight: '1.6', marginBottom: '25px' },
        position: { x: 50, y: 320 }
      },
      {
        id: 'launch-cta',
        type: 'button',
        content: { text: 'Shop Now', url: '#', backgroundColor: DEFAULT_BRAND_COLORS[2], color: '#ffffff' },
        styles: { fontSize: '18px', padding: '15px 30px' },
        position: { x: 50, y: 400 }
      }
    ]
  },
  {
    id: 'event-invitation',
    name: 'Event Invitation',
    category: 'Events',
    thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20event%20invitation%20email%20template%20with%20date%20and%20location&image_size=square',
    blocks: [
      {
        id: 'event-header',
        type: 'text',
        content: { text: 'You\'re Invited!', fontSize: 36, color: DEFAULT_BRAND_COLORS[4] },
        styles: { textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' },
        position: { x: 50, y: 50 }
      },
      {
        id: 'event-title',
        type: 'text',
        content: { text: 'Annual Company Conference 2024', fontSize: 24, color: '#333333' },
        styles: { textAlign: 'center', fontWeight: '600', marginBottom: '15px' },
        position: { x: 50, y: 130 }
      },
      {
        id: 'event-details',
        type: 'text',
        content: { text: 'Join us for an exciting day of networking, learning, and innovation.\n\nDate: March 15, 2024\nTime: 9:00 AM - 5:00 PM\nLocation: Convention Center', fontSize: 16, color: '#666666' },
        styles: { textAlign: 'center', lineHeight: '1.8', marginBottom: '25px' },
        position: { x: 50, y: 200 }
      },
      {
        id: 'rsvp-button',
        type: 'button',
        content: { text: 'RSVP Now', url: '#', backgroundColor: DEFAULT_BRAND_COLORS[1], color: '#ffffff' },
        styles: { fontSize: '16px', padding: '12px 25px' },
        position: { x: 50, y: 350 }
      }
    ]
  }
];

export default templates;