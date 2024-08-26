import { hashPassword } from "../../../lib/auth-utill";
import { connectDB } from "../../../lib/db";

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const signupHandler = async (req, res) => {
  if (req.method === "POST") {
    let client;
    try {
      const { email, password } = req.body;
      client = await connectDB();
      const db = client.db();

      if (!isValidEmail(email)) {
        return res
          .status(422)
          .json({ status: false, message: "Invalid email" });
      }

      if (!password || password.trim().length < 7 === "") {
        return res.status(422).json({
          status: false,
          message: "Invalid input - above seven character required",
        });
      }

      const isUserExist = await db.collection("users").findOne({ email });

      if (isUserExist)
        return res
          .status(422)
          .json({ status: false, message: "User already exist" });

      const hashedPassword = await hashPassword(password);

      const newUser = { email, password: hashedPassword };
      await db.collection("users").insertOne(newUser);

      return res
        .status(201)
        .json({ status: true, message: "successfully added user" });
    } catch (error) {
      console.error("Error processing request:", error);
      return res
        .status(500)
        .json({ message: "Failed to send message", status: false });
    } finally {
      client.close();
    }
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", status: false });
  }
};


export default signupHandler;