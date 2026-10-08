require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const User = require("./models/user");
const { connectDB } = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

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

    const isPassword = user.validatePassword(password);

    if (isPassword) {
      // Offloaded the jwt login to user schema
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000), // expires in 1h, change 1 to 24 will expire in 1d
        httpOnly: true,
      });

      res.send("Logged in");
    } else {
      throw new Error("ERROR: INVALID CREDENTIALS");
    }
  } catch (error) {
    throw new Error("ERROR:" + error);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    throw new Error("ERROR:" + error);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send("Connection request sent");
  } catch (error) {
    throw new Error("ERROR: " + error.message);
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
