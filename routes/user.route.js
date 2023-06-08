const { Router } = require("express");
const { UserModel } = require("../model/user.model");
const userRouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
userRouter.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.status(400).send({ message: "User already exist, please login" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        const saveUser = new UserModel({
          firstname,
          lastname,
          email,
          password: hash,
        });
        await saveUser.save();
        res.status(201).send({ message: "User Registered" });
      });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

//Login

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.status(200).send({
            message: "Login Successfull",
            token: jwt.sign({ userID: user._id }, "masai"),
          });
        } else {
          res.status(400).send({ message: "wrong Credentials" });
        }
      });
    } else {
      res.status(400).send({ message: "wrong credentials" });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

module.exports = { userRouter };
