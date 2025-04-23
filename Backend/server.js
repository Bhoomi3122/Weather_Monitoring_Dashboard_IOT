// server.js
const express = require('express');
const app = express();
const port = 3000;

let latestData = { temperature: null, humidity: null };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Server is up!');
});

// Receive data from ESP8266
app.get('/update', (req, res) => {
    const { temperature, humidity } = req.query;
    if (temperature && humidity) {
        latestData.temperature = temperature;
        latestData.humidity = humidity;
        console.log(`Data received - Temp: ${temperature}, Humidity: ${humidity}`);
        res.send("Data updated successfully!");
    } else {
        res.status(400).send("Missing parameters");
    }
});

// Provide latest data to frontend
app.get('/data', (req, res) => {
    res.json(latestData);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
