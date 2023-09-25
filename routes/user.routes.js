const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/usermodel");
const { loginmiddleware } = require("../middlewares/login.middeware");
const userRouter = express.Router();
require("dotenv").config();

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password } = req.body;

  try {
    const isUser = await UserModel.findOne({ email });
    if (isUser) {
      res.status(400).send({ erroe: "user already exists" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(500).send({ error: "Internal server error" });
        } else if (!hash) {
          res.status(500).send({ error: "internal server error" });
        } else if (hash) {
          const newUser = new UserModel({
            email,
            password: hash,
            gender,
            name,
          });
          await newUser.save();
          res.status(200).send({ msg: "A new user has been registered" });
        }
      });
    }
  } catch (error) {
    res.status(500).send({ error: "internal server error" });
  }
});

userRouter.post("/login", loginmiddleware, async (req, res) => {
  try {
    const token = jwt.sign(
      { userID: req.body.userID },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    res
      .status(200)
      .send({ msg: "user logged in", token: token, post: req.body.posts });
  } catch (error) {
    res.status(500).send({ error: "internal server error" });
  }
});

module.exports = {
  userRouter,
};
