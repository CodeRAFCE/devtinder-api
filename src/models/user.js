const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
    lastName: { type: String },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    age: { type: Number, min: 18 },
    gender: { type: String, enum: ["Male", "Female"] },
    photoUrl: { type: String },
    skills: { type: [String] },
    about: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
