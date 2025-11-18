const jwt = require("jsonwebtoken");

const fetch = (req, res, next) => {
  // Get the user from the jwt token and add id to req object
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).send({ error: "Invalid Auth Token" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid Auth Token" });
  }
};

module.exports = fetch;
