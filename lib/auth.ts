import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          hd: "optiminastic.com", // Restrict to Optiminastic domain
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow @optiminastic.com emails
      if (user.email && user.email.endsWith("@optiminastic.com")) {
        return true;
      }
      return false;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
