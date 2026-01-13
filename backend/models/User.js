import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  verified: {
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String
  }

});

export default mongoose.model("User", userSchema);
