/**
 * Integration Test Script
 * Tests all critical flows for production readiness
 */

import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration?: number;
}

const results: TestResult[] = [];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function addResult(name: string, passed: boolean, message: string, duration?: number) {
  results.push({ name, passed, message, duration });
  const icon = passed ? '✓' : '✗';
  const color = passed ? colors.green : colors.red;
  const durationStr = duration ? ` (${duration}ms)` : '';
  log(`${icon} ${name}: ${message}${durationStr}`, color);
}

async function testEnvironmentVariables() {
  log('\n=== Testing Environment Variables ===', colors.cyan);
  const startTime = Date.now();
  
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'GROK_API_KEY',
    'GROK_API_BASE_URL',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'NODE_ENV',
  ];

  const missing: string[] = [];
  const present: string[] = [];

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  }

  const duration = Date.now() - startTime;

  if (missing.length === 0) {
    addResult(
      'Environment Variables',
      true,
      `All ${requiredVars.length} required variables present`,
      duration
    );
  } else {
    addResult(
      'Environment Variables',
      false,
      `Missing: ${missing.join(', ')}`,
      duration
    );
  }

  // Check Grok API key format
  const grokKey = process.env.GROK_API_KEY;
  if (grokKey && grokKey.startsWith('gsk_')) {
    addResult('Grok API Key Format', true, 'Valid format (starts with gsk_)');
  } else if (grokKey) {
    addResult('Grok API Key Format', false, 'Invalid format (should start with gsk_)');
  }
}

async function testDatabaseConnection() {
  log('\n=== Testing Database Connection ===', colors.cyan);
  const startTime = Date.now();

  try {
    await prisma.$connect();
    const duration = Date.now() - startTime;
    addResult('Database Connection', true, 'Successfully connected to database', duration);

    // Test a simple query
    const queryStart = Date.now();
    const userCount = await prisma.user.count();
    const queryDuration = Date.now() - queryStart;
    addResult('Database Query', true, `Found ${userCount} users`, queryDuration);
  } catch (error) {
    const duration = Date.now() - startTime;
    addResult(
      'Database Connection',
      false,
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration
    );
  }
}

async function testHealthCheckEndpoint() {
  log('\n=== Testing Health Check Endpoint ===', colors.cyan);
  const startTime = Date.now();

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
    });

    const duration = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json();
      addResult('Health Check Endpoint', true, `Status: ${data.status}`, duration);

      // Check individual services
      if (data.services) {
        Object.entries(data.services).forEach(([service, health]: [string, any]) => {
          addResult(
            `Health Check - ${service}`,
            health.status === 'up',
            `Status: ${health.status}${health.responseTime ? ` (${health.responseTime}ms)` : ''}`
          );
        });
      }
    } else {
      addResult('Health Check Endpoint', false, `HTTP ${response.status}`, duration);
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    addResult(
      'Health Check Endpoint',
      false,
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration
    );
  }
}

async function testGrokAPIConnection() {
  log('\n=== Testing Groq API Connection ===', colors.cyan);
  const startTime = Date.now();

  try {
    const apiKey = process.env.GROK_API_KEY;
    const baseUrl = process.env.GROK_API_BASE_URL || 'https://api.groq.com/openai/v1';

    if (!apiKey) {
      addResult('Groq API Connection', false, 'GROK_API_KEY not set');
      return;
    }

    // Test chat completions endpoint (Groq doesn't support embeddings directly)
    const chatResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: 'Say "test successful" if you can read this.' }],
        max_tokens: 10,
      }),
    });

    const duration = Date.now() - startTime;

    if (chatResponse.ok) {
      addResult('Groq API - Chat', true, 'Successfully generated test response', duration);
    } else {
      const errorText = await chatResponse.text();
      addResult(
        'Groq API - Chat',
        false,
        `HTTP ${chatResponse.status}: ${errorText.substring(0, 100)}`,
        duration
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    addResult(
      'Groq API Connection',
      false,
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration
    );
  }
}

