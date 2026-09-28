const express = require("express");

const app = express();
const PORT = 3000;

// Is a request handler
// .use is a wildcard where any route with /health-check/* will run the cb funtion
// Same goes with any kind of route that is passed inside in .use method
app.use("/health-check", (req, res) => {
  res.send("Server is Healthy in port 3000");
});

// Older route techniques
// app.get("/use?r", (req, res) => {
//   res.send({ firstName: "Seshan", lastName: "A" });
// });

// Express 5 completely upgraded its route parsing engine
//You cannot use regex quantifiers directly inside route path strings anymore.
// To fix this pass a real JavaScript RegExp literal instead of a string:
app.get(/^\/use?r$/, (req, res) => {
  res.send({ firstName: "Seshan", lastName: "A" });
});

// app.use("/", (req, res) => {
//   res.send("Any route with prefix / will execute depending on the order");
// });

app.listen(PORT, () => {
  console.log(`Server starting in port => ${PORT}`);
});
