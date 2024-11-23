const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const url = require('url');

const app = express();

// Middleware to parse the target URL dynamically
app.use((req, res, next) => {
    const query = url.parse(req.url, true).query;

    // Set the default target to Roblox on now.gg
    req.target = query.target || 'https://now.gg/apps/roblox-corporation/5349/roblox.html';

    // Remove the target query parameter from the URL for clean forwarding
    const parsedUrl = url.parse(req.url, true);
    delete parsedUrl.query.target;
    req.url = url.format(parsedUrl);

    next();
});

// Proxy middleware for dynamic targets
app.use(
    createProxyMiddleware({
        router: (req) => req.target, // Dynamically set the target URL
        changeOrigin: true,         // Modify the Host header for cross-origin requests
        selfHandleResponse: false,  // Let the proxy handle the response
        logLevel: 'debug',          // Optional: Debug logs for easier troubleshooting
        onProxyReq: (proxyReq, req, res) => {
            console.log(`Proxying request to: ${req.target}${req.url}`);
        },
    })
);

// Start the proxy server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy running. Play Roblox here: http://localhost:${PORT}/?target=https://now.gg/apps/roblox-corporation/5349/roblox.html`);
});