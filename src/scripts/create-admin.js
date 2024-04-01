import dotenv from "dotenv";
import mongoose from "mongoose";
import Enquirer from "enquirer";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    createAdmin();
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

async function createAdmin() {
  const questions = [
    { type: "input", name: "name", message: "Enter name: " },
    { type: "input", name: "email", message: "Enter email: " },
    { type: "password", name: "password", message: "Enter password: " },
  ];

  const answers = await Enquirer.prompt(questions);

  try {
    const user = await User.create({
      name: answers.name,
      email: answers.email,
      password: await bcrypt.hash(answers.password, 10),
      roles: ["admin"],
    });
    console.log(`Admin user "${user._id}" created successfully`);
  } catch (error) {
    if (error.message.includes("duplicate key error")) {
      console.log(`Email "${answers.email}" is already taken.`);
    } else console.log(error.message);
  } finally {
    mongoose.connection.close();
  }
}
