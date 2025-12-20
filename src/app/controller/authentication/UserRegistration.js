import express from "express";
import DB from "../../config/db.js";
import Person from "../../model/Person/PersonModel.js";
import bcrypt from "bcrypt";
import User from "../../model/User/UserModel.js";

async function Register(req, res) {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      email,
      birth_date,
      username,
      password,
    } = req.body;
    DB.Connection();
    const existingUser = await User.findOne({ username });
    const existingEmail = await Person.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const person = await Person.create({
      first_name,
      middle_name,
      last_name,
      email,
      birth_date,
    });
    const user = await User.create({
      username,
      password: hashedPassword,
      person_id: person._id,
      created_at: new Date(),
    });

    return res.status(201).json({
      message: "Registration successful",
      userId: user._id,
      personId: person._id,
    });
  } catch (error) {
    console.error(error);
  }
}

export default Register;
