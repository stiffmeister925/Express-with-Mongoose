import User from '../models/User.js'

export default async function CheckIfAuthorExist(req, res, next) {

  const id = req.params.userId;
  const findUser = await User.findOne({ _id: id });

  if (!findUser) {

    return res.status(422).json({
      error: "User doesn't Exist",
    });
  }
  next();
}