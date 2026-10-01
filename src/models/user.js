const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
    lastName: { type: String, minLength: 1, maxLength: 50 },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (validator.isEmail(value))
          throw new Error("Invalid email address:" + value);
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (validator.isStrongPassword)
          throw new Error("Provide a strong password");
      },
    },
    age: { type: Number, min: 18 },
    gender: { type: String, enum: ["male", "female"] },
    photoUrl: {
      type: String,
      default: "https://uxwing.com/developer-icon/",
      validate(value) {
        if (validator.isURL(value))
          throw new Error("Invalid URL format:" + value);
      },
    },
    skills: {
      type: [String],
      validate: {
        validator: (value) => value.length <= 10,
        message: "Too many items!",
      },
    },
    about: { type: String, minLength: 10, maxLength: 300 },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
