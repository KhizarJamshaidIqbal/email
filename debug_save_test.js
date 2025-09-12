// Debug script to test save functionality
// Run this in browser console to test database operations

const testSaveOperation = async () => {
  console.log('🔍 Testing save functionality...');
  
  // Test 1: Check if user is authenticated
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('Session check:', { session: !!session, error: sessionError });
  
  if (!session) {
    console.error('❌ User not authenticated');
    return;
  }
  
  // Test 2: Try to create a test project
  const testProjectData = {
    name: 'Debug Test Project',
    content_data: {
      blocks: [
        {
          id: 'test-block-1',
          type: 'text',
          content: { text: 'Test content' },
          position: { x: 100, y: 100 },
          styles: {}
        }
      ],
      brandKit: {
        colors: ['#007bff'],
        fonts: ['Arial'],
        logos: []
      },
      version: '1.0'
    },
    status: 'draft',
    user_id: session.user.id
  };
  
  console.log('📝 Attempting to create project:', testProjectData);
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(testProjectData)
      .select();
    
    if (error) {
      console.error('❌ Create project error:', error);
      return;
    }
    
    console.log('✅ Project created successfully:', data);
    
    // Test 3: Try to update the project
    const projectId = data[0].id;
    const updateData = {
      content_data: {
        ...testProjectData.content_data,
        blocks: [
          ...testProjectData.content_data.blocks,
          {
            id: 'test-block-2',
            type: 'text',
            content: { text: 'Updated content' },
            position: { x: 200, y: 200 },
            styles: {}
          }
        ]
      },
      updated_at: new Date().toISOString()
    };
    
    console.log('📝 Attempting to update project:', updateData);
    
    const { data: updateResult, error: updateError } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select();
    
    if (updateError) {
      console.error('❌ Update project error:', updateError);
      return;
    }
    
    console.log('✅ Project updated successfully:', updateResult);
    
    // Test 4: Verify the data was saved correctly
    const { data: fetchResult, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (fetchError) {
      console.error('❌ Fetch project error:', fetchError);
      return;
    }
    
    console.log('✅ Project fetched successfully:', fetchResult);
    console.log('📊 Content blocks count:', fetchResult.content_data?.blocks?.length || 0);
    
    // Test 5: Clean up - delete the test project
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (deleteError) {
      console.error('❌ Delete project error:', deleteError);
    } else {
      console.log('🗑️ Test project cleaned up successfully');
    }
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
};

// Run the test
testSaveOperation();

console.log('Copy and paste this entire script into the browser console to test save functionality');