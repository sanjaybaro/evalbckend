const express = require("express");
const { connection } = require("./config/db");
const { postRouter } = require("./routes/post.routes");
const { userRouter } = require("./routes/user.routes");

const app = express();

require("dotenv").config();

const PORT = process.env.PORT;

app.use(express.json());
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Home Page");
});

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
