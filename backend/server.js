/**
 * Simple Express server to handle SQLite database operations
 * This server provides API endpoints for fetching and saving scores
 */
import express from "express";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import rateLimit from "express-rate-limit";

// Get the directory path for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express application
const app = express();
app.set("trust proxy", 1 /* number of proxies between user and server */);
const initialPort = 3002;
const maxPortAttempts = 10; // Limit port attempts to avoid infinite loop

// Configure SQLite with verbose mode for detailed error messages
const sqlite = sqlite3.verbose();

// Middleware to parse JSON request bodies
app.use(express.json());

// Base path middleware
const BASE_PATH = "/clairvoyance";
app.use(BASE_PATH, (req, res, next) => {
  next();
});

const rateLimitMessage =
  "Too many requests from this IP, please try again later.";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    const timeRemaining = Math.ceil(
      (req.rateLimit.resetTime - Date.now()) / 1000
    );
    const minutesRemaining = Math.ceil(timeRemaining / 60);

    const limitInfo = {
      error: rateLimitMessage,
      limit: req.rateLimit.limit,
      current: req.rateLimit.current,
      remaining: req.rateLimit.remaining,
      resetTime: req.rateLimit.resetTime,
      minutesUntilReset: minutesRemaining,
    };

    console.log("Rate limit hit:", limitInfo);

    res.status(429).json(limitInfo);
  },
});

app.use(limiter);

// Connect to SQLite database - creates the file if it doesn't exist
const db = new sqlite.Database(join(__dirname, "scores.db"));

// Create scores table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      score INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// API route to get all scores sorted by highest score first
app.get(`${BASE_PATH}/scores`, (req, res) => {
  db.all("SELECT * FROM scores ORDER BY score DESC", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch scores" });
    }
    res.json(rows);
  });
});

// API route to save a new score
app.post(`${BASE_PATH}/scores`, (req, res) => {
  const { name, score } = req.body;

  // Validate the request data
  if (!name || typeof score !== "number") {
    return res.status(400).json({ error: "Name and score are required" });
  }

  // Prepare and execute SQL statement
  const stmt = db.prepare("INSERT INTO scores (name, score) VALUES (?, ?)");
  stmt.run(name, score, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save score" });
    }

    // Return the saved score with its ID
    db.get("SELECT * FROM scores WHERE id = ?", this.lastID, (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch saved score" });
      }
      res.status(201).json(row);
    });
  });
  stmt.finalize();
});

/**
 * Attempt to start server on given port
 * If port is in use, try the next port number
 * @param {number} port - Port to try
 * @param {number} attempt - Current attempt number
 */
function startServer(port, attempt = 1) {
  // Check if we've exceeded maximum attempts
  if (attempt > maxPortAttempts) {
    console.error(
      `Failed to find an available port after ${maxPortAttempts} attempts.`
    );
    process.exit(1);
    return;
  }

  // Try to start server on the current port
  const server = app
    .listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);

      // Write the actual port to a file that the frontend can read
      fs.writeFileSync(join(__dirname, "port.txt"), port.toString());
    })
    .on("error", (err) => {
      // If port is already in use, try the next port
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${port} is busy, trying port ${port + 1}...`);
        startServer(port + 1, attempt + 1);
      } else {
        // For other errors, log and exit
        console.error("Server error:", err);
        process.exit(1);
      }
    });

  // Handle shutdown gracefully
  process.on("SIGINT", () => {
    server.close(() => {
      console.log("Server closed");
      db.close();
      process.exit(0);
    });
  });
}

// Start the server with initial port
startServer(initialPort);
