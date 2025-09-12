-- Test insert permissions for projects table
-- This will help us verify if the save functionality can actually write to the database

-- First, check current permissions
SELECT 'Current permissions:' as info;
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name = 'projects'
  AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;

-- Check RLS policies
SELECT 'RLS policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'projects';

-- Test if we can insert a test record (this will help identify permission issues)
-- Note: This is just a test - we'll delete it immediately
SELECT 'Testing insert permissions...' as info;

-- Try to insert a test project (will fail if permissions are wrong)
INSERT INTO projects (name, content_data, status, user_id) 
VALUES (
  'Permission Test Project',
  '{"blocks": [], "brandKit": {"colors": [], "fonts": [], "logos": []}, "version": "1.0"}',
  'draft',
  '00000000-0000-0000-0000-000000000000'  -- Test UUID
) RETURNING id, name, created_at;

-- Clean up the test record
DELETE FROM projects WHERE name = 'Permission Test Project' AND user_id = '00000000-0000-0000-0000-000000000000';

SELECT 'Test completed successfully!' as result;