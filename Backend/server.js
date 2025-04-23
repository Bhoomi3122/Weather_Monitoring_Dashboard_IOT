const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Sample historical data (can be updated later to push real-time entries)
const sampleData = [
  { timestamp: "2025-04-22T00:00:00", temperature: 22, humidity: 70 },
  { timestamp: "2025-04-22T01:00:00", temperature: 21.5, humidity: 72 },
  { timestamp: "2025-04-22T02:00:00", temperature: 21, humidity: 74 },
  { timestamp: "2025-04-22T03:00:00", temperature: 20.8, humidity: 75 },
  { timestamp: "2025-04-22T04:00:00", temperature: 21, humidity: 73 },
  { timestamp: "2025-04-22T05:00:00", temperature: 21.5, humidity: 71 },
  { timestamp: "2025-04-22T06:00:00", temperature: 22.5, humidity: 68 },
  { timestamp: "2025-04-22T07:00:00", temperature: 24, humidity: 64 },
  { timestamp: "2025-04-22T08:00:00", temperature: 25.5, humidity: 60 },
  { timestamp: "2025-04-22T09:00:00", temperature: 27, humidity: 56 },
  { timestamp: "2025-04-22T10:00:00", temperature: 28.5, humidity: 52 },
  { timestamp: "2025-04-22T11:00:00", temperature: 30, humidity: 48 },
  { timestamp: "2025-04-22T12:00:00", temperature: 31, humidity: 45 },
  { timestamp: "2025-04-22T13:00:00", temperature: 32, humidity: 42 },
  { timestamp: "2025-04-22T14:00:00", temperature: 32.5, humidity: 40 },
  { timestamp: "2025-04-22T15:00:00", temperature: 32, humidity: 41 },
  { timestamp: "2025-04-22T16:00:00", temperature: 31, humidity: 43 },
  { timestamp: "2025-04-22T17:00:00", temperature: 30, humidity: 46 },
  { timestamp: "2025-04-22T18:00:00", temperature: 28.5, humidity: 50 },
  { timestamp: "2025-04-22T19:00:00", temperature: 27, humidity: 55 },
  { timestamp: "2025-04-22T20:00:00", temperature: 25.5, humidity: 58 },
  { timestamp: "2025-04-22T21:00:00", temperature: 24, humidity: 62 },
  { timestamp: "2025-04-22T22:00:00", temperature: 23, humidity: 66 },
  { timestamp: "2025-04-22T23:00:00", temperature: 22.5, humidity: 68 }
];


// Optional: Push real-time data into this array
app.post("/api/data", (req, res) => {
  const { temperature, humidity } = req.body;
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

app.listen(3001, () => console.log("Backend running on port 3001"));
