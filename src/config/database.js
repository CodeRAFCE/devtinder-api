const mongoose = require("mongoose");

// * Remove for production
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = process.env?.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI env variable is not set!");

const connectDB = async () => await mongoose.connect(uri);

// Call this only when your application terminates
async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}

module.exports = { connectDB, disconnectFromMongoDB };
