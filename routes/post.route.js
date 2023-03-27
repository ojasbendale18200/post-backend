const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PostModel } = require("../model/post.model");

const postRouter = Router();

postRouter.get("/", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  const { min, max, page = 1, device } = req.query;
  let query = {};
  if (min && max) {
    query.no_of_comments = { $gt: Number(min), $lte: Number(max) };
  }

  if (device === "Laptop" || device == "Mobile" || device == "Tablet") {
    query.device = device;
  }
  const pageNo = page;
  const limit = 3;
  const skip = (pageNo - 1) * limit;

  try {
    if (decoded) {
      query.userID = decoded.userID;
      const posts = await PostModel.find(query).skip(skip).limit(limit);
      res.status(200).send(posts);
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

postRouter.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await PostModel.find({ _id: postId });
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

postRouter.get("/top", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  if (decoded) {
    let postId = decoded.userID;
    console.log(postId);
    let post = await PostModel.find({ userID: postId });
    res.status(200).send(post);
  }
});

postRouter.post("/add", async (req, res) => {
  const payload = req.body;
  try {
    const post = new PostModel(payload);
    await post.save();
    res.status(201).send({ message: "Post has been Added" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

postRouter.patch("/update/:postId", async (req, res) => {
  const { postId } = req.params;
  const payload = req.body;
  try {
    const post = await PostModel.findByIdAndUpdate({ _id: postId }, payload);
    res.status(200).send({ message: "Post Updated" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

postRouter.delete("/delete/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await PostModel.findByIdAndDelete({ _id: postId });
    res.status(200).send({ message: "Post deleted" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

module.exports = { postRouter };
