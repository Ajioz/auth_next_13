import { getSession } from "next-auth/react";
import { connectDB } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth-utill";

const handler = async (req, res) => {
  if (req.method === "PATCH") {
    const session = await getSession({ req: req });
    console.log(session);
    if (!session) {
      return res
        .status(401)
        .json({ message: "Not Authenticated", status: false, session });
    }

    const userEmail = session.user.email;
    const { oldPassword, newPassword } = req.body;
    let client;
    try {
      client = await connectDB();
      const db = client.db();
      const user = await db.collection("users").findOne({ email: userEmail });

      const isValid = await verifyPassword(user.password, oldPassword);

      if (!isValid) {
        return res.status(403).json({
          message: "Your Password did not match!",
          status: false,
        });
      }

      const hashedPassword = await hashPassword(newPassword);
      const updateUser = await db
        .collection("users")
        .updateOne(
          { email: userEmail },
          { $set: { password: hashedPassword } }
        );

      if (updateUser) {
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
