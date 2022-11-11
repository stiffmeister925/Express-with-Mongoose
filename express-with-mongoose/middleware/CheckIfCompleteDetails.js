import User from '../models/User.js'

export default async function CheckIfCompleteDetails(req, res, next) {
  const {firstName, lastName, email, password} = req.body;

  if(!firstName || !lastName || !email || !password) {
      
    return res.status(422).json({
      error: "Please complete the required details",
    });
  }
  next();
}