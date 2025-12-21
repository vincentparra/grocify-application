import User from "../../model/User/UserModel.js";
import Person from "../../model/Person/PersonModel.js";
async function findUserByUsername(username) {
  return await User.findOne({ username }).populate("person");
}

async function findUserByIdandUpdate(id) {
  return await User.findByIdAndUpdate(
    id,
    {
      last_login: new Date(),
    },
    {
      new: true,
    }
  ).populate("person");
}

export default { findUserByUsername, findUserByIdandUpdate };
