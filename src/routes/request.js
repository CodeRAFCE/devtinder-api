const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send("Connection request sent");
  } catch (error) {
    throw new Error("ERROR: " + error.message);
  }
});

module.exports = requestRouter;
