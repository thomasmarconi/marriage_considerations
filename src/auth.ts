import postUser from "@/lib/functions/users/post-user";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    signIn({ user }) {
      postUser(user);
      return true;
    },
  },
});
