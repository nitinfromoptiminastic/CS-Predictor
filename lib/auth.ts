import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("SignIn attempt for:", user?.email);
      
      // Only allow @optiminastic.com emails
      if (user.email && user.email.endsWith("@optiminastic.com")) {
        console.log("Sign-in allowed for:", user.email);
        return true;
      }
      
      console.log("Sign-in denied for:", user.email);
      return false;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};
