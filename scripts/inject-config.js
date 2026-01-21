#!/usr/bin/env node

/**
 * Configuration Injection Script
 *
 * Injects Azure configuration into built static HTML files
 * This allows the same build to be deployed to OneDrive with different credentials
 *
 * Usage:
 *   node inject-config.js <CLIENT_ID> <TENANT_ID> <FUNCTION_URL>
 *
 * Or set environment variables:
 *   AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_FUNCTION_URL
 *
 * Example:
 *   node inject-config.js \
 *     "a1b2c3d4-e5f6-7890-abcd-1234567890ab" \
 *     "12345678-90ab-cdef-1234-567890abcdef" \
 *     "https://hotel-vog-functions.azurewebsites.net"
 */

const fs = require('fs');
const path = require('path');

// Read configuration from environment variables or command line arguments
const CLIENT_ID = process.env.AZURE_CLIENT_ID || process.argv[2];
const TENANT_ID = process.env.AZURE_TENANT_ID || process.argv[3];
const FUNCTION_URL = process.env.AZURE_FUNCTION_URL || process.argv[4];

// Validate inputs
if (!CLIENT_ID || !TENANT_ID || !FUNCTION_URL) {
  console.error('❌ Error: Missing required configuration');
  console.error('');
  console.error('Usage:');
  console.error('  node inject-config.js <CLIENT_ID> <TENANT_ID> <FUNCTION_URL>');
  console.error('');
  console.error('Or set environment variables:');
  console.error('  export AZURE_CLIENT_ID="your-client-id"');
  console.error('  export AZURE_TENANT_ID="your-tenant-id"');
  console.error('  export AZURE_FUNCTION_URL="https://your-function-url"');
  console.error('  node inject-config.js');
  console.error('');
  process.exit(1);
}

// Validate GUID format (basic check)
const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

if (!guidRegex.test(CLIENT_ID)) {
  console.error('❌ Error: CLIENT_ID does not appear to be a valid GUID');
  console.error(`   Received: ${CLIENT_ID}`);
  process.exit(1);
}

if (!guidRegex.test(TENANT_ID)) {
  console.error('❌ Error: TENANT_ID does not appear to be a valid GUID');
  console.error(`   Received: ${TENANT_ID}`);
  process.exit(1);
}

// Validate URL format
if (!FUNCTION_URL.startsWith('http://') && !FUNCTION_URL.startsWith('https://')) {
  console.error('❌ Error: FUNCTION_URL must start with http:// or https://');
  console.error(`   Received: ${FUNCTION_URL}`);
  process.exit(1);
}

// Locate the built index.html file
const htmlPath = path.join(__dirname, '../dist/index.html');

if (!fs.existsSync(htmlPath)) {
  console.error('❌ Error: dist/index.html not found');
  console.error('   Please run "npm run build" first');
  console.error(`   Looking for: ${htmlPath}`);
  process.exit(1);
}

// Read the HTML file
let html = fs.readFileSync(htmlPath, 'utf8');

// Check if config is already injected
if (html.includes('window.AZURE_CONFIG')) {
  console.warn('⚠️  Warning: Configuration already exists in index.html');
  console.warn('   It will be replaced with new values');

  // Remove existing config
  html = html.replace(
    /<script>\s*window\.AZURE_CONFIG\s*=\s*\{[^}]+\};\s*<\/script>/g,
    ''
  );
}

// Create the configuration script
const configScript = `
<script>
  window.AZURE_CONFIG = {
    clientId: '${CLIENT_ID}',
    tenantId: '${TENANT_ID}',
    functionUrl: '${FUNCTION_URL}'
  };
</script>`;

// Inject before closing </head> tag
html = html.replace('</head>', `${configScript}\n  </head>`);

// Write the updated HTML back to disk
fs.writeFileSync(htmlPath, html, 'utf8');

// Success message
console.log('✅ Configuration injected successfully!');
console.log('');
console.log('📋 Injected Configuration:');
console.log(`   Client ID:    ${CLIENT_ID}`);
console.log(`   Tenant ID:    ${TENANT_ID}`);
console.log(`   Function URL: ${FUNCTION_URL}`);
console.log('');
console.log('📁 Updated file: dist/index.html');
console.log('');
console.log('✨ Next steps:');
console.log('   1. Upload dist/ folder contents to OneDrive');
console.log('   2. Share the folder with hotel GMs');
console.log('   3. They can open index.html in their browser');
console.log('');

// Optional: Create a deployment info file
const deploymentInfo = {
  timestamp: new Date().toISOString(),
  clientId: CLIENT_ID,
  tenantId: TENANT_ID,
  functionUrl: FUNCTION_URL,
  deployedBy: process.env.USER || process.env.USERNAME || 'unknown'
};

const infoPath = path.join(__dirname, '../dist/deployment-info.json');
fs.writeFileSync(infoPath, JSON.stringify(deploymentInfo, null, 2), 'utf8');

console.log('📝 Deployment info saved to: dist/deployment-info.json');
console.log('');
