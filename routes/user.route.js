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
          const { password, ...info } = user._doc;
          res.status(200).send(info);
        } else {
          res.status(400).send("Wrong password or username!");
        }
      });
    } else {
      res.status(400).send("User Not Found!");
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// get Users
userRouter.get("/",async(req,res) => {
  try {
    const users = await UserModel.find();
    res.status(200).send(users)
  } catch (error) {
    res.status(400).send({ message: error });
  }

})

// Delete User

userRouter.delete("/:id",async(req,res) => {
  const {id} = req.params
  try {
    const user = await UserModel.findByIdAndDelete({_id:id})
    res.status(200).send({ message: "User Deleted" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
})

module.exports = { userRouter };
