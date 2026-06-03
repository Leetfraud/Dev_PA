import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';

dotenv.config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

async function checkEnvironment() {
  log.section('📋 Checking Environment Variables');

  const required = {
    'MONGODB_URI': process.env.MONGODB_URI,
    'GITHUB_TOKEN': process.env.GITHUB_TOKEN,
  };

  const optional = {
    'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
    'PORT': process.env.PORT || '5000 (default)',
    'FRONTEND_URL': process.env.FRONTEND_URL || 'http://localhost:5173 (default)',
  };

  let allGood = true;

  for (const [key, value] of Object.entries(required)) {
    if (value) {
      log.success(`${key} is set`);
    } else {
      log.error(`${key} is missing (REQUIRED)`);
      allGood = false;
    }
  }

  for (const [key, value] of Object.entries(optional)) {
    if (value && !value.includes('default')) {
      log.success(`${key} is set`);
    } else {
      log.warn(`${key} is not set (optional) - ${value}`);
    }
  }

  return allGood;
}

async function checkMongoDB() {
  log.section('🗄️  Checking MongoDB Connection');

  if (!process.env.MONGODB_URI) {
    log.error('MONGODB_URI not set, skipping connection test');
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    log.success('MongoDB connection successful');
    await mongoose.connection.close();
    return true;
  } catch (error) {
    log.error(`MongoDB connection failed: ${error.message}`);
    log.info('Make sure MongoDB is running or check your connection string');
    return false;
  }
}

async function checkGitHubToken() {
  log.section('🐙 Checking GitHub Token');

  if (!process.env.GITHUB_TOKEN) {
    log.error('GITHUB_TOKEN not set, skipping validation');
    return false;
  }

  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    log.success(`GitHub token valid - authenticated as: ${response.data.login}`);
    
    const rateLimit = await axios.get('https://api.github.com/rate_limit', {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    const remaining = rateLimit.data.rate.remaining;
    const limit = rateLimit.data.rate.limit;
    log.info(`Rate limit: ${remaining}/${limit} requests remaining`);

    return true;
  } catch (error) {
    log.error(`GitHub token validation failed: ${error.message}`);
    log.info('Get a token at: https://github.com/settings/tokens');
    return false;
  }
}

async function checkOpenAI() {
  log.section('🤖 Checking OpenAI API Key');

  if (!process.env.OPENAI_API_KEY) {
    log.warn('OPENAI_API_KEY not set - AI suggestions will use fallback mode');
    log.info('Get a key at: https://platform.openai.com/api-keys');
    return true; // Not required
  }

  try {
    const response = await axios.get('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    log.success('OpenAI API key is valid');
    return true;
  } catch (error) {
    log.error(`OpenAI API key validation failed: ${error.message}`);
    log.warn('AI suggestions will use fallback mode');
    return true; // Not critical
  }
}

async function checkNodeVersion() {
  log.section('📦 Checking Node.js Version');

  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);

  if (major >= 16) {
    log.success(`Node.js version ${version} (✓ >= 16)`);
    return true;
  } else {
    log.error(`Node.js version ${version} (✗ < 16)`);
    log.info('Please upgrade to Node.js 16 or higher');
    return false;
  }
}

async function runChecks() {
  console.log('\n🔍 DevProfile Analyzer - Setup Checker\n');

  const results = {
    node: await checkNodeVersion(),
    env: await checkEnvironment(),
    mongodb: await checkMongoDB(),
    github: await checkGitHubToken(),
    openai: await checkOpenAI(),
  };

  log.section('📊 Summary');

  const critical = results.node && results.env && results.mongodb && results.github;

  if (critical) {
    log.success('All critical checks passed! ✨');
    log.info('\nYou can now start the server with: npm run dev');
  } else {
    log.error('Some critical checks failed ❌');
    log.info('\nPlease fix the issues above before starting the server');
  }

  if (!results.openai) {
    log.warn('\nNote: OpenAI is optional - fallback suggestions will be used');
  }

  console.log('\n');
  process.exit(critical ? 0 : 1);
}

runChecks().catch(error => {
  log.error(`Setup check failed: ${error.message}`);
  process.exit(1);
});
