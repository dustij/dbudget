import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { type NextAuthOptions, getServerSession } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { db } from "~/db"
import { mysqlTable } from "~/db/schema"

export const options: NextAuthOptions = {
  adapter: DrizzleAdapter(db, mysqlTable),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  pages: { signIn: "/" },

  callbacks: {},
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(options);
