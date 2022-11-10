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

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

dotenv.config();

mongoose.connect(process.env.SECRET_KEY);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

app.set("port", PORT);

app.post("/users", [
  CheckIfCompleteDetails,
  CheckIfValidBodyEmail,
  CheckIfEmailExist,
  ],
  async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const filteredDetails = {
      firstName,
      lastName,
      email,
      password,
    };
  
    res.status(201).json(await User.create((filteredDetails)));
  }

);

app.post(
  "/posts/:id", [
    CheckIfUserExist,
    CheckIfCompletePostDetails
  ],
  async (req, res) => {
    const { title, content } = req.body;

    const id = req.params.id;

    const filteredDetails = {
      title,
      content,
      authorId: id,
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

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
