const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample historical data (can be updated later to push real-time entries)
const sampleData = [
  { timestamp: "2025-04-22T09:00:00", temperature: 26, humidity: 40 },
  { timestamp: "2025-04-22T10:00:00", temperature: 28, humidity: 42 },
  { timestamp: "2025-04-22T11:00:00", temperature: 30, humidity: 38 },
  { timestamp: "2025-04-22T12:00:00", temperature: 34, humidity: 36 }
];

// Optional: Push real-time data into this array
app.get("/api/data", (req, res) => {
  const { temperature, humidity } = req.query;
  const timestamp = new Date().toISOString();
  const newEntry = { timestamp, temperature, humidity };
  sampleData.push(newEntry);
  console.log("Received from ESP:", newEntry);
  res.status(200).send("Data received");
});

// Send the whole sampleData array
app.get("/api/data", (req, res) => {
  res.json(sampleData);
});

// Provide latest data to frontend
app.get('/data', (req, res) => {
    res.json(latestData);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
