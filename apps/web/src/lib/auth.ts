import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {
  usersTable,
  accountsTable,
  authSessionsTable,
  verificationTokensTable,
} from "@odyssey/db";

function getAuthDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for auth");
  return drizzle({ client: neon(url) });
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(getAuthDb(), {
    usersTable,
    accountsTable,
    sessionsTable: authSessionsTable,
    verificationTokensTable,
  }),
  providers: [Google],
  pages: {
    signIn: "/",
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
