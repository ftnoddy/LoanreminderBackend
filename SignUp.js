import bcrypt from "bcrypt";
import express from "express";
import db from "./db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { email, password, password_confirm } = req.body;

  try {
    // Check if the email is already in use
    const existingUser = await db.query(
      "SELECT email FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "This email is already in use" });
    }

    // Check if passwords match
    if (password !== password_confirm) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Insert the user into the database using a Promise
    const insertUser = () => {
      return new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO users SET ?",
          { email: email, password: hashedPassword },
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });
    };

    await insertUser();

    // Create a JWT token for the registered user
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "User registered!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
