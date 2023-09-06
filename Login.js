import { Router } from "express";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { db } from "./db"; 

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    db(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ message: "Internal server error" });
        }

        if (results.length === 0) {
          return res.status(400).json({ message: "Invalid Credentials" });
        }

        const user = results[0];

        if (await compare(password, user.password)) {
          const token = sign(
            { user_id: user.id, email },
            process.env.JWT_SECRET, 
            {
              expiresIn: "2h",
            }
          );

          return res.status(200).json({ token });
        } else {
          return res.status(400).json({ message: "Invalid Credentials" });
        }
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
