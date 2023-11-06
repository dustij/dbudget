import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import { type NextAuthOptions, getServerSession } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { db } from "~/db"
import { mysqlTable, users } from "~/db/schema"

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

  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client.
      if (session.user) {
        session.user.id = token.id
      }
      return session
    },

    async jwt({ token, account, profile }) {
      // Persist the user id to the token right after signin
      if (account) {
        const user = (await db
          .select()
          .from(users)
          .where(eq(users.email, token.email as string))) as { id: string }[]
        token.id = user[0].id
      }
      return token
    },
  },
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(options)
