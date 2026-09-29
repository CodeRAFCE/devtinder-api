const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();
const PORT = 3000;

// Is a request handler
// .use is a wildcard where any route with /health-check/* will run the cb funtion
// Same goes with any kind of route that is passed inside in .use method
app.use("/health-check", (req, res) => {
  res.send("Server is Healthy in port 3000");
});

app.use("/admin", adminAuth);
app.use("/user", userAuth);

app.get("/admin/getAllUsers", (req, res) => {
  res.send("All User Data sent from admin");
});

app.get("/user/:id", (req, res) => {
  res.send("One User data sent");
});

app.post("/user/:id", (req, res) => {
  res.send("user data added");
});

app.patch("/user/:id", (req, res) => {
  res.send("user data updated");
});

app.delete("/user/:id", (req, res) => {
  res.send("user data deleted");
});

app.listen(PORT, () => {
  console.log(`Server starting in port => ${PORT}`);
});
