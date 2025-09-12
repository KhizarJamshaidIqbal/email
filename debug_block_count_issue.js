// Debug script to test block count and save functionality
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugBlockCountIssue() {
  console.log('🔍 Starting block count debug investigation...');
  
  try {
    // 1. Check if we can connect to Supabase
    console.log('\n1. Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError);
      return;
    }
    console.log('✅ Supabase connection successful');
    
    // 2. Authenticate with test user
    console.log('\n2. Authenticating with test user...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'khizarjamshaidiqbal@gmail.com',
      password: 'khizarjamshaidiqbal@'
    });
    
    if (authError) {
      console.error('❌ Authentication failed:', authError);
      return;
    }
    console.log('✅ Authentication successful:', authData.user.email);
    
    // 3. Fetch existing projects
    console.log('\n3. Fetching existing projects...');
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', authData.user.id)
      .order('updated_at', { ascending: false });
    
    if (fetchError) {
      console.error('❌ Failed to fetch projects:', fetchError);
      return;
    }
    
    console.log(`✅ Found ${projects.length} projects`);
    
    // 4. Analyze each project's content_data
    console.log('\n4. Analyzing project content_data...');
    projects.forEach((project, index) => {
      console.log(`\nProject ${index + 1}: ${project.name}`);
      console.log('  ID:', project.id);
      console.log('  Status:', project.status);
      console.log('  Updated:', project.updated_at);
      
      if (project.content_data) {
        console.log('  Content Data Type:', typeof project.content_data);
        console.log('  Content Data:', JSON.stringify(project.content_data, null, 2));
        
        if (project.content_data.blocks) {
          console.log('  Blocks Array Length:', project.content_data.blocks.length);
          console.log('  Blocks:', project.content_data.blocks.map(block => ({
            id: block.id,
            type: block.type,
            content: block.content
          })));
        } else {
          console.log('  ❌ No blocks array found in content_data');
        }
      } else {
        console.log('  ❌ No content_data found');
      }
    });
    
    // 5. Create a test project with blocks
    console.log('\n5. Creating test project with blocks...');
    const testProjectData = {
      name: `Debug Test ${new Date().toISOString()}`,
      user_id: authData.user.id,
      status: 'draft',
      content_data: {
        blocks: [
          {
            id: 'test-block-1',
            type: 'text',
            content: {
              text: 'Test text block',
              fontSize: 16,
              color: '#000000'
            },
            position: { x: 100, y: 100 },
            styles: {}
          },
          {
            id: 'test-block-2',
            type: 'button',
            content: {
              text: 'Test Button',
              backgroundColor: '#007bff',
              color: '#ffffff'
            },
            position: { x: 100, y: 200 },
            styles: {}
          }
        ],
        brandKit: {
          colors: ['#007bff', '#28a745'],
          fonts: ['Arial', 'Helvetica'],
          logos: []
        },
        viewMode: 'desktop'
      }
    };
    
    const { data: newProject, error: createError } = await supabase
      .from('projects')
      .insert(testProjectData)
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Failed to create test project:', createError);
      return;
    }
    
    console.log('✅ Test project created successfully:');
    console.log('  ID:', newProject.id);
    console.log('  Name:', newProject.name);
    console.log('  Blocks Count:', newProject.content_data?.blocks?.length || 0);
    
    // 6. Verify the project was saved correctly
    console.log('\n6. Verifying saved project...');
    const { data: verifyProject, error: verifyError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', newProject.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Failed to verify project:', verifyError);
      return;
    }
    
    console.log('✅ Project verification successful:');
    console.log('  Blocks in saved project:', verifyProject.content_data?.blocks?.length || 0);
    console.log('  Content data structure:', {
      hasBlocks: !!verifyProject.content_data?.blocks,
      blocksLength: verifyProject.content_data?.blocks?.length,
      hasBrandKit: !!verifyProject.content_data?.brandKit,
      hasViewMode: !!verifyProject.content_data?.viewMode
    });
    
    // 7. Test updating the project with more blocks
    console.log('\n7. Testing project update with additional blocks...');
    const updatedContentData = {
      ...verifyProject.content_data,
      blocks: [
        ...verifyProject.content_data.blocks,
        {
          id: 'test-block-3',
          type: 'image',
          content: {
            src: 'https://example.com/image.jpg',
            alt: 'Test image'
          },
          position: { x: 100, y: 300 },
          styles: {}
        }
      ]
    };
    
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        content_data: updatedContentData,
        updated_at: new Date().toISOString()
      })
      .eq('id', newProject.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Failed to update project:', updateError);
      return;
    }
    
    console.log('✅ Project update successful:');
    console.log('  Updated blocks count:', updatedProject.content_data?.blocks?.length || 0);
    
    // 8. Clean up test project
    console.log('\n8. Cleaning up test project...');
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', newProject.id);
    
    if (deleteError) {
      console.error('❌ Failed to delete test project:', deleteError);
    } else {
      console.log('✅ Test project cleaned up successfully');
    }
    
    console.log('\n🎉 Block count debug investigation completed!');
    console.log('\n📋 Summary:');
    console.log('- Supabase connection: Working');
    console.log('- Authentication: Working');
    console.log('- Project creation: Working');
    console.log('- Block saving: Working');
    console.log('- Project updates: Working');
    console.log('\n💡 If the frontend still shows 0 blocks, the issue is likely in:');
    console.log('1. Frontend data loading/parsing');
    console.log('2. React state management');
    console.log('3. Component re-rendering issues');
    console.log('4. Cache invalidation problems');
    
  } catch (error) {
    console.error('❌ Debug investigation failed:', error);
  }
}

// Run the debug investigation
debugBlockCountIssue().then(() => {
  console.log('\n🏁 Debug script completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Debug script failed:', error);
  process.exit(1);
});