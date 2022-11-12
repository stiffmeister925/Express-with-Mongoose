import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import process from "node:process";
import User from "./models/User.js";
import Post from "./models/Post.js";
import CheckIfCompleteDetails from "./middleware/CheckIfCompleteDetails.js";
import CheckIfValidBodyEmail from "./middleware/CheckIfValidBodyEmail.js";
import CheckIfEmailExist from "./middleware/CheckIfEmailExist.js";
import CheckIfCompletePostDetails from "./middleware/CheckIfCompletePostDetails.js";
import CheckIfUserExist from "./middleware/CheckIfUserExist.js";
import CheckIfAuthorExist from "./middleware/CheckIfAuthorExist.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.DB_URI);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

app.set("port", PORT);

app.post(
  "/users",
  [CheckIfCompleteDetails, CheckIfValidBodyEmail, CheckIfEmailExist],
  async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const filteredDetails = {
      firstName,
      lastName,
      email,
      password,
    };

    res.status(201).json(await User.create(filteredDetails));
  }
);

app.post(
  "/posts/:id",
  [CheckIfUserExist, CheckIfCompletePostDetails],
  async (req, res) => {
    const { title, content } = req.body;
    const authorId = req.header("X-User-ID");

    const filteredDetails = {
      title,
      content,
      authorId: authorId,
    };

    res.status(201).json(await Post.create(filteredDetails));
  }
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World!",
  });
});

app.get("/users", async (req, res) => {
  res.json(await User.find());
});

app.get("/users/:userId/posts", CheckIfAuthorExist, async (req, res) => {
  const { userId } = req.params;
  const { limit, offset } = req.query;

  // approach using find
  // res
  //   .status(200)
  //   .json(
  //     await Post.find
  //       ({ authorId: mongoose.Types.ObjectId(userId) })
  //       .sort({ date: 1 })
  //       .limit(limit)
  //       .skip(offset)
  // );

  // approach using aggregate
  res
    .status(200)
    .json(
      await Post.aggregate([
        { $match: { authorId: mongoose.Types.ObjectId(userId) } },
        { $sort: { date: -1 } },
        { $limit: parseInt(limit) || 20 },
        { $skip: parseInt(offset) || 0 },
      ])
    );
});

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
