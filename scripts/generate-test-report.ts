/**
 * Generate Test Report
 * Runs all tests and generates a comprehensive report
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

interface TestSuite {
  name: string;
  command: string;
  description: string;
}

const testSuites: TestSuite[] = [
  {
    name: 'Environment Validation',
    command: 'pnpm tsx scripts/test-env-validation.ts',
    description: 'Validates environment variables and configuration',
  },
  {
    name: 'Integration Tests',
    command: 'pnpm tsx scripts/test-integration.ts',
    description: 'Tests database, health checks, and system integration',
  },
  {
    name: 'API Endpoint Tests',
    command: 'pnpm tsx scripts/test-api-endpoints.ts',
    description: 'Tests API endpoints and error handling',
  },
  {
    name: 'Rate Limit Verification',
    command: 'pnpm tsx scripts/verify-rate-limit-headers.ts',
    description: 'Verifies rate limiting implementation',
  },
  {
    name: 'Grok API Connection',
    command: 'pnpm tsx scripts/test-grok-connection.ts',
    description: 'Tests Grok API connectivity and functionality',
  },
];

interface TestResult {
  suite: string;
  passed: boolean;
  output: string;
  duration: number;
  error?: string;
}

const results: TestResult[] = [];

function runTest(suite: TestSuite): TestResult {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Running: ${suite.name}`);
  console.log(`${'='.repeat(60)}\n`);

  const startTime = Date.now();

  try {
    const output = execSync(suite.command, {
      encoding: 'utf-8',
      stdio: 'pipe',
      timeout: 60000, // 60 second timeout
    });

    const duration = Date.now() - startTime;

    return {
      suite: suite.name,
      passed: true,
      output,
      duration,
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;

    return {
      suite: suite.name,
      passed: false,
      output: error.stdout || '',
      duration,
      error: error.stderr || error.message,
    };
  }
}

function generateMarkdownReport(): string {
  const timestamp = new Date().toISOString();
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;
  const successRate = ((passed / total) * 100).toFixed(1);

  let report = `# Integration Test Report\n\n`;
  report += `**Generated:** ${timestamp}\n\n`;
  report += `## Summary\n\n`;
  report += `- **Total Test Suites:** ${total}\n`;
  report += `- **Passed:** ${passed} ✅\n`;
  report += `- **Failed:** ${failed} ❌\n`;
  report += `- **Success Rate:** ${successRate}%\n\n`;

  report += `## Test Results\n\n`;

  results.forEach((result, index) => {
    const icon = result.passed ? '✅' : '❌';
    const status = result.passed ? 'PASSED' : 'FAILED';

    report += `### ${index + 1}. ${result.suite} ${icon}\n\n`;
    report += `**Status:** ${status}\n`;
    report += `**Duration:** ${result.duration}ms\n\n`;

    if (result.passed) {
      report += `<details>\n<summary>View Output</summary>\n\n\`\`\`\n${result.output}\n\`\`\`\n\n</details>\n\n`;
    } else {
      report += `**Error:**\n\`\`\`\n${result.error || 'Unknown error'}\n\`\`\`\n\n`;
      if (result.output) {
        report += `**Output:**\n\`\`\`\n${result.output}\n\`\`\`\n\n`;
      }
    }
  });

  report += `## Recommendations\n\n`;

  if (failed > 0) {
    report += `### Issues Found\n\n`;
    results
      .filter((r) => !r.passed)
      .forEach((result) => {
        report += `- **${result.suite}:** Review the error output above and fix the issues.\n`;
      });
    report += `\n`;
  }

  report += `### Next Steps\n\n`;
  report += `1. Review failed tests and fix issues\n`;
  report += `2. Ensure all environment variables are properly configured\n`;
  report += `3. Verify Grok API key is valid (should start with 'xai-')\n`;
  report += `4. Run tests again after fixes\n`;
  report += `5. Deploy to staging for further testing\n\n`;

  report += `## Checklist\n\n`;
  report += `- [ ] All environment variables configured\n`;
  report += `- [ ] Database connection working\n`;
  report += `- [ ] Grok API integration functional\n`;
  report += `- [ ] Rate limiting implemented\n`;
  report += `- [ ] Health checks responding\n`;
  report += `- [ ] Error handling comprehensive\n`;
  report += `- [ ] Material processing flow working\n`;
  report += `- [ ] AI chat flow functional\n`;
  report += `- [ ] All tests passing\n\n`;

  return report;
}

async function main() {
  console.log('🚀 Starting Test Suite Execution...\n');

  // Run each test suite
  for (const suite of testSuites) {
    const result = runTest(suite);
    results.push(result);

    if (result.passed) {
      console.log(`✅ ${suite.name} PASSED (${result.duration}ms)\n`);
    } else {
      console.log(`❌ ${suite.name} FAILED (${result.duration}ms)\n`);
    }
  }

  // Generate report
  console.log('\n📝 Generating test report...\n');
  const report = generateMarkdownReport();

  // Save report
  const reportPath = 'docs/TEST_REPORT.md';
  writeFileSync(reportPath, report);

  console.log(`✅ Test report saved to: ${reportPath}\n`);

  // Print summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  console.log('═══════════════════════════════════════════════════════');
  console.log('FINAL SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total: ${total}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  console.log('═══════════════════════════════════════════════════════\n');

  if (failed > 0) {
    console.log('⚠️  Some tests failed. Review the report for details.');
    process.exit(1);
  } else {
    console.log('🎉 All tests passed! System is production ready.');
    process.exit(0);
  }
}

main();
