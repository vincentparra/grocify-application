import DB from "../config/db.js";
import User from "../model/User/UserModel.js";
import bcrypt from "bcrypt";
import GenerateToken from "../utils/security/JWTProvider.js";
import { UserPrincipal } from "../model/User/Principal/UserPrincipal.js";

async function login(req, res) {
  try {
    DB.Connection();
    const { username, password } = req.body;

    if (username === null || username.trim().length === 0) {
      res.status(400).json({ message: "Username is required" });
    }

    if (password === null || password.trim().length === 0) {
      res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ username });

    if (user === null) {
      res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (user != null && !isMatch) {
      res.json({ message: "Username or password is incorrect" });
    }

    if (isMatch) {
      const userWithPerson = await User.findByIdAndUpdate(
        user._id,
        { last_login: new Date() },
        { new: true }
      ).populate("person_id");

      const { _id, username, person_id, last_login } = userWithPerson;
      const principal = UserPrincipal({
        _id,
        username,
        person_id: user.person_id,
      });
      const token = GenerateToken(principal);
      res.setHeader("JWT-TOKEN", token);
      return res.json({
        message: "login successfully",
        userId: _id,
        username,
        last_login,
        person: person_id,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export default { login };
