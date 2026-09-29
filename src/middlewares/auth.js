const adminAuth = (req, res, next) => {
  const token = "abc";
  const isAuthorizedAdmin = token === "abc";

  if (!isAuthorizedAdmin) {
    res.status(401).send("Unauthorized admin Access");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "abc";
  const isAuthorizedUser = token === "abc";

  if (!isAuthorizedUser) {
    res.status(401).send("Unauthorized user Access");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
