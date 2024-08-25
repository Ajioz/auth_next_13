import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { connectDB } from "../../../lib/db";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: credProvider,
});

const credProvider = () => {
  return [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      /*
        credentials: {
            email: { label: "Email", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" },
        },
      */
      async authorize(credentials, req) {
        try {
          const client = await connectDB();

          const usersCollection = client.db().collection("users");

          const user = await usersCollection.findOne({
            email: credentials.email,
          });

          if (!user) throw new Error("No user found");

          const isValidPassword = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValidPassword) throw new Error("Invalid password");

          return {
            email: user.email,
          };
        } catch (error) {
        } finally {
          client.close();
        }
      },
    }),
  ];
};

const emailProvider = () => {
  return [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ];
};
