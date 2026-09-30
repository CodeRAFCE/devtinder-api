require("dotenv").config();

const express = require("express");
const User = require("./models/user");
const { connectDB } = require("./config/database");
const { isNonEmptyObject } = require("./utils/checks");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/sign-up", async (req, res) => {
  // req.body will log undefined if you don't use express.json()
  const data = req.body;
  if (!isNonEmptyObject(data)) {
    return res.status(400).json({ error: "Request body cannot be empty." });
  }

  // Creating a new instance of the User model
  const user = new User(data);
  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    console.error("Sign-up error:", error.message);
    res.status(400).send("Something went wrong: " + error.message);
  }
});

// * Always connect to DB and then listen to the server
connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(PORT, () => {
      console.log(`Server starting in port => ${PORT}`);
    });
  })
  .catch((err) => console.error("Database cannot be connected", err));