async function testRateLimiting() {
  log('\n=== Testing Rate Limiting ===', colors.cyan);

  try {
    // Check if RateLimit table exists
    const rateLimitCount = await prisma.rateLimit.count();
    addResult('Rate Limit Table', true, `Found ${rateLimitCount} rate limit records`);

    // Test rate limit cleanup (old records)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const expiredCount = await prisma.rateLimit.count({
      where: {
        resetAt: {
          lt: oneHourAgo,
        },
      },
    });

    addResult(
      'Rate Limit Cleanup',
      true,
      `Found ${expiredCount} expired rate limit records that can be cleaned`
    );
  } catch (error) {
    addResult(
      'Rate Limiting',
      false,
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

async function testProcessingQueue() {
  log('\n=== Testing Processing Queue ===', colors.cyan);

  try {
    // Check if ProcessingQueue table exists
    const queueCount = await prisma.processingQueue.count();
    addResult('Processing Queue Table', true, `Found ${queueCount} queue items`);

    // Check for pending jobs
    const pendingCount = await prisma.processingQueue.count({
      where: { status: 'pending' },
    });

    addResult('Pending Queue Jobs', true, `${pendingCount} jobs pending processing`);

    // Check for failed jobs
    const failedCount = await prisma.processingQueue.count({
      where: { status: 'failed' },
    });

    if (failedCount > 0) {
      addResult(
        'Failed Queue Jobs',
        false,
        `${failedCount} jobs failed - may need attention`
      );
    } else {
      addResult('Failed Queue Jobs', true, 'No failed jobs');
    }
  } catch (error) {
    addResult(
      'Processing Queue',
      false,
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

async function testMaterialProcessingFlow() {
  log('\n=== Testing Material Processing Flow ===', colors.cyan);

  try {
    // Check materials table
    const materialCount = await prisma.material.count();
    addResult('Materials Table', true, `Found ${materialCount} materials`);

    // Check processing status distribution
    const statusCounts = await prisma.material.groupBy({
      by: ['processingStatus'],
      _count: true,
    });

    statusCounts.forEach((status) => {
      addResult(
        `Materials - ${status.processingStatus}`,
        true,
        `${status._count} materials`
      );
    });

    // Check material chunks
    const chunkCount = await prisma.materialChunk.count();
    addResult('Material Chunks', true, `Found ${chunkCount} chunks`);

    // Check for materials with chunks
    const materialsWithChunks = await prisma.material.count({
      where: {
        chunksCount: {
          gt: 0,
        },
      },
    });

    addResult(
      'Processed Materials',
      true,
      `${materialsWithChunks} materials have been processed with chunks`
    );
  } catch (error) {
    addResult(
      'Material Processing Flow',
      false,
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

async function testAIChatFlow() {
  log('\n=== Testing AI Chat Flow ===', colors.cyan);

  try {
    // Check chat sessions table
    const sessionCount = await prisma.chatSession.count();
    addResult('Chat Sessions Table', true, `Found ${sessionCount} chat sessions`);

    // Check chat messages table
    const messageCount = await prisma.chatMessage.count();
    addResult('Chat Messages Table', true, `Found ${messageCount} chat messages`);

    // Check for recent chats
    const recentSessions = await prisma.chatSession.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    addResult('Recent Chat Sessions', true, `${recentSessions} sessions in last 24 hours`);

    // Check AI assistant chats (legacy table)
    const aiChatCount = await prisma.aIAssistantChat.count();
    addResult('AI Assistant Chats', true, `Found ${aiChatCount} legacy AI chats`);
  } catch (error) {
    addResult(
      'AI Chat Flow',
      false,
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

async function testErrorHandling() {
  log('\n=== Testing Error Handling ===', colors.cyan);

  try {
    // Check activity logs for errors
    const errorLogs = await prisma.activityLog.count({
      where: {
        error: {
          not: null,
        },
      },
    });

    addResult('Error Logging', true, `Found ${errorLogs} error logs`);

    // Check recent errors
    const recentErrors = await prisma.activityLog.count({
      where: {
        error: {
          not: null,
        },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (recentErrors > 10) {
      addResult(
        'Recent Errors',
        false,
        `${recentErrors} errors in last 24 hours - may indicate issues`
      );
    } else {
      addResult('Recent Errors', true, `${recentErrors} errors in last 24 hours`);
    }
  } catch (error) {
    addResult(
      'Error Handling',
      false,
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

async function testSystemSettings() {
  log('\n=== Testing System Settings ===', colors.cyan);

  try {
    const settings = await prisma.systemSettings.findFirst();

    if (settings) {
      addResult('System Settings', true, 'System settings configured');
      addResult(
        'Maintenance Mode',
        !settings.maintenanceMode,
        settings.maintenanceMode ? 'ENABLED - System in maintenance' : 'Disabled'
      );
    } else {
      addResult('System Settings', false, 'No system settings found - run init script');
    }
  } catch (error) {
    addResult(
      'System Settings',
      false,
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

async function printSummary() {
  log('\n' + '='.repeat(60), colors.blue);
  log('TEST SUMMARY', colors.blue);
  log('='.repeat(60), colors.blue);

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  log(`\nTotal Tests: ${total}`);
  log(`Passed: ${passed}`, colors.green);
  log(`Failed: ${failed}`, failed > 0 ? colors.red : colors.green);
  log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

  if (failed > 0) {
    log('Failed Tests:', colors.red);
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        log(`  ✗ ${r.name}: ${r.message}`, colors.red);
      });
  }

  log('\n' + '='.repeat(60), colors.blue);
}

async function main() {
  log('Starting Integration Tests...', colors.cyan);
  log('='.repeat(60), colors.blue);

  try {
    await testEnvironmentVariables();
    await testDatabaseConnection();
    await testHealthCheckEndpoint();
    await testGrokAPIConnection();
    await testRateLimiting();
    await testProcessingQueue();
    await testMaterialProcessingFlow();
    await testAIChatFlow();
    await testErrorHandling();
    await testSystemSettings();

    await printSummary();

    const failedCount = results.filter((r) => !r.passed).length;
    process.exit(failedCount > 0 ? 1 : 0);
  } catch (error) {
    log(`\nFatal error: ${error instanceof Error ? error.message : 'Unknown error'}`, colors.red);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
