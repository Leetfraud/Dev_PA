import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
};

async function testEndpoint(name, url, method = 'GET') {
  try {
    const start = Date.now();
    const response = await axios({ method, url: `${API_BASE}${url}` });
    const duration = Date.now() - start;
    
    log.success(`${name} - ${duration}ms`);
    return response.data;
  } catch (error) {
    log.error(`${name} - ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('\n🧪 Testing DevProfile Analyzer API\n');

  log.info('Testing health endpoint...');
  await testEndpoint('Health Check', '/health');

  log.info('\nTesting profile endpoint...');
  const profile = await testEndpoint('Get Profile (torvalds)', '/api/profile/torvalds');
  
  if (profile?.success) {
    console.log(`   Score: ${profile.data.analytics.portfolio_score}/100`);
    console.log(`   Stars: ${profile.data.analytics.total_stars}`);
    console.log(`   Cached: ${profile.cached}`);
  }

  log.info('\nTesting cached profile...');
  await testEndpoint('Get Profile (cached)', '/api/profile/torvalds');

  log.info('\nTesting comparison...');
  await testEndpoint('Compare Profiles', '/api/compare?usernameA=torvalds&usernameB=gvanrossum');

  log.info('\nTesting suggestions...');
  const suggestions = await testEndpoint('Get Suggestions', '/api/suggestions/torvalds');
  
  if (suggestions?.success) {
    console.log(`   Suggestions: ${suggestions.data.suggestions.length}`);
    console.log(`   Potential Score: ${suggestions.data.potential_score}/100`);
  }

  log.info('\nTesting history...');
  await testEndpoint('Search History', '/api/history?limit=5');

  log.info('\nTesting rate limit...');
  const rateLimit = await testEndpoint('Rate Limit Status', '/api/rate-limit');
  
  if (rateLimit?.success) {
    console.log(`   Remaining: ${rateLimit.data.remaining} requests`);
  }

  console.log('\n✅ All tests completed!\n');
}

runTests().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  process.exit(1);
});
