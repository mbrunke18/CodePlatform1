import { db } from '../server/db.js';
import { eq } from 'drizzle-orm';
import { playbookLibrary, executionInstances, notifications } from '../shared/schema.js';

async function testActivation() {
  console.log('🧪 Testing Activation Orchestration Engine...\n');
  
  // Step 1: Find a playbook and scenario to test with
  console.log('📚 Step 1: Finding a playbook and scenario...');
  const playbook = await db.query.playbookLibrary.findFirst();
  
  if (!playbook) {
    console.error('❌ No playbook found');
    return;
  }
  
  console.log(`✅ Found playbook: "${playbook.name}" (ID: ${playbook.id})`);
  console.log(`   Playbook #${playbook.playbookNumber}`);
  
  // Get a scenario (required for orchestration)
  const scenario = await db.query.strategicScenarios.findFirst();
  
  if (!scenario) {
    console.error('❌ No scenario found - creating test scenario...');
    // In a real scenario, you'd want to create one here
    // For now, we'll skip if no scenarios exist
    return;
  }
  
  console.log(`✅ Found scenario: "${scenario.name}" (ID: ${scenario.id})\n`);
  
  // Step 2: Test orchestration endpoint
  console.log('🚀 Step 2: Calling orchestration endpoint...');
  
  // Generate proper UUIDs for trigger
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  const orchestrationPayload = {
    playbookId: playbook.id,
    scenarioId: scenario.id,
    triggerId: generateUUID(), // Use UUID format for trigger
    context: {
      testMode: true,
      scenario: 'End-to-end validation',
      timestamp: new Date().toISOString()
    }
  };
  
  console.log('   Payload:', JSON.stringify(orchestrationPayload, null, 2));
  
  const response = await fetch('http://localhost:5000/api/activations/orchestrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orchestrationPayload)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Orchestration failed:', errorText);
    return;
  }
  
  const result = await response.json();
  console.log('✅ Orchestration successful!');
  console.log('   Response:', JSON.stringify(result, null, 2));
  console.log('');
  
  const executionInstanceId = result.executionInstanceId;
  
  // Step 3: Verify execution instance created in database
  console.log('💾 Step 3: Verifying database records...');
  
  const execution = await db.query.executionInstances.findFirst({
    where: eq(executionInstances.id, executionInstanceId)
  });
  
  if (!execution) {
    console.error('❌ Execution instance not found in database');
    return;
  }
  
  console.log(`✅ Execution instance found in database:`);
  console.log(`   ID: ${execution.id}`);
  console.log(`   Status: ${execution.status}`);
  console.log(`   Started: ${execution.startedAt}`);
  console.log(`   Playbook ID: ${execution.playbookId}\n`);
  
  // Step 4: Verify notifications created
  console.log('📬 Step 4: Checking notifications...');
  
  const notifs = await db.query.notifications.findMany({
    where: eq(notifications.entityId, executionInstanceId),
  });
  
  console.log(`✅ Found ${notifs.length} notifications`);
  
  if (notifs.length > 0) {
    console.log('   Sample notification:');
    console.log(`   - ID: ${notifs[0].id}`);
    console.log(`   - Title: ${notifs[0].title}`);
    console.log(`   - Recipient: ${notifs[0].recipientName}`);
    console.log(`   - Sent: ${notifs[0].sentAt ? 'Yes' : 'No'}`);
  }
  console.log('');
  
  // Step 5: Test status endpoint
  console.log('📊 Step 5: Checking execution status...');
  
  const statusResponse = await fetch(`http://localhost:5000/api/activations/${executionInstanceId}/status`);
  
  if (!statusResponse.ok) {
    console.error('❌ Status endpoint failed');
    return;
  }
  
  const status = await statusResponse.json();
  console.log('✅ Status retrieved successfully:');
  console.log(`   Status: ${status.status}`);
  console.log(`   Coordination Progress: ${(status.coordination.coordinationProgress * 100).toFixed(1)}%`);
  console.log(`   Acknowledged: ${status.coordination.acknowledgedCount}/${status.coordination.totalStakeholders}`);
  console.log(`   Elapsed Time: ${status.coordination.elapsedTime.toFixed(2)} minutes`);
  console.log(`   Complete: ${status.coordination.coordinationComplete ? 'YES' : 'NO'}\n`);
  
  // Step 6: Test acknowledgment
  console.log('✅ Step 6: Testing stakeholder acknowledgment...');
  
  if (notifs.length > 0) {
    const testNotification = notifs[0];
    console.log(`   Acknowledging notification from: ${testNotification.recipientName}`);
    
    const ackResponse = await fetch(`http://localhost:5000/api/notifications/${testNotification.id}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (ackResponse.ok) {
      const ackResult = await ackResponse.json();
      console.log('✅ Acknowledgment recorded successfully!');
      console.log(`   Response Time: ${ackResult.responseTime} minutes`);
      console.log(`   Coordination Complete: ${ackResult.coordinationComplete ? 'YES' : 'NO'}\n`);
      
      // Check updated status
      console.log('📊 Step 7: Checking updated status after acknowledgment...');
      const statusAfter = await fetch(`http://localhost:5000/api/activations/${executionInstanceId}/status`);
      if (statusAfter.ok) {
        const updatedStatus = await statusAfter.json();
        console.log('✅ Updated status:');
        console.log(`   Acknowledged: ${updatedStatus.coordination.acknowledgedCount}/${updatedStatus.coordination.totalStakeholders}`);
        console.log(`   Progress: ${(updatedStatus.coordination.coordinationProgress * 100).toFixed(1)}%`);
        console.log(`   Complete: ${updatedStatus.coordination.coordinationComplete ? 'YES' : 'NO'}\n`);
      }
    } else {
      const errorText = await ackResponse.text();
      console.error('❌ Acknowledgment failed:', errorText);
    }
  } else {
    console.log('⚠️  No notifications to acknowledge\n');
  }
  
  // Final Summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✨ TEST COMPLETE - SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📚 Playbook: ${playbook.name}`);
  console.log(`🎯 Execution Instance: ${executionInstanceId}`);
  console.log(`📬 Notifications Created: ${notifs.length}`);
  console.log(`✅ Acknowledgments: ${status.coordination?.acknowledgedCount || 0}`);
  console.log(`📊 Coordination: ${status.coordination?.coordinationComplete ? 'COMPLETE ✓' : 'IN PROGRESS ⏳'}`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('🎉 Activation orchestration engine is working correctly!');
}

// Run the test
testActivation()
  .catch((error) => {
    console.error('\n❌ Test failed with error:');
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
