const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const url = require('url');

const app = express();

// Middleware to parse the target URL dynamically
app.use((req, res, next) => {
    const query = url.parse(req.url, true).query;

    // Set the target URL, default to Roblox on now.gg
    req.target = query.target || 'https://now.gg/apps/roblox-corporation/5349/roblox.html';

    // Remove the target query parameter for clean forwarding
    const parsedUrl = url.parse(req.url, true);
    delete parsedUrl.query.target;
    req.url = url.format(parsedUrl);

    next();
});

// Proxy middleware with cookie and header management
app.use(
    createProxyMiddleware({
        router: (req) => req.target,
        changeOrigin: true,
        selfHandleResponse: false,
        logLevel: 'debug',
        onProxyReq: (proxyReq, req, res) => {
            // Log the proxied request
            console.log(`Proxying request to: ${req.target}${req.url}`);
        },
        onProxyRes: (proxyRes, req, res) => {
            // Clear conflicting headers to prevent loops
            delete proxyRes.headers['set-cookie'];
        },
        onError: (err, req, res) => {
            console.error('Proxy error:', err.message);
            res.status(500).send('Proxy error occurred.');
        },
    })
);

// Start the proxy server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy running. Access it at http://localhost:${PORT}/?target=https://now.gg/apps/roblox-corporation/5349/roblox.html`);
});