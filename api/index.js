const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date().toISOString()
  });
});

module.exports = app;