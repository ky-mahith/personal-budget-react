const express = require('express');
const cors = require('cors');
const budget = require("./_budget.json");
const app = express();
const port = 3200;

// app.use('/', express.static('public'));

app.use(cors());

app.get('/hello', (req, res) =>{
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});



