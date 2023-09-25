
const { BlacklistModel } = require("../model/blacklistmodel");
// const jwt = require("jsonwebtoken");
const jwt=require("jsonwebtoken")
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  try {
    const isToken = await BlacklistModel.findOne({ token });
    if (isToken) {
      res.status(400).send({ error: "Please Login!" });
    } else {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: "internal server error" });
        } else if (!decoded) {
          res.status(400).send({ error: "invalid credentials" });
        } else if (decoded) {
          req.body.userID = decoded.userID;
          next();
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "internal server error" });
  }
};

module.exports = {
  authMiddleware,
};
