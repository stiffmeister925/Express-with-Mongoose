import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email:{ type: String,min: 10, lowercase: true },
  password:{ type: String, min: [8, 'Must be at least 6, got {VALUE}'], max: 20, required: true },
  date: { type: Date, default: Date.now },
});

export default model('User', userSchema);