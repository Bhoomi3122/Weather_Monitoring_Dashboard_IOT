// server.js (Node.js + Express)
const express = require("express");
const cors = require("cors");
const app = express();

let latestData = { temperature: null, humidity: null };

app.use(cors());
app.use(express.json());

// Route to receive data from ESP8266
app.post("/api/data", (req, res) => {
  const { temperature, humidity } = req.body;
  latestData = { temperature, humidity };
  console.log("Received from ESP:", latestData);
  res.status(200).send("Data received");
});

// Route to serve data to frontend
app.get("/api/data", (req, res) => {
  res.json(latestData);
});

app.listen(3001, () => console.log("Backend running on port 3001"));
