import DB from "../../../app/utils/security/config/db.js";
import User from "../../model/User/UserModel.js";
import bcrypt from "bcrypt";
import JWTProvider from "../../utils/security/JWTProvider.js";
import { UserPrincipal } from "../../model/User/Principal/UserPrincipal.js";
import UserRepository from "../../repository/user/UserRepository.js";
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

    const user = await UserRepository.findUserByUsername(username);

    if (user === null) {
      res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (user != null && !isMatch) {
      res.json({ message: "Username or password is incorrect" });
    }

    if (isMatch) {
      const userWithPerson = await UserRepository.findUserByIdandUpdate(
        user._id
      );

      const { _id, username, person, last_login } = userWithPerson;

      const principal = UserPrincipal(user);

      const token = JWTProvider.GenerateToken(principal);
      res.setHeader("JWT-TOKEN", token);
      return res.json({
        message: "login successfully",
        userId: _id,
        username,
        last_login,
        person: person,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export default { login };
