const { query } = require("express");
const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { PostModel } = require("../model/postmodel");
const { UserModel } = require("../model/usermodel");
const postRouter = express.Router();

postRouter.get("/", authMiddleware, async (req, res) => {
  if (req.query.device1) {
    query.device1 = req.query.device1;
  }
  if (req.query.device2) {
    query.device2 = req.query.device2;
  }
  if (req.query.device3) {
    query.device3 = req.query.device3;
  }
  try {
    let posts = await PostModel.find({ userID: req.body.userID, ...query });
    console.log(posts);
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "internal server error" });
  }
});

postRouter.post("/add", authMiddleware, async (req, res) => {
  try {
    const newPost = new PostModel(req.body);
    const user = await UserModel.findOne({ _id: req.body.userID });
    // const count = Number(user.posts) + 1;
    await UserModel.findByIdAndUpdate({ _id: req.body.userID });
    const post = await newPost.save();
    res.status(200).send({ msg: "new post added", post: post });
  } catch (error) {
    res.status(501).send({ error: "internal server error" });
  }
});

postRouter.patch("/update/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostModel.findOne({ _id: id });
    if (post.userID == req.body.userID) {
      await PostModel.findByIdAndUpdate({ _id: id }, req.body);
      res.send({ msg: "post updated" });
    } else {
      res.status(400).send({ error: "you are not authorized" });
    }
  } catch (error) {
    res.status(500).send({ error: "internal server error" });
  }
});

postRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostModel.findOne({ _id: id });
    if (post.userID == req.body.userID) {
      await PostModel.findByIdAndDelete({ _id: id }, req.body);
      res.send({ msg: "post deleted" });
    } else {
      res.status(402).send({ error: "you are not authorized" });
    }
  } catch (error) {
    res.status(500).send({ error: "internal server error" });
  }
});

module.exports = {
  postRouter,
};
