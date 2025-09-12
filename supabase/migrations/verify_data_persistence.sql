-- Database Verification Query for Save Functionality
-- This migration helps verify that newsletter data is actually being written to the database

-- Check recent projects to verify save operations
SELECT 'Recent Projects (Last 24 hours):' as info;
SELECT 
  id,
  name,
  status,
  created_at,
  updated_at,
  CASE 
    WHEN content_data IS NULL THEN 'No content data'
    WHEN jsonb_array_length(content_data->'blocks') = 0 THEN 'Empty blocks array'
    ELSE CONCAT(jsonb_array_length(content_data->'blocks'), ' blocks')
  END as content_summary,
  LENGTH(content_data::text) as content_size_bytes
FROM projects 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 10;

-- Check for projects with content data
SELECT 'Projects with Content Data:' as info;
SELECT 
  COUNT(*) as total_projects,
  COUNT(CASE WHEN content_data IS NOT NULL THEN 1 END) as projects_with_content,
  COUNT(CASE WHEN content_data->'blocks' IS NOT NULL THEN 1 END) as projects_with_blocks,
  AVG(jsonb_array_length(content_data->'blocks')) as avg_blocks_per_project
FROM projects;

-- Check content data structure
SELECT 'Content Data Structure Analysis:' as info;
SELECT 
  id,
  name,
  jsonb_pretty(content_data) as content_structure
FROM projects 
WHERE content_data IS NOT NULL 
  AND jsonb_array_length(content_data->'blocks') > 0
ORDER BY created_at DESC
LIMIT 3;

-- Check for any save-related issues
SELECT 'Potential Save Issues:' as info;
SELECT 
  'Projects with NULL content_data' as issue_type,
  COUNT(*) as count
FROM projects 
WHERE content_data IS NULL
UNION ALL
SELECT 
  'Projects with empty blocks array' as issue_type,
  COUNT(*) as count
FROM projects 
WHERE content_data IS NOT NULL 
  AND (content_data->'blocks' IS NULL OR jsonb_array_length(content_data->'blocks') = 0)
UNION ALL
SELECT 
  'Projects created but never updated' as issue_type,
  COUNT(*) as count
FROM projects 
WHERE created_at = updated_at
  AND created_at > NOW() - INTERVAL '24 hours';

-- Performance check
SELECT 'Database Performance Check:' as info;
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE tablename = 'projects' 
  AND schemaname = 'public';

SELECT 'Verification completed!' as result;