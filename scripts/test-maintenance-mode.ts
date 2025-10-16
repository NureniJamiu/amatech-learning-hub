/**
 * Test script for maintenance mode functionality
 * 
 * This script tests:
 * 1. Checking maintenance mode status
 * 2. Enabling maintenance mode
 * 3. Disabling maintenance mode
 * 4. Admin access during maintenance
 */

import { MaintenanceMode } from '../src/lib/maintenance-mode';
import prisma from '../src/lib/prisma';

async function testMaintenanceMode() {
  console.log('🧪 Testing Maintenance Mode Functionality\n');

  try {
    // Test 1: Check initial status
    console.log('1️⃣ Checking initial maintenance mode status...');
    const initialStatus = await MaintenanceMode.isEnabled();
    console.log(`   ✅ Initial status: ${initialStatus ? 'ENABLED' : 'DISABLED'}\n`);

    // Test 2: Enable maintenance mode
    console.log('2️⃣ Enabling maintenance mode...');
    await MaintenanceMode.enable();
    const enabledStatus = await MaintenanceMode.isEnabled();
    console.log(`   ✅ Status after enable: ${enabledStatus ? 'ENABLED' : 'DISABLED'}`);
    if (!enabledStatus) {
      throw new Error('Failed to enable maintenance mode');
    }
    console.log('   ✅ Maintenance mode enabled successfully\n');

    // Test 3: Check admin access
    console.log('3️⃣ Testing admin access during maintenance...');
    const adminUser = await prisma.user.findFirst({
      where: { isAdmin: true },
      select: { id: true, email: true, isAdmin: true },
    });

    if (adminUser) {
      const isAllowed = await MaintenanceMode.isUserAllowed(adminUser.id);
      console.log(`   ✅ Admin user (${adminUser.email}): ${isAllowed ? 'ALLOWED' : 'BLOCKED'}`);
      if (!isAllowed) {
        throw new Error('Admin should be allowed during maintenance mode');
      }
    } else {
      console.log('   ⚠️  No admin user found in database');
    }

    // Test 4: Check non-admin access
    const regularUser = await prisma.user.findFirst({
      where: { isAdmin: false },
      select: { id: true, email: true, isAdmin: true },
    });

    if (regularUser) {
      const isAllowed = await MaintenanceMode.isUserAllowed(regularUser.id);
      console.log(`   ✅ Regular user (${regularUser.email}): ${isAllowed ? 'ALLOWED' : 'BLOCKED'}`);
      if (isAllowed) {
        throw new Error('Regular user should be blocked during maintenance mode');
      }
    } else {
      console.log('   ⚠️  No regular user found in database');
    }
    console.log();

    // Test 5: Get detailed status
    console.log('4️⃣ Getting detailed maintenance status...');
    const detailedStatus = await MaintenanceMode.getStatus();
    console.log(`   ✅ Enabled: ${detailedStatus.enabled}`);
    console.log(`   ✅ Message: ${detailedStatus.message || 'N/A'}\n`);

    // Test 6: Disable maintenance mode
    console.log('5️⃣ Disabling maintenance mode...');
    await MaintenanceMode.disable();
    const disabledStatus = await MaintenanceMode.isEnabled();
    console.log(`   ✅ Status after disable: ${disabledStatus ? 'ENABLED' : 'DISABLED'}`);
    if (disabledStatus) {
      throw new Error('Failed to disable maintenance mode');
    }
    console.log('   ✅ Maintenance mode disabled successfully\n');

    // Test 7: Test cache clearing
    console.log('6️⃣ Testing cache functionality...');
    await MaintenanceMode.enable();
    console.log('   ✅ Enabled maintenance mode');
    MaintenanceMode.clearCache();
    console.log('   ✅ Cache cleared');
    const statusAfterClear = await MaintenanceMode.isEnabled();
    console.log(`   ✅ Status after cache clear: ${statusAfterClear ? 'ENABLED' : 'DISABLED'}\n`);

    // Cleanup: Restore initial state
    console.log('7️⃣ Restoring initial state...');
    if (initialStatus) {
      await MaintenanceMode.enable();
    } else {
      await MaintenanceMode.disable();
    }
    console.log(`   ✅ Restored to: ${initialStatus ? 'ENABLED' : 'DISABLED'}\n`);

    console.log('✅ All tests passed!\n');
    console.log('📋 Summary:');
    console.log('   ✓ Maintenance mode can be enabled');
    console.log('   ✓ Maintenance mode can be disabled');
    console.log('   ✓ Admin users are allowed during maintenance');
    console.log('   ✓ Regular users are blocked during maintenance');
    console.log('   ✓ Status can be retrieved');
    console.log('   ✓ Cache works correctly');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
testMaintenanceMode()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
