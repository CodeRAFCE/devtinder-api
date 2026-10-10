const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/sign-up", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("INVALID CREDENTIALS");
    }

    const isPassword = await user.validatePassword(password);

    if (isPassword) {
      // Offloaded the jwt login to user schema
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000), // expires in 1h, change 1 to 24 will expire in 1d
        httpOnly: true,
      });

      res.send("Logged in");
    } else {
      throw new Error("INVALID CREDENTIALS");
    }
  } catch (error) {
    throw new Error("ERROR:" + error.message);
  }
});

authRouter.post("/logout", userAuth, (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout successful");
});

module.exports = authRouter;
