// Without a definded matcher, next-auth will be used for entire project
// https://next-auth.js.org/configuration/nextjs#basic-usage
// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export { default } from "next-auth/middleware"

// negative lookahead to match all except specific paths
// https://www.regular-expressions.info/lookaround.html
export const config = { matcher: ["/dashboard"] }
