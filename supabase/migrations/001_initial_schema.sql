-- Newsletter Creator Platform Database Schema
-- Create all tables and initial data as per architecture document

-- Create template_categories table first (referenced by templates)
CREATE TABLE template_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    structure JSONB NOT NULL,
    preview_image TEXT,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    template_id UUID,
    name VARCHAR(255) NOT NULL,
    content_data JSONB,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create brand_kits table
CREATE TABLE brand_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    color_palette JSONB,
    fonts JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create brand_assets table
CREATE TABLE brand_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_kit_id UUID NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_versions table
CREATE TABLE project_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    content_data JSONB NOT NULL,
    version_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    project_id UUID,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_premium ON templates(is_premium);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_template_id ON projects(template_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_brand_kits_user_id ON brand_kits(user_id);
CREATE INDEX idx_brand_assets_brand_kit_id ON brand_assets(brand_kit_id);
CREATE INDEX idx_project_versions_project_id ON project_versions(project_id);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_project_id ON analytics(project_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);

-- Insert template categories
INSERT INTO template_categories (name, description, sort_order) VALUES
('Business', 'Professional business communications', 1),
('E-commerce', 'Product promotions and sales announcements', 2),
('Events', 'Event invitations and announcements', 3),
('Newsletter', 'Regular newsletter and update templates', 4),
('Holiday', 'Seasonal and holiday-themed templates', 5);

-- Insert sample templates
INSERT INTO templates (name, category, structure, preview_image, is_premium) VALUES
('Modern Business Update', 'Business', '{"sections": [{"type": "header", "content": {"title": "Business Update", "subtitle": "Stay informed with our latest news"}}, {"type": "content", "content": {"text": "Welcome to our monthly business update..."}}, {"type": "footer", "content": {"company": "Your Company", "address": "123 Business St"}}]}', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20business%20newsletter%20template%20professional%20clean%20design&image_size=landscape_4_3', false),
('Summer Sale Promotion', 'E-commerce', '{"sections": [{"type": "hero", "content": {"title": "Summer Sale", "subtitle": "Up to 50% off selected items"}}, {"type": "products", "content": {"items": []}}, {"type": "cta", "content": {"text": "Shop Now", "link": "#"}}]}', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=summer%20sale%20ecommerce%20newsletter%20bright%20colorful%20promotional&image_size=landscape_4_3', true),
('Conference Invitation', 'Events', '{"sections": [{"type": "banner", "content": {"title": "Annual Conference 2024", "date": "March 15-17"}}, {"type": "details", "content": {"location": "Convention Center", "speakers": []}}, {"type": "registration", "content": {"text": "Register Now", "link": "#"}}]}', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=conference%20invitation%20newsletter%20professional%20event%20design&image_size=landscape_4_3', false),
('Monthly Newsletter', 'Newsletter', '{"sections": [{"type": "header", "content": {"title": "Monthly Newsletter", "issue": "Issue #1"}}, {"type": "articles", "content": {"items": []}}, {"type": "footer", "content": {"unsubscribe": "Unsubscribe"}}]}', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=monthly%20newsletter%20template%20clean%20organized%20layout&image_size=landscape_4_3', false),
('Holiday Greetings', 'Holiday', '{"sections": [{"type": "greeting", "content": {"title": "Season''s Greetings", "message": "Wishing you joy and happiness"}}, {"type": "image", "content": {"src": "", "alt": "Holiday image"}}, {"type": "signature", "content": {"name": "Your Team"}}]}', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=holiday%20greetings%20newsletter%20festive%20warm%20design&image_size=landscape_4_3', false);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for brand_kits
CREATE POLICY "Users can manage own brand kits" ON brand_kits
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for brand_assets
CREATE POLICY "Users can manage brand assets" ON brand_assets
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM brand_kits WHERE id = brand_assets.brand_kit_id
    ));

-- Create RLS policies for project_versions
CREATE POLICY "Users can manage project versions" ON project_versions
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM projects WHERE id = project_versions.project_id
    ));

-- Create RLS policies for analytics
CREATE POLICY "Users can view own analytics" ON analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create analytics" ON analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions to roles
GRANT SELECT ON templates TO anon;
GRANT SELECT ON template_categories TO anon;
GRANT ALL PRIVILEGES ON projects TO authenticated;
GRANT ALL PRIVILEGES ON brand_kits TO authenticated;
GRANT ALL PRIVILEGES ON brand_assets TO authenticated;
GRANT ALL PRIVILEGES ON project_versions TO authenticated;
GRANT ALL PRIVILEGES ON analytics TO authenticated;