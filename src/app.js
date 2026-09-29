const express = require("express");

const app = express();
const PORT = 3000;

// Is a request handler
// .use is a wildcard where any route with /health-check/* will run the cb funtion
// Same goes with any kind of route that is passed inside in .use method
app.use("/health-check", (req, res) => {
  res.send("Server is Healthy in port 3000");
});

app.use(
  "/user",
  (req, res, next) => {
    console.log("Handling 1st request");
    next();
    res.send("1st method");
  },
  (req, res) => {
    console.log("2nd method");
    res.send("2nd Response"); // ERROR: Cannot set headers after they are sent to the client
  },
);

app.listen(PORT, () => {
  console.log(`Server starting in port => ${PORT}`);
});
 