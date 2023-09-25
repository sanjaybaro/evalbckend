const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PostModel } = require("../model/postmodel");
const { authMiddleware } = require("../middlewares/auth.middleware");
const postRouter = express.Router();
postRouter.use(authMiddleware);

postRouter.get("/", async (req, res) => {
  const { device1, device2 } = req.query;
  let query = {};
  if (device1 && device2) {
    query.device = { $and: [{ device: device1 }, { device: device2 }] };
  } else if (device1) {
    query.device = device1;
  } else if (device2) {
    query.device = device2;
  }
  try {
    const posts = await PostModel.find(query);
    res.status(200).json({ msg: "User has been Posts", posts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

postRouter.post("/add", authMiddleware, async (req, res) => {
  const { userID } = req.body;
  try {
    const post = new PostModel({ ...req.body, userID });

    await post.save();
    res.status(200).send({ msg: "user Post has been added" });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

postRouter.patch("/update/:Id", async (req, res) => {
  const { Id } = req.params;
  const note = await PostModel.findOne({ _id: Id });
  try {
    if (req.body.userId !== note.userId) {
      res.status(400).send({ error: "You are not authorized" });
    } else {
      await PostModel.findByIdAndUpdate({ _id: Id }, req.body);
      res.status(200).send({ msg: "User Post Updated" });
    }
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

postRouter.delete("/delete/:Id", async (req, res) => {
  const { Id } = req.params;
  const note = await PostModel.findOne({ _id: Id });
  try {
    if (req.body.userId !== note.userId) {
      res.status(400).send({ error: "You are not authorized" });
    } else {
      await PostModel.findByIdAndDelete({ _id: Id });
      res.status(200).send({ msg: " User Post Delete" });
    }
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

module.exports = {
  postRouter,
};
