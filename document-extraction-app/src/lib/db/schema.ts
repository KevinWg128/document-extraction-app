import { pgTable, text, timestamp, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";

// Better-auth required tables

export const user = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    idToken: text("idToken"),
    password: text("password"), // For email/password auth
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => ({
    providerAccountIdx: index("provider_account_idx").on(table.providerId, table.accountId),
  })
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Custom table for document extraction history

export const documents = pgTable(
  "documents",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    fileName: text("fileName").notNull(),
    fileSize: integer("fileSize").notNull(),
    extractedData: jsonb("extractedData").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("documents_user_id_idx").on(table.userId),
    createdAtIdx: index("documents_created_at_idx").on(table.createdAt),
  })
);
