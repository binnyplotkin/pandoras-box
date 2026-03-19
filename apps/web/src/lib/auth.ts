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

function createAdapter() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for auth");
  const db = drizzle({ client: neon(url) });
  return DrizzleAdapter(db, {
    usersTable,
    accountsTable,
    sessionsTable: authSessionsTable,
    verificationTokensTable,
  });
}

export const { handlers, signIn, signOut, auth } = NextAuth(() => ({
  adapter: createAdapter(),
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
}));
