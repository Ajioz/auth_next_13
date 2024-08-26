import { getSession } from "next-auth/react";
import { connectDB } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth-utill";

const handler = async (req, res) => {
  if (req.method === "PATCH") {
    const session = await getSession({ req: req });
    if (!session) {
      return res
        .status(401)
        .json({ message: "Not Authenticated", status: false });
    }

    const userEmail = session.user.email;
    const { oldPassword, newPassword } = req.body;
    let client;
    try {
      client = await connectDB();
      const db = client.db();
      const user = await db.collection("users").findOne({ userEmail });

      const hashCheck = await hashPassword(oldPassword);
      const isValid = await verifyPassword(user.password, hashCheck);

      if (!isValid) {
        return res.status(422).json({
          message: "Your Password did not match!",
          status: false,
        });
      }
      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
      const result = await db.collection("users").save(user);
      if (result) {
        return res
          .status(201)
          .json({ status: true, message: "password updated!" });
      }
    } catch (error) {
      return res
        .status(422)
        .json({ message: "Could not connect to database", status: false });
    } finally {
      client.close();
    }
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", status: false });
  }
};

export default handler;
