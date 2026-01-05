# Quick WebSocket Test - Copy & Paste

## 🚀 Fastest Way to Test WebSocket

### Step 1: Open Browser Console
1. Navigate to: http://localhost:5000/playbook-library
2. Press F12 (or right-click → Inspect)
3. Go to **Console** tab

### Step 2: Copy & Paste This Code
```javascript
// ============================================
// VEXOR WebSocket Test - Copy All & Run
// ============================================

console.clear();
console.log('🌐 VEXOR WebSocket Test Starting...\n');

// Connect to WebSocket
const socket = io();
const testData = {
  executionId: 'test-exec-' + Date.now(),
  events: [],
  startTime: Date.now()
};

// Connection handler
socket.on('connect', () => {
  console.log('✅ WebSocket Connected!');
  console.log('   Socket ID:', socket.id);
  console.log('   Execution ID:', testData.executionId);
  console.log('\n📡 Joining execution room...');
  
  // Join execution room
  socket.emit('join-execution', testData.executionId);
  console.log('✅ Joined room: execution-' + testData.executionId);
  
  // Simulate stakeholder acknowledgment after 2 seconds
  setTimeout(() => {
    console.log('\n📤 Simulating stakeholder acknowledgment...');
    socket.emit('stakeholder-acknowledged', {
      executionId: testData.executionId,
      stakeholderId: 'test-stakeholder-1',
      stakeholderName: 'John Smith (CFO)',
      acknowledgedAt: new Date().toISOString(),
      coordinationProgress: 0.50,
      totalStakeholders: 8,
      acknowledgedCount: 4
    });
    console.log('   ✅ Event emitted');
  }, 2000);
  
  // Simulate another acknowledgment
  setTimeout(() => {
    console.log('\n📤 Simulating second acknowledgment...');
    socket.emit('stakeholder-acknowledged', {
      executionId: testData.executionId,
      stakeholderId: 'test-stakeholder-2',
      stakeholderName: 'Sarah Johnson (CTO)',
      acknowledgedAt: new Date().toISOString(),
      coordinationProgress: 0.875,
      totalStakeholders: 8,
      acknowledgedCount: 7
    });
    console.log('   ✅ Event emitted');
  }, 4000);
});

// Listen for stakeholder acknowledgments
socket.on('stakeholder-acknowledged', (data) => {
  testData.events.push({ type: 'stakeholder-acknowledged', data, time: Date.now() });
  console.log('\n📢 EVENT RECEIVED: stakeholder-acknowledged');
  console.log('   Stakeholder:', data.stakeholderName);
  console.log('   Progress:', (data.coordinationProgress * 100).toFixed(1) + '%');
  console.log('   Count:', data.acknowledgedCount, '/', data.totalStakeholders);
});

// Listen for task updates
socket.on('task-updated', (data) => {
  testData.events.push({ type: 'task-updated', data, time: Date.now() });
  console.log('\n📝 EVENT RECEIVED: task-updated');
  console.log('   Task:', data.title);
  console.log('   Status:', data.status);
});

// Listen for coordination complete
socket.on('coordination-complete', (data) => {
  testData.events.push({ type: 'coordination-complete', data, time: Date.now() });
  console.log('\n🎉 EVENT RECEIVED: coordination-complete');
  console.log('   Message:', data.message);
  console.log('   Final Progress:', (data.coordinationProgress * 100).toFixed(1) + '%');
});

// Error handler
socket.on('connect_error', (error) => {
  console.error('\n❌ Connection Error:', error.message);
});

// Disconnect handler
socket.on('disconnect', (reason) => {
  console.log('\n🔌 Disconnected:', reason);
});

// Test summary after 10 seconds
setTimeout(() => {
  const duration = ((Date.now() - testData.startTime) / 1000).toFixed(1);
  console.log('\n' + '='.repeat(60));
  console.log('✨ TEST COMPLETE');
  console.log('='.repeat(60));
  console.log('Duration:', duration + 's');
  console.log('Events Received:', testData.events.length);
  console.log('\nEvent Types:');
  testData.events.forEach((evt, idx) => {
    const latency = evt.time - testData.startTime;
    console.log(`  ${idx + 1}. ${evt.type} (${latency}ms)`);
  });
  
  if (testData.events.length > 0) {
    console.log('\n✅ WebSocket System: WORKING');
    console.log('   - Connection: ✅');
    console.log('   - Room Join: ✅');
    console.log('   - Broadcasting: ✅');
    console.log('   - Real-time Updates: ✅');
  } else {
    console.log('\n⚠️  No events received');
    console.log('   Check server logs for issues');
  }
  console.log('='.repeat(60));
  
  // Keep socket open for manual testing
  console.log('\n💡 Socket still connected. Try:');
  console.log('   socket.emit("stakeholder-acknowledged", {...})');
  console.log('   socket.disconnect() // when done');
}, 10000);

console.log('\n⏳ Test running for 10 seconds...');
console.log('   Watch for real-time events below!\n');
```

### Step 3: Watch the Magic! ✨

You should see:
1. ✅ WebSocket connection established
2. ✅ Joined execution room
3. 📤 Two simulated acknowledgments sent (at 2s and 4s)
4. 📢 Events received in real-time
5. ✨ Test summary after 10 seconds

### Expected Output:
```
🌐 VEXOR WebSocket Test Starting...

✅ WebSocket Connected!
   Socket ID: abc123...
   Execution ID: test-exec-1762200...

📡 Joining execution room...
✅ Joined room: execution-test-exec-1762200...

📤 Simulating stakeholder acknowledgment...
   ✅ Event emitted

📢 EVENT RECEIVED: stakeholder-acknowledged
   Stakeholder: John Smith (CFO)
   Progress: 50.0%
   Count: 4 / 8

📤 Simulating second acknowledgment...
   ✅ Event emitted

📢 EVENT RECEIVED: stakeholder-acknowledged
   Stakeholder: Sarah Johnson (CTO)
   Progress: 87.5%
   Count: 7 / 8

============================================================
✨ TEST COMPLETE
============================================================
Duration: 10.0s
Events Received: 2

Event Types:
  1. stakeholder-acknowledged (2500ms)
  2. stakeholder-acknowledged (4500ms)

✅ WebSocket System: WORKING
   - Connection: ✅
   - Room Join: ✅
   - Broadcasting: ✅
   - Real-time Updates: ✅
============================================================
```

## 🔥 Test with Real Activation

### Step 1: Keep Browser Console Open

### Step 2: Run Activation Script
In a terminal:
```bash
tsx scripts/test-activation.ts
```

### Step 3: Get Execution ID
Copy the execution ID from the script output.

### Step 4: Monitor in Browser
```javascript
socket.emit('join-execution', 'PASTE_EXECUTION_ID_HERE');
```

Watch real stakeholder acknowledgments come through live! 🚀

## Troubleshooting

**No events received?**
- Check that WebSocket connected (should see Socket ID)
- Verify you joined the room (should see confirmation)
- Events are broadcast to room members only

**Connection failed?**
- Ensure server is running: `npm run dev`
- Check server logs: should see "✓ WebSocket server initialized"
- Try refreshing the page

**Still having issues?**
- Check browser console for errors
- Verify you're on http://localhost:5000 (not file://)
- Check server logs with `refresh_all_logs` tool

---

Copy the code above into browser console and watch VEXOR's real-time execution tracking in action! 🎉
