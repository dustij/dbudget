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
    /**
     * Normally, when you sign in with an OAuth provider and another account with the same
     * email address already exists, the accounts are not linked automatically. Automatic
     * account linking on sign in is not secure between arbitrary providers and is
     * disabled by default
     * https://next-auth.js.org/configuration/providers/oauth#automatic-account-linking
     */
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
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
        if (!user[0]) {
          throw new Error("User not found")
        }
        if (user.length > 1) {
          throw new Error("Multiple users found with the same email address")
        }
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
