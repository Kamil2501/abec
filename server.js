const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // 1. Importujemy cors

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, "messages.txt");

// 2. Używamy middleware CORS
// Domyślnie zezwala na wszystkie domeny ("*")
app.use(cors()); 

// Middleware to parse plain text bodies.
app.use(express.text({ type: "*/*" }));

// GET / -> Read all messages
app.get("/", (req, res) => {
  if (!fs.existsSync(FILE_PATH)) {
    return res.send("No messages yet.\n");
  }

  console.log("Someone has looked");
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

  const formattedDate = new Date().toLocaleString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const logEntry = `[${formattedDate}] ${message}\n`;
  console.log(`Uploaded: ${logEntry}`);

  fs.appendFile(FILE_PATH, logEntry, (err) => {
    if (err) return res.status(500).send("Error saving message\n");
    res.send("Message received\n");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Storage file: ${FILE_PATH}`);
});