const express = require("express");

const app = express();
const PORT = 3000;

// Never delcare err handler in the top
/*
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send("ERROR!");
  }
});
*/

app.get("/users", (req, res) => {
  throw new Error("Uh-oh! something went wrong!");
  res.send("This won't execute");
});

// Always declare in the bottom of the file
// When you pass 4 args follow the exact order (err, req, res, next)
// args patterns for route handlers => (req, res), (req, res, next), (err, req, res, next)
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send("ERROR!");
  }
});

// Is a request handler
// .use is a wildcard where any route with /health-check/* will run the cb funtion
// Same goes with any kind of route that is passed inside in .use method
app.use("/health-check", (req, res) => {
  res.send("Server is Healthy in port 3000");
});

app.listen(PORT, () => {
  console.log(`Server starting in port => ${PORT}`);
});
