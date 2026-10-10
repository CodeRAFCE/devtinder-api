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

const validateProfileEditData = (req) => {
  const { about, skills, photoUrl } = req.body;

  const allowedEditFields = [
    "firstName",
    "lastName",
    "skills",
    "photoUrl",
    "gender",
    "age",
    "about",
  ];

  if (about && about.length > 300) {
    throw new Error("about character limit exceeded");
  } else if (skills && skills.length > 10) {
    throw new Error("skills limit exceeded");
  } else if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Incorrect photoUrl format");
  }

  const isProfileEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  );

  return isProfileEditAllowed;
};

module.exports = { validateSignUpData, validateProfileEditData };
