const https = require('https');
const fs = require('fs');

// Self-signed certificate for testing
const options = {
  key: fs.readFileSync('/etc/ssl/private/health-check.key'),
  cert: fs.readFileSync('/etc/ssl/certs/health-check.crt')
};

const server = https.createServer(options, (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      instance: process.env.INSTANCE_ID || 'unknown'
    }));
    return;
  }

  res.writeHead(404);
  res.end();
});

const PORT = 443;
server.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
}); 