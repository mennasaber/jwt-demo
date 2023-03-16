const User = require("./model/user");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verify } = require("./middleware/auth");
app.use(express.json());
app.post("/register", async (req, res) => {
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("email and password is required");
  }
  const existUser = await User.findOne({ email: email.toLowerCase() });
  if (!existUser) {
    return res.status(404).send("User does not exist");
  }
  console.log(existUser);
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

app.use(verify);
app.get("/validate", (req, res) => {
  return res.status(200).send(req.user);
});
module.exports = app;
