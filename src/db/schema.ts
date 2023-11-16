import {
  int,
  timestamp,
  mysqlTableCreator,
  primaryKey,
  varchar,
  text,
  decimal,
  mysqlEnum,
  tinyint,
  unique,
  char,
  check,
  mediumint,
} from "drizzle-orm/mysql-core"
import type { AdapterAccount } from "@auth/core/adapters"
import { relations, sql } from "drizzle-orm"
import { customAlphabet } from "nanoid"

// https://orm.drizzle.team/docs/goodies#multi-project-schema
export const mysqlTable = mysqlTableCreator((name) => `dbudget_${name}`)

const NANO_ID_LENGTH = 12
function generateNanoId() {
  const nanoid = customAlphabet(
    "0123456789abcdefghijklmnopqrstuvwxyz",
    NANO_ID_LENGTH,
  )
  return nanoid()
}

// Auth Tables --------------------------------------------

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).defaultNow(),
  image: varchar("image", { length: 255 }),
})

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
)

export const sessions = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
)

// Auth Relations --------------------------------------------

// https://planetscale.com/blog/working-with-related-data-using-drizzle-and-planetscale
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  users: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

// My tables --------------------------------------------

export const rules = mysqlTable(
  "rule",
  {
    id: char("id", { length: NANO_ID_LENGTH })
      .$defaultFn(generateNanoId)
      .primaryKey(),
    frequency: mysqlEnum("frequency", [
      "daily",
      "weekly",
      "biweekly",
      "monthly",
      "yearly",
    ]).notNull(),
    startDate: timestamp("startDate", { mode: "date" }).notNull(),
    endDate: timestamp("endDate", { mode: "date" }),
    weekday: mysqlEnum("weekday", [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]),
    dayOfMonth: tinyint("dayOfMonth"),
    monthOfYear: tinyint("monthOfYear"),
    category: varchar("category", { length: 255 }).notNull(),
  },
  (t) => ({
    uniqueCategory: unique().on(t.category),
    // TODO: checkEndDate
    // checkEndDate: sql.raw(`CHECK (endDate > startDate OR endDate IS NULL)`),
  }),
)

export const categories = mysqlTable("category", {
  name: varchar("name", { length: 255 }).primaryKey(),
  parent: mysqlEnum("parent", [
    "income",
    "fixed",
    "variable",
    "discretionary",
    "obligation",
    "leakage",
    "savings",
  ]).notNull(),
  ruleId: char("ruleId", { length: NANO_ID_LENGTH }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .defaultNow()
    .onUpdateNow()
    .notNull(),
})

export const amounts = mysqlTable(
  "amount",
  {
    id: char("id", { length: NANO_ID_LENGTH })
      .$defaultFn(generateNanoId)
      .primaryKey(),
    amount: decimal("amount").notNull(),
    year: mediumint("year").notNull(),
    month: mysqlEnum("month", [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ]).notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (t) => ({
    yearMonthCategoryIdx: unique().on(t.year, t.month, t.category),
    // TODO: checkYearIsReasonable
    // checkYearIsReasonable: check(
    //   t.year.name,
    //   sql.raw(`year > 2000 AND year < 2100`),
    // ),
  }),
)

// My Relations --------------------------------------------

export const rulesRelations = relations(rules, ({ one }) => ({
  category: one(categories, {
    fields: [rules.category],
    references: [categories.name],
  }),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  rule: one(rules, {
    fields: [categories.ruleId],
    references: [rules.id],
  }),
  amounts: many(amounts),
}))

export const amountsRelations = relations(amounts, ({ one }) => ({
  category: one(categories, {
    fields: [amounts.category],
    references: [categories.name],
  }),
}))
