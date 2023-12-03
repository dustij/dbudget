import { drizzle } from "drizzle-orm/planetscale-serverless"
import { connect } from "@planetscale/database"
import { Logger } from "drizzle-orm"

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params })
  }
}

// create the connection
const connection = connect({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
})

export const db = drizzle(connection, {
  logger: new MyLogger(),
})
