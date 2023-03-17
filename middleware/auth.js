const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
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

module.exports.googleStrategy = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3010/auth/signin-with-google/callback",
        session: false,
      },
      function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
      }
    )
  );
};
