const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, "messages.txt");

// Middleware to parse plain text bodies.
// type: '*/*' allows curl to work without specifying Content-Type headers
app.use(express.text({ type: "*/*" }));

// GET / -> Read all messages
app.get("/", (req, res) => {
  // Check if file exists
  if (!fs.existsSync(FILE_PATH)) {
    return res.send("No messages yet.\n");
  }

  // Read file and send plain text response
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file\n");
    res.send(data);
  });
});

// POST / -> Send a message
app.post("/", (req, res) => {
  const message = req.body;

  if (!message) {
    return res.status(400).send("Message body is empty\n");
  }

  // Format the date using Polish locale (pl-PL)
  const formattedDate = new Date().toLocaleString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Prepare text to append
  const logEntry = `[${formattedDate}] ${message}\n`;

  // Append to file
  fs.appendFile(FILE_PATH, logEntry, (err) => {
    if (err) return res.status(500).send("Error saving message\n");
    res.send("Message received\n");
  });
});
