// sync-docs.js - Fetches latest documentation from Root Platform API
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://sandbox.rootplatform.com';
const MANIFEST_PATH = '.docs-manifest.json';
const DOCS_DIR = 'docs';

const httpGet = (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', reject);
  });
};

const syncDocs = async () => {
  try {
    console.log('Syncing documentation from Root Platform...');
    
    // 1. Fetch remote manifest
    const manifestUrl = `${API_BASE}/v1/insurance/docs/ai-context/manifest`;
    console.log(`Fetching manifest from: ${manifestUrl}`);
    const manifestData = await httpGet(manifestUrl);
    const remoteManifest = JSON.parse(manifestData);
    
    // 2. Load local manifest if it exists
    let localManifest = null;
    try {
      const localData = fs.readFileSync(MANIFEST_PATH, 'utf-8');
      localManifest = JSON.parse(localData);
    } catch (err) {
      console.log('No local manifest found, will download all sections');
    }
    
    // 3. Determine which sections need updating
    const sectionsToUpdate = [];
    for (const [sectionKey, sectionInfo] of Object.entries(remoteManifest.sections)) {
      const filePath = path.join(DOCS_DIR, `${sectionKey}.md`);
      const fileExists = fs.existsSync(filePath);
      const hashMismatch = !localManifest || 
                          !localManifest.sections[sectionKey] || 
                          localManifest.sections[sectionKey].hash !== sectionInfo.hash;
      
      if (!fileExists || hashMismatch) {
        sectionsToUpdate.push(sectionKey);
      }
    }
    
    if (sectionsToUpdate.length === 0) {
      console.log('✓ All documentation is up to date!');
      return;
    }
    
    console.log(`Updating ${sectionsToUpdate.length} section(s): ${sectionsToUpdate.join(', ')}`);
    
    // 4. Download and save updated sections
    if (!fs.existsSync(DOCS_DIR)) {
      fs.mkdirSync(DOCS_DIR, { recursive: true });
    }
    
    for (const sectionKey of sectionsToUpdate) {
      const sectionUrl = `${API_BASE}/v1/insurance/docs/ai-context/${sectionKey}`;
      console.log(`  Downloading ${sectionKey}...`);
      
      try {
        const content = await httpGet(sectionUrl);
        const filePath = path.join(DOCS_DIR, `${sectionKey}.md`);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  ✓ Updated ${sectionKey}.md`);
      } catch (err) {
        console.error(`  ✗ Failed to download ${sectionKey}: ${err.message}`);
      }
    }
    
    // 5. Update local manifest
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(remoteManifest, null, 2), 'utf-8');
    console.log('\n✓ Documentation sync complete!');
    
  } catch (err) {
    console.error('Error syncing documentation:', err.message);
    console.error('Using cached documentation from initial workspace setup');
    process.exit(0); // Don't fail - just use cached docs
  }
};

syncDocs();
