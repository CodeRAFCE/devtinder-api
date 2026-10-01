require("dotenv").config();

const express = require("express");
const User = require("./models/user");
const { connectDB } = require("./config/database");
const { isNonEmptyObject } = require("./utils/checks");

const app = express();
const PORT = 3000;

// middleware to covert your all json data to JS object so req.body is not undefined
// req.body will log undefined if you don't use express.json()
app.use(express.json());

app.post("/sign-up", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  // Optional: Basic presence check (Mongoose schema also validates required fields)
  if (!firstName || !emailId || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Only allowed fields are passed to the model
  const user = new User({ firstName, lastName, emailId, password });
  try {
    await user.save();
    res.status(201).send("User added successfully!");
  } catch (error) {
    console.error("Sign-up error:", error.message);
    res.status(400).send("Something went wrong: " + error.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).send("User not found!");
    } else {
      res.json(users);
    }
  } catch (error) {
    res.status(400).send("Error finding the email");
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!isNonEmptyObject(user)) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Error finding the user");
  }
});

app.patch("/users/:id", async (req, res) => {
  const id = req.params?.id;
  const data = req.body;
  if (!isNonEmptyObject(data)) {
    return res.status(400).json({ error: "Request body cannot be empty." });
  }

  if (data?.skills.length > 10) {
    throw new Error("Skills limit exceeded");
  }

  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "skills",
    "photoUrl",
    "gender",
    "about",
  ];

  try {
    const isAllowedUpdates = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (!isAllowedUpdates) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate(id, data, {
      runValidators: true,
    });
    if (!isNonEmptyObject(user)) {
      return res.status(404).send("User not found");
    } else {
      res.send("User is updated");
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error when updating the user", errData: error });
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  if (id) {
    return res.status(404).send("User id not found");
  }

  try {
    await User.findByIdAndDelete(id);
    res.send("User deleted successfully");
  } catch (error) {}
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
