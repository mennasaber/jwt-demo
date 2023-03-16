const jwt = require("jsonwebtoken");
module.exports.verify = (req, res, next) => {
  const token = req.headers["token"];
  if (!token) {
    return res.status(404).send("Unauthorized");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded;
  } catch (error) {
    return res.status(404).send("Unauthorized");
  }
  next();
};
