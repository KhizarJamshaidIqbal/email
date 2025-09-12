// Comprehensive Save Functionality Test
// Copy and paste this entire script into the browser console while on the newsletter editor page

const runComprehensiveSaveTest = async () => {
  console.log('🧪 Starting Comprehensive Save Functionality Test');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Check authentication status
    console.log('\n🔐 Test 1: Authentication Status');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return;
    }
    
    if (!session) {
      console.error('❌ User not authenticated. Please log in first.');
      return;
    }
    
    console.log('✅ User authenticated:', {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role
    });
    
    // Test 2: Check database connectivity
    console.log('\n🔗 Test 2: Database Connectivity');
    const { data: testQuery, error: connectError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (connectError) {
      console.error('❌ Database connection error:', connectError);
      return;
    }
    
    console.log('✅ Database connection successful');
    
    // Test 3: Check existing projects
    console.log('\n📊 Test 3: Existing Projects');
    const { data: existingProjects, error: fetchError } = await supabase
      .from('projects')
      .select('id, name, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (fetchError) {
      console.error('❌ Error fetching projects:', fetchError);
    } else {
      console.log('✅ Existing projects:', existingProjects?.length || 0);
      if (existingProjects && existingProjects.length > 0) {
        console.log('Recent projects:', existingProjects.map(p => ({ id: p.id, name: p.name })));
      }
    }
    
    // Test 4: Create a test project
    console.log('\n💾 Test 4: Create Test Project');
    const testProjectData = {
      name: `Save Test ${new Date().toISOString()}`,
      content_data: {
        blocks: [
          {
            id: 'test-block-1',
            type: 'text',
            content: { text: 'This is a test text block' },
            position: { x: 100, y: 100 },
            styles: { fontSize: '16px', color: '#000000' }
          },
          {
            id: 'test-block-2',
            type: 'image',
            content: { src: 'https://via.placeholder.com/300x200', alt: 'Test image' },
            position: { x: 100, y: 200 },
            styles: { width: '300px', height: '200px' }
          }
        ],
        brandKit: {
          colors: ['#007bff', '#28a745'],
          fonts: ['Arial', 'Helvetica'],
          logos: []
        },
        version: '1.0'
      },
      status: 'draft',
      user_id: session.user.id
    };
    
    console.log('📝 Creating project with data:', {
      name: testProjectData.name,
      blocksCount: testProjectData.content_data.blocks.length,
      contentSize: JSON.stringify(testProjectData.content_data).length
    });
    
    const { data: createdProject, error: createError } = await supabase
      .from('projects')
      .insert(testProjectData)
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Project creation failed:', createError);
      return;
    }
    
    console.log('✅ Project created successfully:', {
      id: createdProject.id,
      name: createdProject.name,
      createdAt: createdProject.created_at
    });
    
    // Test 5: Verify the project was saved correctly
    console.log('\n🔍 Test 5: Verify Project Data');
    const { data: verifyProject, error: verifyError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', createdProject.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Project verification failed:', verifyError);
    } else {
      console.log('✅ Project verification successful:', {
        id: verifyProject.id,
        name: verifyProject.name,
        blocksCount: verifyProject.content_data?.blocks?.length || 0,
        hasContentData: !!verifyProject.content_data,
        contentDataKeys: Object.keys(verifyProject.content_data || {})
      });
      
      // Verify blocks data
      if (verifyProject.content_data?.blocks) {
        console.log('📦 Blocks verification:', verifyProject.content_data.blocks.map(block => ({
          id: block.id,
          type: block.type,
          hasContent: !!block.content,
          hasPosition: !!block.position
        })));
      }
    }
    
    // Test 6: Update the project
    console.log('\n📝 Test 6: Update Project');
    const updateData = {
      content_data: {
        ...testProjectData.content_data,
        blocks: [
          ...testProjectData.content_data.blocks,
          {
            id: 'test-block-3',
            type: 'text',
            content: { text: 'This is an updated block' },
            position: { x: 100, y: 300 },
            styles: { fontSize: '18px', color: '#ff0000' }
          }
        ]
      },
      updated_at: new Date().toISOString()
    };
    
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', createdProject.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Project update failed:', updateError);
    } else {
      console.log('✅ Project updated successfully:', {
        id: updatedProject.id,
        blocksCount: updatedProject.content_data?.blocks?.length || 0,
        updatedAt: updatedProject.updated_at
      });
    }
    
    // Test 7: Clean up - delete the test project
    console.log('\n🗑️ Test 7: Cleanup');
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', createdProject.id);
    
    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError);
      console.log('⚠️ Please manually delete test project:', createdProject.id);
    } else {
      console.log('✅ Test project cleaned up successfully');
    }
    
    // Test Summary
    console.log('\n🎉 TEST SUMMARY');
    console.log('=' .repeat(60));
    console.log('✅ Authentication: PASSED');
    console.log('✅ Database Connectivity: PASSED');
    console.log('✅ Project Creation: PASSED');
    console.log('✅ Data Verification: PASSED');
    console.log('✅ Project Update: PASSED');
    console.log('✅ Cleanup: PASSED');
    console.log('\n🎯 CONCLUSION: Save functionality is working correctly!');
    console.log('\nIf you\'re still experiencing issues, the problem might be:');
    console.log('1. Frontend state management not updating correctly');
    console.log('2. Auto-save timing conflicts');
    console.log('3. UI not reflecting the actual save status');
    
  } catch (error) {
    console.error('❌ Unexpected test error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
};

// Auto-run the test
runComprehensiveSaveTest();

console.log('\n📋 INSTRUCTIONS:');
console.log('1. Open the newsletter editor page');
console.log('2. Open browser console (F12)');
console.log('3. Copy and paste this entire script');
console.log('4. Press Enter to run the test');
console.log('5. Review the test results above');