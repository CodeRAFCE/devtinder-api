const mongoose = require("mongoose");

// * Remove for production
if (process.env.NODE_ENV === "development") {
  const dns = require("dns");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const uri = process.env.MONGODB_URI;
const connectDB = async () => uri && (await mongoose.connect(uri));

// Call this only when your application terminates
async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}

module.exports = { connectDB, disconnectFromMongoDB };
