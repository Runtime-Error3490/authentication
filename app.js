//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");
const crypto = require('crypto');
// const config = require("/home/shaleen/Desktop/2.1 Secrets - Starting Code/Secrets - Starting Code/config.js"); // Import your configuration
  
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define your user schema with the encryption plugin
const userSchema = new mongoose.Schema({
  email: String,
  password: String, // This field will be encrypted
});

userSchema.plugin(encrypt, {
    encryptionKey: process.env.encryptionKey, // Use the keys from your configuration
    signingKey: process.env.signingKey, // Use the keys from your configuration
    encryptedFields: ["password"],
  });

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  try {
    await newUser.save();
    res.render("secrets");
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
});

app.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const foundUser = await User.findOne({ email: username });
  if(foundUser===null)
  {
    res.send("Invalid username or password")
  }
  if (foundUser.password === password) {
    console.log(password);
    res.render("secrets");
  } else {
    res.send("Invalid username or password");
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
