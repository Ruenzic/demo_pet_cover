const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');

const PORT = 5000;

// 1. Initial sync on startup (blocking to ensure docs are ready)
console.log('Initial documentation sync...');
try {
  execSync('node ' + path.join(__dirname, 'sync-docs.js'), { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
} catch (e) {
  console.log('Initial doc sync failed, using cached docs');
}

// 2. Background sync every hour (non-blocking)
setInterval(() => {
  console.log('[Background] Checking for documentation updates...');
  exec('node ' + path.join(__dirname, 'sync-docs.js'), { 
    cwd: path.join(__dirname, '..')
  }, (error, stdout) => {
    if (error) {
      console.log('[Background] Doc sync check failed');
      return;
    }
    if (stdout && stdout.includes('Updating')) {
      console.log('[Background] Documentation updated!');
      console.log(stdout);
    }
  });
}, 60 * 60 * 1000);

const server = http.createServer((req, res) => {
    let filePath;
    
    if (req.url === '/embed') {
        filePath = path.join(__dirname, 'embed.html');
    } else if (req.url === '/dashboard') {
        filePath = path.join(__dirname, 'dashboard.html');
    } else {
        filePath = path.join(__dirname, 'index.html');
    }
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading page');
            return;
        }
        
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(content);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Development hub running at http://0.0.0.0:${PORT}`);
    console.log(`Embed preview available at http://0.0.0.0:${PORT}/embed`);
});