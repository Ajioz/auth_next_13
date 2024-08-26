import { getToken } from "next-auth/jwt";
import { connectDB } from "../../../lib/db";
import { hashPassword, verifyPassword } from "../../../lib/auth-utill";

const handler = async (req, res) => {
  if (req.method === "PATCH") {
    let client;
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!session) {
      return res
        .status(401)
        .json({ message: "Not Authenticated", status: false, session });
    }

    const userEmail = session.email;
    const { oldPassword, newPassword } = req.body;
    try {
      client = await connectDB();
      const db = client.db();
      const user = await db.collection("users").findOne({ email: userEmail });

      const isValid = await verifyPassword(oldPassword, user.password);

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
