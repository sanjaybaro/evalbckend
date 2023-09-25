const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/usermodel");
const userRouter = express.Router();
const { BlacklistModel } = require("../model/blacklistmodel");

userRouter.post("/register", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(400).json({ msg: "User has been Already Registered" });
    } else {
      bcrypt.hash(req.body.password, 5, async (error, hash) => {
        if (hash) {
          const newUser = new UserModel({
            ...req.body,
            password: hash,
          });
          await newUser.save();
          res.status(200).json({ msg: "A new User Registered Sucessfull" });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          var token = jwt.sign(
            { userId: user._id, username: user.name },
            "masai"
          );
          res.status(200).json({ msg: "User Logged in Sucessfull!", token });
        } else {
          res.status(400).json({ msg: "Your  Password Incorrect" });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
userRouter.get("/logout", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  try {
    const newExToken = new BlacklistModel({ token: token });
    await newExToken.save();
    res.send({ msg: "User hase been logged out" });
  } catch (error) {
    res.status(500).send({ error: "internal server error" });
  }
});

module.exports = {
  userRouter,
};
