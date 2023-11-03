import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { env } from "~/env.mjs"

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
  ],

  session: { strategy: "jwt" },

  pages: { signIn: "/" },

  callbacks: {},
}
