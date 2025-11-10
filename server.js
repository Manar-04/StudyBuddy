const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to your PostgreSQL database
const pool = new Pool({
  user: "postgres",               // postgreSQL username
  host: "localhost",              // database is on the computer
  database: "studybuddy",        
  password: "Manar2004", // replace with real password
  port: 5432                      // default PostgreSQL port
});


// register a new user
app.post("/api/users", async (req, res) => {
  const { name, email, password } = req.body;

  // basic check to make sure all fields are filled
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    // insert the new user into the database
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    res.status(201).json(result.rows[0]); // send back the new user
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Could not create user" });
  }
  console.log("POST /api/users hit");
});


// Create a new deck
app.post("/api/decks", async function (req, res) {
  const { title, subject, owner_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO decks (title, subject, owner_id) VALUES ($1, $2, $3) RETURNING *",
      [title, subject, owner_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Deck creation error:", err);
    res.status(500).json({ error: "Failed to create deck" });
  }
});

// Get decks for a specific user
app.get("/api/decks/user/:id", async function (req, res) {
  const result = await pool.query("SELECT * FROM decks WHERE owner_id = $1", [req.params.id]);
  res.json(result.rows);
});

// Get public decks
app.get("/api/decks/public", async function (req, res) {
  const result = await pool.query("SELECT * FROM decks WHERE public = true");
  res.json(result.rows);
});

// Add a flashcard to a deck
app.post("/api/flashcards", async (req, res) => {
  const { deck_id, question, answer } = req.body;

  if (!deck_id || !question || !answer) {
    return res.status(400).json({ error: "All fields are required" });
  } try {
    const result = await pool.query(
      "INSERT INTO flashcards (deck_id, question, answer) VALUES ($1, $2, $3) RETURNING *",
      [deck_id, question, answer]
    );

    res.status(201).json(result.rows[0]);
  } 
  catch (err) {
    console.error("Error adding flashcard:", err);
    res.status(500).json({ error: "Could not add flashcard" });
  }
});


// Get all flashcards for a specific deck
app.get("/api/flashcards", async (req, res) => {
  const { deck_id } = req.query;
  console.log("GET /api/flashcards hit with deck_id:", deck_id);
  if (!deck_id) {
    return res.status(400).json({ error: "deck_id is required" });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM flashcards WHERE deck_id = $1",
      [deck_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching flashcards:", err);
    res.status(500).json({ error: "Could not fetch flashcards" });
  }
});

// Save a quiz result (simplified to match your table)
app.post("/api/quizzes", async function (req, res) {
  const { user_id, deck_id, score } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO quizzes (user_id, deck_id, score) VALUES ($1, $2, $3) RETURNING *",
      [user_id, deck_id, score]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Quiz save error:", err);
    res.status(500).json({ error: "Failed to save quiz" });
  }
});



app.post("/api/register", async function (req, res) {
  const { name, email, password } = req.body;
  console.log("Registering user:", req.body);

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name",
      [name, email, hashed]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false });
  }
});

app.post("/api/login", async function (req, res) {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ success: true, userId: user.id, name: user.name });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false });
  }
});

// start the server
app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
