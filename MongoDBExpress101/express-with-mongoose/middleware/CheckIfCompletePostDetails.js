import Post from "../models/Post.js"

export default async function CheckIfCompletePostDetails(req, res, next) {
  const {title, content} = req.body;

  if(!title || !content) {
      
    return res.status(422).json({
      error: "Title or Content must not be empty",
    });
  }
  next();
}