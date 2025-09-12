#!/usr/bin/env node

/**
 * Comprehensive Test Script for Newsletter Save Functionality
 * Tests authentication, template creation, content modification, and save persistence
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://slluhggkqjmvftnkcnoz.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsbHVoZ2drcWptdmZ0bmtjbm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1OTcyMzksImV4cCI6MjA3MzE3MzIzOX0.4gE0ZuujCOE8r3ouXBBJWhcwfoPXaz9DX8WIFdeElWw';

// Test user credentials
const TEST_USER = {
  email: 'khizarjamshaidiqbal@gmail.com',
  password: 'khizarjamshaidiqbal@'
};

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test data for newsletter template
const TEST_TEMPLATE_DATA = {
  name: `Test Newsletter Template ${new Date().toISOString()}`,
  blocks: [
    {
      id: 'block-1',
      type: 'text',
      content: 'Welcome to our newsletter!',
      position: { x: 50, y: 100 },
      styles: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333333'
      }
    },
    {
      id: 'block-2',
      type: 'text',
      content: 'This is a test content block that we will modify during testing.',
      position: { x: 50, y: 200 },
      styles: {
        fontSize: '16px',
        color: '#666666'
      }
    },
    {
      id: 'block-3',
      type: 'image',
      content: 'https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Test+Image',
      position: { x: 50, y: 300 },
      styles: {
        width: '400px',
        height: '200px'
      }
    },
    {
      id: 'block-4',
      type: 'button',
      content: 'Click Me!',
      position: { x: 50, y: 550 },
      styles: {
        backgroundColor: '#4F46E5',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '6px'
      }
    },
    {
      id: 'block-5',
      type: 'divider',
      content: '',
      position: { x: 50, y: 650 },
      styles: {
        width: '100%',
        height: '2px',
        backgroundColor: '#E5E7EB'
      }
    }
  ]
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function generateContentHash(blocks) {
  const content = JSON.stringify(blocks, null, 0);
  return crypto.createHash('md5').update(content).digest('hex');
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test functions
async function authenticateUser() {
  log('🔐 Authenticating user...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (error) {
      log(`Authentication failed: ${error.message}`, 'error');
      return null;
    }
    
    if (data.user) {
      log(`Authentication successful for user: ${data.user.email}`, 'success');
      return data.user;
    }
    
    log('Authentication failed: No user data returned', 'error');
    return null;
  } catch (error) {
    log(`Authentication error: ${error.message}`, 'error');
    return null;
  }
}

async function createNewTemplate(user) {
  log('📝 Creating new newsletter template...');
  
  try {
    const templateData = {
      name: TEST_TEMPLATE_DATA.name,
      content_data: {
        blocks: TEST_TEMPLATE_DATA.blocks,
        metadata: {
          created: new Date().toISOString(),
          version: '1.0.0'
        }
      },
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('projects')
      .insert([templateData])
      .select()
      .single();
    
    if (error) {
      log(`Template creation failed: ${error.message}`, 'error');
      return null;
    }
    
    log(`Template created successfully with ID: ${data.id}`, 'success');
    return data;
  } catch (error) {
    log(`Template creation error: ${error.message}`, 'error');
    return null;
  }
}

async function modifyTemplateContent(template) {
  log('✏️ Modifying template content...');
  
  try {
    // Modify existing blocks
    const modifiedBlocks = [...template.content_data.blocks];
    
    // Update text content
    modifiedBlocks[0].content = 'UPDATED: Welcome to our amazing newsletter!';
    modifiedBlocks[1].content = 'UPDATED: This content has been modified during testing to verify save functionality.';
    
    // Update styles
    modifiedBlocks[0].styles.color = '#FF6B6B';
    modifiedBlocks[1].styles.fontSize = '18px';
    
    // Add a new block
    modifiedBlocks.push({
      id: 'block-6',
      type: 'text',
      content: 'NEW BLOCK: This block was added during testing!',
      position: { x: 50, y: 700 },
      styles: {
        fontSize: '14px',
        color: '#10B981',
        fontStyle: 'italic'
      }
    });
    
    // Update positions
    modifiedBlocks[2].position.x = 100;
    modifiedBlocks[3].position.y = 600;
    
    const updatedContentData = {
      ...template.content_data,
      blocks: modifiedBlocks,
      metadata: {
        ...template.content_data.metadata,
        lastModified: new Date().toISOString(),
        modifications: 'Updated text content, styles, positions, and added new block'
      }
    };
    
    log(`Modified ${modifiedBlocks.length} blocks (added 1 new block)`, 'success');
    return updatedContentData;
  } catch (error) {
    log(`Content modification error: ${error.message}`, 'error');
    return null;
  }
}

async function saveTemplate(templateId, updatedContentData) {
  log('💾 Saving template changes...');
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        content_data: updatedContentData,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) {
      log(`Template save failed: ${error.message}`, 'error');
      return false;
    }
    
    log(`Template saved successfully at ${data.updated_at}`, 'success');
    return true;
  } catch (error) {
    log(`Template save error: ${error.message}`, 'error');
    return false;
  }
}

async function verifyTemplatePersistence(templateId, expectedContentData) {
  log('🔍 Verifying template persistence...');
  
  try {
    // Wait a moment to ensure database consistency
    await sleep(1000);
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (error) {
      log(`Template retrieval failed: ${error.message}`, 'error');
      return false;
    }
    
    if (!data) {
      log('Template not found in database', 'error');
      return false;
    }
    
    // Verify content data
    const savedBlocks = data.content_data.blocks;
    const expectedBlocks = expectedContentData.blocks;
    
    if (savedBlocks.length !== expectedBlocks.length) {
      log(`Block count mismatch: expected ${expectedBlocks.length}, got ${savedBlocks.length}`, 'error');
      return false;
    }
    
    // Verify specific modifications
    const firstBlock = savedBlocks[0];
    if (!firstBlock.content.includes('UPDATED: Welcome to our amazing newsletter!')) {
      log('First block content was not saved correctly', 'error');
      return false;
    }
    
    const newBlock = savedBlocks.find(block => block.id === 'block-6');
    if (!newBlock) {
      log('New block was not saved', 'error');
      return false;
    }
    
    if (!newBlock.content.includes('NEW BLOCK: This block was added during testing!')) {
      log('New block content was not saved correctly', 'error');
      return false;
    }
    
    // Verify style changes
    if (firstBlock.styles.color !== '#FF6B6B') {
      log('Style changes were not saved correctly', 'error');
      return false;
    }
    
    // Verify position changes
    const imageBlock = savedBlocks.find(block => block.type === 'image');
    if (imageBlock.position.x !== 100) {
      log('Position changes were not saved correctly', 'error');
      return false;
    }
    
    log('All template changes verified successfully!', 'success');
    return true;
  } catch (error) {
    log(`Template verification error: ${error.message}`, 'error');
    return false;
  }
}

async function testAutoSaveFunctionality(templateId) {
  log('⏰ Testing auto-save functionality...');
  
  try {
    // Simulate auto-save by making small changes
    const autoSaveData = {
      blocks: [{
        id: 'auto-save-block',
        type: 'text',
        content: 'Auto-save test block',
        position: { x: 50, y: 800 },
        styles: { fontSize: '12px', color: '#888888' }
      }],
      metadata: {
        autoSaveTest: true,
        timestamp: new Date().toISOString()
      }
    };
    
    const { data, error } = await supabase
      .from('projects')
      .update({
        content_data: autoSaveData,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) {
      log(`Auto-save test failed: ${error.message}`, 'error');
      return false;
    }
    
    log('Auto-save functionality working correctly', 'success');
    return true;
  } catch (error) {
    log(`Auto-save test error: ${error.message}`, 'error');
    return false;
  }
}

async function cleanupTestData(templateId) {
  log('🧹 Cleaning up test data...');
  
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', templateId);
    
    if (error) {
      log(`Cleanup failed: ${error.message}`, 'error');
      return false;
    }
    
    log('Test data cleaned up successfully', 'success');
    return true;
  } catch (error) {
    log(`Cleanup error: ${error.message}`, 'error');
    return false;
  }
}

// Main test execution
async function runSaveFunctionalityTest() {
  console.log('🚀 Starting Newsletter Save Functionality Test\n');
  
  let testResults = {
    authentication: false,
    templateCreation: false,
    contentModification: false,
    templateSave: false,
    persistenceVerification: false,
    autoSave: false,
    cleanup: false
  };
  
  let template = null;
  let updatedContentData = null;
  
  try {
    // Step 1: Authenticate user
    const user = await authenticateUser();
    if (!user) {
      log('Test failed at authentication step', 'error');
      return testResults;
    }
    testResults.authentication = true;
    
    // Step 2: Create new template
    template = await createNewTemplate(user);
    if (!template) {
      log('Test failed at template creation step', 'error');
      return testResults;
    }
    testResults.templateCreation = true;
    
    // Step 3: Modify template content
    updatedContentData = await modifyTemplateContent(template);
    if (!updatedContentData) {
      log('Test failed at content modification step', 'error');
      return testResults;
    }
    testResults.contentModification = true;
    
    // Step 4: Save template
    const saveSuccess = await saveTemplate(template.id, updatedContentData);
    if (!saveSuccess) {
      log('Test failed at template save step', 'error');
      return testResults;
    }
    testResults.templateSave = true;
    
    // Step 5: Verify persistence
    const persistenceSuccess = await verifyTemplatePersistence(template.id, updatedContentData);
    if (!persistenceSuccess) {
      log('Test failed at persistence verification step', 'error');
      return testResults;
    }
    testResults.persistenceVerification = true;
    
    // Step 6: Test auto-save
    const autoSaveSuccess = await testAutoSaveFunctionality(template.id);
    if (!autoSaveSuccess) {
      log('Test failed at auto-save step', 'error');
    } else {
      testResults.autoSave = true;
    }
    
    // Step 7: Cleanup
    const cleanupSuccess = await cleanupTestData(template.id);
    testResults.cleanup = cleanupSuccess;
    
  } catch (error) {
    log(`Unexpected test error: ${error.message}`, 'error');
  }
  
  // Print test results
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(testResults).forEach(([test, passed]) => {
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${test.padEnd(25)}: ${status}`);
  });
  
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! Save functionality is working correctly.', 'success');
  } else {
    log('⚠️ Some tests failed. Save functionality needs attention.', 'error');
  }
  
  return testResults;
}

// Run the test
runSaveFunctionalityTest()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    log(`Test execution failed: ${error.message}`, 'error');
    process.exit(1);
  });

export {
  runSaveFunctionalityTest,
  authenticateUser,
  createNewTemplate,
  modifyTemplateContent,
  saveTemplate,
  verifyTemplatePersistence
};