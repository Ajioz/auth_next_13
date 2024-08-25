import { connectDB } from "../../../lib/db";

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const signupHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await connectDB();
    const db = client.db();

    if (!isValidEmail(email)) {
      return res.status(422).json({ status: false, message: "Invalid email" });
    }

    if (!password || password.trim() === "") {
      return res.status(422).json({ status: false, message: "Invalid input" });
    }

    const newUser = { email, password };
    const user = db.collection("users").insertOne();
  } catch (error) {}
};
