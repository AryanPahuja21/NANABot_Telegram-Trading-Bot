import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: Number,
  publicKey: String,
  privateKey: String,
});

export const User = mongoose.model("User", userSchema);
