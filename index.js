const express = require("express");
const { connection } = require("./config/db");
const { auth } = require("./middlewares/auth.middleware");
const { postRouter } = require("./routes/post.route");
const { userRouter } = require("./routes/user.route");
const app = express();
require("dotenv").config();
var cors = require("cors");
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("users page");
});

app.use("/users", userRouter);
app.use(auth);
app.use("/posts", postRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to DB");
  } catch (error) {
    console.log(error);
  }

  console.log(`server running on ${process.env.PORT}`);
});
