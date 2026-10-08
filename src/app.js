require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const { connectDB } = require("./config/database");
const { isNonEmptyObject } = require("./utils/checks");
const { validateSignUpData } = require("./utils/validation");

const app = express();
const PORT = 3000;

// middleware to covert your all json data to JS object so req.body is not undefined
// req.body will log undefined if you don't use express.json()
app.use(express.json());

// Middleware to read the cookie similar to express.json()
app.use(cookieParser());

app.post("/sign-up", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwardHash = await bcrypt.hash(password, 10);

    // Only allowed fields are passed to the model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwardHash,
    });

    await user.save();
    res.status(201).send("User added successfully!");
  } catch (error) {
    console.error("ERROR: ", error.message);
    res.status(400).send("ERROR: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("ERROR: INVALID CREDENTIALS");
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (isPassword) {
      // TODO: Create a token
      // TODO: Add the token to cookie and send the response back to the user
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder#1022");
      res.cookie("token", token);
      res.send("Logged in");
    } else {
      throw new Error("ERROR: INVALID CREDENTIALS");
    }
  } catch (error) {
    throw new Error("ERROR:" + error);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("ERROR: INVALID TOKEN");
    }

    const userData = await jwt.verify(token, "DEV@Tinder#1022");
    const { _id } = userData;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("ERROR: USER DOES NOT EXIST"); 
    }

    res.send(user);
  } catch (error) {
    throw new Error("ERROR:" + error);
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
