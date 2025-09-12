// Debug Save Issue - Root Cause Analysis
// Run this in the browser console on the newsletter editor page

const debugSaveIssue = async () => {
  console.log('🔍 DEBUGGING SAVE ISSUE - ROOT CAUSE ANALYSIS');
  console.log('=' .repeat(70));
  
  // Step 1: Check if we're on the right page
  console.log('\n📍 Step 1: Page Verification');
  const currentUrl = window.location.href;
  console.log('Current URL:', currentUrl);
  
  if (!currentUrl.includes('newsletter-editor')) {
    console.log('⚠️ Navigate to the newsletter editor page first');
    return;
  }
  
  // Step 2: Check React components and state
  console.log('\n⚛️ Step 2: React State Analysis');
  
  // Try to access React DevTools or component state
  const reactFiber = document.querySelector('#root')?._reactInternalFiber || 
                    document.querySelector('#root')?._reactInternalInstance;
  
  if (reactFiber) {
    console.log('✅ React detected');
  } else {
    console.log('❌ React not detected or different structure');
  }
  
  // Step 3: Check for save-related elements in DOM
  console.log('\n🎯 Step 3: Save UI Elements Analysis');
  
  const saveButton = document.querySelector('[data-testid="save-button"], button[title*="Save"], button:contains("Save")');
  const autoSaveStatus = document.querySelector('[data-testid="autosave-status"], .autosave-status, .save-status');
  
  console.log('Save button found:', !!saveButton);
  console.log('Auto-save status element found:', !!autoSaveStatus);
  
  if (saveButton) {
    console.log('Save button details:', {
      text: saveButton.textContent,
      disabled: saveButton.disabled,
      className: saveButton.className
    });
  }
  
  if (autoSaveStatus) {
    console.log('Auto-save status details:', {
      text: autoSaveStatus.textContent,
      className: autoSaveStatus.className
    });
  }
  
  // Step 4: Check localStorage for any cached data
  console.log('\n💾 Step 4: Local Storage Analysis');
  
  const localStorageKeys = Object.keys(localStorage).filter(key => 
    key.includes('project') || key.includes('draft') || key.includes('newsletter')
  );
  
  console.log('Relevant localStorage keys:', localStorageKeys);
  
  localStorageKeys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      console.log(`${key}:`, value ? JSON.parse(value) : value);
    } catch (e) {
      console.log(`${key}:`, localStorage.getItem(key));
    }
  });
  
  // Step 5: Monitor network requests
  console.log('\n🌐 Step 5: Network Monitoring Setup');
  
  // Override fetch to monitor API calls
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const [url, options] = args;
    console.log('🌐 API Call:', {
      url: url.toString(),
      method: options?.method || 'GET',
      timestamp: new Date().toISOString()
    });
    
    try {
      const response = await originalFetch(...args);
      console.log('📥 API Response:', {
        url: url.toString(),
        status: response.status,
        ok: response.ok,
        timestamp: new Date().toISOString()
      });
      return response;
    } catch (error) {
      console.error('❌ API Error:', {
        url: url.toString(),
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  };
  
  // Step 6: Check for content blocks
  console.log('\n📦 Step 6: Content Blocks Analysis');
  
  const canvasArea = document.querySelector('.canvas, [data-testid="canvas"], .editor-canvas');
  const blockElements = document.querySelectorAll('[data-block-id], .content-block, .block');
  
  console.log('Canvas area found:', !!canvasArea);
  console.log('Content blocks found:', blockElements.length);
  
  if (blockElements.length > 0) {
    console.log('Block details:', Array.from(blockElements).map((block, index) => ({
      index,
      id: block.getAttribute('data-block-id') || block.id,
      className: block.className,
      textContent: block.textContent?.slice(0, 50) + '...'
    })));
  }
  
  // Step 7: Test manual save trigger
  console.log('\n🧪 Step 7: Manual Save Test');
  
  if (saveButton) {
    console.log('Attempting to trigger save button click...');
    
    // Monitor console for save-related logs
    const originalConsoleLog = console.log;
    const saveRelatedLogs = [];
    
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('save') || message.includes('Save') || message.includes('💾') || message.includes('📝')) {
        saveRelatedLogs.push({ timestamp: new Date().toISOString(), message });
      }
      originalConsoleLog(...args);
    };
    
    // Click the save button
    saveButton.click();
    
    // Wait a bit and check for logs
    setTimeout(() => {
      console.log = originalConsoleLog;
      console.log('Save-related logs captured:', saveRelatedLogs);
    }, 2000);
  }
  
  // Step 8: Authentication check
  console.log('\n🔐 Step 8: Authentication Status');
  
  if (window.supabase) {
    try {
      const { data: { session } } = await window.supabase.auth.getSession();
      console.log('Authentication status:', {
        authenticated: !!session,
        userId: session?.user?.id,
        email: session?.user?.email
      });
    } catch (error) {
      console.error('Authentication check failed:', error);
    }
  } else {
    console.log('❌ Supabase client not found in window object');
  }
  
  // Step 9: Instructions for manual testing
  console.log('\n📋 Step 9: Manual Testing Instructions');
  console.log('=' .repeat(70));
  console.log('1. Add some content blocks to the editor');
  console.log('2. Click the Save button');
  console.log('3. Watch the console for save-related logs (🚀, 📝, ✅, ❌)');
  console.log('4. Check the auto-save status indicator');
  console.log('5. Refresh the page and see if content persists');
  console.log('\n🔍 Look for these specific issues:');
  console.log('- Save button shows "Saved" but no API calls are made');
  console.log('- API calls are made but return errors');
  console.log('- Data is saved but UI state is not updated');
  console.log('- Auto-save conflicts with manual save');
  
  console.log('\n✅ Debug setup complete! Network monitoring is active.');
  console.log('Now perform the save operation and watch the console output.');
};

// Run the debug analysis
debugSaveIssue();

console.log('\n🎯 NEXT STEPS:');
console.log('1. Add content blocks to the newsletter editor');
console.log('2. Try to save the newsletter');
console.log('3. Watch the console output for detailed debugging information');
console.log('4. Look for any API calls, errors, or state issues');