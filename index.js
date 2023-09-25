const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { postRouter } = require("./routes/post.routes");
const { userRouter } = require("./routes/user.routes");

const app = express();
app.use(express.json());
app.use(cors());

// require("dotenv").config();

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Welcome to Home Page" });
});

let PORT = process.env.PORT;
app.listen(PORT),
  async () => {
    try {
      await connection;
      console.log("Connected to the DB");
      console.log(`Server running on port ${PORT}`);
    } catch (error) {
      console.log("Conection Failed");
      console.log(error);
    }
  };
