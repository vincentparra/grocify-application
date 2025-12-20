import mongoose from "mongoose";
import Person from "../Person/PersonModel.js";

const UserSchema = mongoose.Schema({
  person_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    required: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  last_login: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
