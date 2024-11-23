const express = require('express');
const app = express();
const port = 3000;

// Middleware to check IP address
app.use((req, res, next) => {
    const userIP = req.ip;

    // If the IP matches a specific one, redirect
    if (userIP === '73.170.99.220') { // Replace with the IP to check
        return res.redirect('https://google.com'); // Redirect to another domain
    }

    next(); // Continue if the IP doesn't match
});

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
