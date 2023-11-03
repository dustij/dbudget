import { type Config } from "drizzle-kit"

import { env } from "~/env.mjs"

export default {
  schema: "./src/db/schema",
  driver: "mysql2",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["dbudget_*"],
} satisfies Config
