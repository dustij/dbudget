import {
  int,
  timestamp,
  mysqlTableCreator,
  primaryKey,
  varchar,
  text,
  decimal,
  mysqlEnum,
  unique,
  char,
  mediumint,
} from "drizzle-orm/mysql-core"
import type { AdapterAccount } from "@auth/core/adapters"
import { relations, sql } from "drizzle-orm"
import { customAlphabet } from "nanoid"

// https://orm.drizzle.team/docs/goodies#multi-project-schema
export const mysqlTable = mysqlTableCreator((name) => `dbudget_${name}`)

// Constants --------------------------------------------

const NANO_ID_LENGTH = 12
function generateNanoId() {
  const nanoid = customAlphabet(
    "0123456789abcdefghijklmnopqrstuvwxyz",
    NANO_ID_LENGTH,
  )
  return nanoid()
}

const MONTHS: Readonly<[string, ...string[]]> = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
]
const DAYS: Readonly<[string, ...string[]]> = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
]

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
  categories: many(categories),
  amounts: many(amounts),
  rules: many(rules),
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
    userId: varchar("userId", { length: 255 }).notNull(),
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
    dayOfMonth: mysqlEnum("dayOfMonth", DAYS),
    monthOfYear: mysqlEnum("monthOfYear", MONTHS),
    category: varchar("category", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (t) => ({
    uniqueCategoryUserId: unique().on(t.category, t.userId),
  }),
)

export const categories = mysqlTable(
  "category",
  {
    id: char("id", { length: NANO_ID_LENGTH })
      .$defaultFn(generateNanoId)
      .primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
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
  },
  (t) => ({
    uniqueNameUserId: unique().on(t.name, t.userId),
  }),
)

export const amounts = mysqlTable(
  "amount",
  {
    id: char("id", { length: NANO_ID_LENGTH })
      .$defaultFn(generateNanoId)
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    amount: decimal("amount").notNull(),
    year: mediumint("year").notNull(),
    month: mysqlEnum("month", MONTHS).notNull(),
    categoryId: varchar("categoryId", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (t) => ({
    uniqueYearMonthCategoryUserId: unique().on(
      t.year,
      t.month,
      t.categoryId,
      t.userId,
    ),
  }),
)

// My Relations --------------------------------------------

export const rulesRelations = relations(rules, ({ one }) => ({
  categories: one(categories, {
    fields: [rules.category],
    references: [categories.id],
  }),
  users: one(users, {
    fields: [rules.userId],
    references: [users.id],
  }),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  rules: one(rules, {
    fields: [categories.ruleId],
    references: [rules.id],
  }),
  amounts: many(amounts),
  users: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
}))

export const amountsRelations = relations(amounts, ({ one }) => ({
  categories: one(categories, {
    fields: [amounts.categoryId],
    references: [categories.id],
  }),
  users: one(users, {
    fields: [amounts.userId],
    references: [users.id],
  }),
}))
