import { ContentBlock, Template, BrandKit } from '../types/newsletter';

// Template Operations Utilities
export class TemplateManager {
  static applyBrandingToTemplate(template: Template, brandKit: BrandKit): ContentBlock[] {
    return template.blocks.map(block => {
      const newBlock = { ...block };
      
      // Apply brand colors based on block type
      if (block.type === 'text' && block.content.color === brandKit.colors[0]) {
        newBlock.content = { ...block.content, color: brandKit.colors[0] };
      }
      if (block.type === 'button') {
        newBlock.content = { 
          ...block.content, 
          backgroundColor: brandKit.colors[0],
          color: '#ffffff'
        };
      }
      
      // Apply brand fonts
      if (block.type === 'text') {
        newBlock.styles = { 
          ...block.styles, 
          fontFamily: brandKit.fonts[0]
        };
      }
      
      // Generate unique IDs for new blocks
      newBlock.id = `${block.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return newBlock;
    });
  }

  static async applyTemplate(
    template: Template, 
    brandKit: BrandKit,
    onProgress?: (message: string) => void
  ): Promise<ContentBlock[]> {
    try {
      onProgress?.('Applying template...');
      
      // Simulate API call or processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Apply brand colors to template blocks
      const brandedBlocks = this.applyBrandingToTemplate(template, brandKit);
      
      onProgress?.('Template applied successfully!');
      return brandedBlocks;
      
    } catch (error) {
      console.error('Error applying template:', error);
      throw new Error('Failed to apply template. Please try again.');
    }
  }

  static validateTemplate(template: Template): boolean {
    if (!template || !template.id || !template.name || !template.blocks) {
      return false;
    }
    
    // Validate blocks structure
    return template.blocks.every(block => 
      block.id && block.type && block.content && block.position
    );
  }

  static getTemplatePreviewData(template: Template, brandKit: BrandKit) {
    return {
      ...template,
      blocks: this.applyBrandingToTemplate(template, brandKit)
    };
  }
}

export default TemplateManager;