import mongoose from "mongoose";

const PersonSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    middle_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
    },
    birth_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
const Person = mongoose.model("Person", PersonSchema);
export default Person;
