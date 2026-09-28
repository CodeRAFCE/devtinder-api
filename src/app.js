const express = require("express");

const app = express();
const PORT = 3000;

// Is a request handler
app.use("/health-check", (req, res) => {
  res.send("Hello from the server");
});

app.listen(PORT, () => {
  console.log(`Server starting in port => ${PORT}`);
});
