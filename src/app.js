const express = require("express");
const { connectDB } = require("./config/database");

const app = express();
const PORT = 3000;

app.post("/sign-up", (req, res) => {
  
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
