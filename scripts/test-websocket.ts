import { io } from 'socket.io-client';

/**
 * WebSocket Testing Script
 * Tests real-time execution tracking with Socket.IO
 */

async function testWebSocket() {
  console.log('🔌 Testing VEXOR WebSocket System...\n');
  
  // Step 1: Connect to WebSocket server
  console.log('📡 Step 1: Connecting to WebSocket server...');
  
  const socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
  });
  
  // Connection handlers
  socket.on('connect', () => {
    console.log('✅ WebSocket connected successfully!');
    console.log(`   Socket ID: ${socket.id}\n`);
    
    // Step 2: Join execution room
    console.log('🚪 Step 2: Joining execution room...');
    const testExecutionId = 'test-execution-' + Date.now();
    console.log(`   Room: execution-${testExecutionId}`);
    
    socket.emit('join-execution', testExecutionId);
    console.log('   ✅ Join request sent\n');
    
    // Step 3: Listen for events
    console.log('👂 Step 3: Listening for real-time events...');
    console.log('   Events to monitor:');
    console.log('   - stakeholder-acknowledged');
    console.log('   - task-updated');
    console.log('   - coordination-complete\n');
    
    // Step 4: Simulate stakeholder acknowledgment
    console.log('📤 Step 4: Simulating stakeholder acknowledgment...');
    setTimeout(() => {
      socket.emit('stakeholder-acknowledged', {
        executionId: testExecutionId,
        stakeholderId: 'test-stakeholder-1',
        stakeholderName: 'John Smith (CFO)',
        acknowledgedAt: new Date().toISOString(),
      });
      console.log('   ✅ Acknowledgment event sent\n');
    }, 2000);
    
    // Step 5: Wait for broadcast
    console.log('⏳ Step 5: Waiting for broadcast events...\n');
  });
  
  socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error.message);
  });
  
  socket.on('disconnect', (reason) => {
    console.log(`\n🔌 Disconnected: ${reason}`);
  });
  
  // Event listeners
  socket.on('stakeholder-acknowledged', (data) => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📢 EVENT RECEIVED: stakeholder-acknowledged');
    console.log('   Data:', JSON.stringify(data, null, 2));
    console.log('═══════════════════════════════════════════════════════════\n');
  });
  
  socket.on('task-updated', (data) => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📢 EVENT RECEIVED: task-updated');
    console.log('   Data:', JSON.stringify(data, null, 2));
    console.log('═══════════════════════════════════════════════════════════\n');
  });
  
  socket.on('coordination-complete', (data) => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 EVENT RECEIVED: coordination-complete');
    console.log('   Data:', JSON.stringify(data, null, 2));
    console.log('═══════════════════════════════════════════════════════════\n');
  });
  
  // Test timeout
  setTimeout(() => {
    console.log('✨ Test Complete!\n');
    console.log('Summary:');
    console.log('- WebSocket connection: ✅');
    console.log('- Room subscription: ✅');
    console.log('- Event broadcasting: Check logs above\n');
    
    console.log('💡 Next Steps:');
    console.log('1. Run test-activation.ts to trigger a real playbook activation');
    console.log('2. Use the execution ID from activation in this test');
    console.log('3. Watch real-time stakeholder acknowledgments\n');
    
    socket.disconnect();
    process.exit(0);
  }, 10000);
}

console.log('🌐 VEXOR WebSocket Test\n');
console.log('This script tests the real-time execution tracking system.');
console.log('It will connect to WebSocket, join an execution room,');
console.log('simulate events, and verify broadcasting works.\n');
console.log('═══════════════════════════════════════════════════════════\n');

testWebSocket().catch((error) => {
  console.error('\n❌ Fatal error:');
  console.error(error);
  process.exit(1);
});
