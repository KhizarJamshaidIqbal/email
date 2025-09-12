-- Grant permissions to anon and authenticated roles for all tables

-- Grant permissions for projects table
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO authenticated;

-- Grant permissions for templates table
GRANT SELECT ON templates TO anon;
GRANT SELECT ON templates TO authenticated;

-- Grant permissions for template_categories table
GRANT SELECT ON template_categories TO anon;
GRANT SELECT ON template_categories TO authenticated;

-- Grant permissions for brand_kits table
GRANT SELECT, INSERT, UPDATE, DELETE ON brand_kits TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON brand_kits TO authenticated;

-- Grant permissions for brand_assets table
GRANT SELECT, INSERT, UPDATE, DELETE ON brand_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON brand_assets TO authenticated;

-- Grant permissions for project_versions table
GRANT SELECT, INSERT, UPDATE, DELETE ON project_versions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON project_versions TO authenticated;

-- Grant permissions for analytics table
GRANT SELECT, INSERT, UPDATE, DELETE ON analytics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON analytics TO authenticated;

-- Check current permissions
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;