const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  // Optional: Basic presence check (Mongoose schema also validates required fields)
  if (!firstName || !lastName) {
    throw new Error("Name cannot be empty");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email id is invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is weak, Please enter strong password");
  }
};

module.exports = { validateSignUpData };
