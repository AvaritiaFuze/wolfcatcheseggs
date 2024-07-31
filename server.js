const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

function verifyToken(token) {
    const data = fs.readFileSync('tokens.txt', 'utf8');
    const tokens = data.split('\n').map(line => line.split(',')[1]);
    return tokens.includes(token);
}

app.get('/', (req, res) => {
    const token = req.query.token;
    if (verifyToken(token)) {
        res.sendFile(__dirname + '/public/index.html');
    } else {
        res.status(403).send('Access Denied');
    }
});

app.post('/ban', (req, res) => {
    console.log('User banned!');
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});