const bcrypt = require("bcrypt");
const { UserModel } = require("../model/usermodel");

const loginmiddleware = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const isuser = await UserModel.findOne({ email });
    if (!isuser) {
      res.status(400).send({ error: "user dose not exist!" });
    } else {
      bcrypt.compare(password, isuser.password, (err, result) => {
        if (err) {
          res.status(500).send({ error: "internal server error" });
        } else if (!result) {
          res.status(400).send({ error: "invalid credentials" });
        } else if (result) {
          console.log(isuser);
          req.body.userID = isuser._id;
          req.body.posts = isuser.posts;
          next();
        }
      });
    }
  } catch (error) {
    res.status(500).send({ error: "internal server error" });
  }
};

module.exports = {
  loginmiddleware,
};
