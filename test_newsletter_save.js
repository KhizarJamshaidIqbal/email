// Test script to debug newsletter save functionality
// Run this in the browser console on the newsletter editor page

const testNewsletterSave = async () => {
  console.log('🧪 Testing Newsletter Save Functionality');
  console.log('=' .repeat(50));
  
  // Check if we have access to the required functions
  if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase client not available');
    return;
  }
  
  try {
    // Test 1: Check authentication
    console.log('\n🔐 Test 1: Authentication Check');
    const { data: { session }, error: sessionError } = await window.supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return;
    }
    
    if (!session) {
      console.error('❌ User not authenticated');
      return;
    }
    
    console.log('✅ User authenticated:', session.user.email);
    
    // Test 2: Create a test project with blocks
    console.log('\n💾 Test 2: Save Test Project');
    const testBlocks = [
      {
        id: 'test-block-1',
        type: 'text',
        content: { text: 'Test text block' },
        position: { x: 100, y: 100 },
        styles: { fontSize: '16px', color: '#000000' }
      },
      {
        id: 'test-block-2',
        type: 'button',
        content: { text: 'Test Button', href: '#' },
        position: { x: 100, y: 200 },
        styles: { backgroundColor: '#007bff', color: '#ffffff' }
      }
    ];
    
    const testProjectData = {
      name: `Test Save ${new Date().toISOString()}`,
      content_data: {
        blocks: testBlocks,
        brandKit: {
          colors: ['#007bff', '#28a745'],
          fonts: ['Arial'],
          logos: []
        },
        version: '1.0'
      },
      status: 'draft',
      user_id: session.user.id
    };
    
    console.log('📤 Saving test project with data:', {
      name: testProjectData.name,
      blocksCount: testProjectData.content_data.blocks.length,
      blocks: testProjectData.content_data.blocks,
      contentDataSize: JSON.stringify(testProjectData.content_data).length
    });
    
    const { data: savedProject, error: saveError } = await window.supabase
      .from('projects')
      .insert(testProjectData)
      .select()
      .single();
    
    if (saveError) {
      console.error('❌ Save error:', saveError);
      return;
    }
    
    console.log('✅ Project saved successfully:', {
      id: savedProject.id,
      name: savedProject.name,
      blocksInSaved: savedProject.content_data?.blocks?.length || 0
    });
    
    // Test 3: Verify the project was saved correctly
    console.log('\n🔍 Test 3: Verify Saved Data');
    const { data: retrievedProject, error: retrieveError } = await window.supabase
      .from('projects')
      .select('*')
      .eq('id', savedProject.id)
      .single();
    
    if (retrieveError) {
      console.error('❌ Retrieve error:', retrieveError);
      return;
    }
    
    console.log('📥 Retrieved project data:', {
      id: retrievedProject.id,
      name: retrievedProject.name,
      hasContentData: !!retrievedProject.content_data,
      hasBlocks: !!retrievedProject.content_data?.blocks,
      blocksCount: retrievedProject.content_data?.blocks?.length || 0,
      blocks: retrievedProject.content_data?.blocks || [],
      fullContentData: retrievedProject.content_data
    });
    
    // Test 4: Compare saved vs retrieved
    console.log('\n⚖️ Test 4: Data Integrity Check');
    const originalBlocksCount = testBlocks.length;
    const savedBlocksCount = retrievedProject.content_data?.blocks?.length || 0;
    
    if (originalBlocksCount === savedBlocksCount) {
      console.log('✅ Block count matches:', originalBlocksCount);
    } else {
      console.error('❌ Block count mismatch:', {
        original: originalBlocksCount,
        saved: savedBlocksCount
      });
    }
    
    // Test 5: Clean up test project
    console.log('\n🧹 Test 5: Cleanup');
    const { error: deleteError } = await window.supabase
      .from('projects')
      .delete()
      .eq('id', savedProject.id);
    
    if (deleteError) {
      console.error('❌ Cleanup error:', deleteError);
    } else {
      console.log('✅ Test project cleaned up');
    }
    
    console.log('\n🎉 Save functionality test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testNewsletterSave();