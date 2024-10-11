const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3030;
app.use(cors({
    origin: 'http://localhost:8020'
}));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'testajax.html'));
});

// Serve the script file
app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});