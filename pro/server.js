const express = require("express");
const cors = require("cors");

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Start up an instance of the app
const app = express();

/* Middleware */
// Configure express to use JSON and handle CORS
app.use(express.json()); // Built-in body parser for JSON
app.use(express.urlencoded({ extended: true })); // Handles URL-encoded data
app.use(cors());

// Initialize the main project folder
app.use(express.static("website")); // Serves static files in 'website' directory

// Setup Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// GET route to return projectData
app.get("/all", (req, res) => {
  if (Object.keys(projectData).length === 0) {
    res.status(404).send({ message: "No data available yet." });
  } else {
    res.status(200).send(projectData);
  }
});

// POST route to add data to projectData
app.post("/add", (req, res) => {
  try {
    const { temp, date, content } = req.body;

    // Simple validation
    if (!temp || !date || !content) {
      return res.status(400).send({
        message: "Please provide valid 'temp', 'date', and 'content' in the request body.",
      });
    }

    // Save data to projectData object
    projectData = { temp, date, content };
    res.status(201).send({
      message: "Data added successfully!",
      data: projectData,
    });
  } catch (error) {
    console.error("Error adding data:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
