const User = require("./model/user");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./middleware/auth").verify;
const passport = require("passport");
app.use(express.json());
require("./middleware/auth").googleStrategy(passport);
// ******************** Default sign up ********************
app.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !password || !email) {
    return res.status(400).send("Name, Email and Password are required");
  }
  const existUser = await User.findOne({ email: email.toLowerCase() });
  if (existUser) {
    return res.status(400).send("User already exists");
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  const createdUser = await User.create({
    name,
    email: email.toLowerCase(),
    password: encryptedPassword,
  });
  const token = jwt.sign(
    { _id: createdUser._id, email: email.toLowerCase() },
    process.env.JWT_TOKEN,
    {
      expiresIn: "2h",
    }
  );
  return res.status(201).send({ token });
});

// ******************** Default sign in ********************
app.post("/auth/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("email and password is required");
  }
  const existUser = await User.findOne({
    email: email.toLowerCase(),
    accountType: "Default",
  });
  if (!existUser) {
    return res.status(404).send("User does not exist");
  }
  const isMatch = await bcrypt.compare(password, existUser.password);
  if (!isMatch) {
    return res.status(404).send("Invalid Credentials");
  }
  const token = jwt.sign(
    { _id: existUser._id, email: existUser.email },
    process.env.JWT_TOKEN,
    {
      expiresIn: "2h",
    }
  );
  return res.status(200).send({ token });
});

// ******************** Google sign in ********************
app.get(
  "/auth/signin-with-google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// ******************** Googel sign in callback ********************
app.get(
  "/auth/signin-with-google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const email = req.user._json.email;
    const name = req.user._json.name;
    if (!name || !email) {
      return res.status(400).send("Name and Email are required");
    }
    let existUser = await User.findOne({
      email: email.toLowerCase(),
      accountType: "Google",
    });
    if (!existUser) {
      existUser = await User.create({
        accountType: "Google",
        name,
        email: email.toLowerCase(),
      });
    }
    const token = jwt.sign(
      { _id: existUser._id, email: email.toLowerCase() },
      process.env.JWT_TOKEN,
      {
        expiresIn: "2h",
      }
    );
    return res.status(200).send({ token });
  }
);

app.get("/auth/validate", verify, (req, res) => {
  return res.status(200).send(req.user);
});
module.exports = app;
