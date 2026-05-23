import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const reviews = pgTable("reviews", {
  id: serial().primaryKey(),
  authorName: text("author_name").notNull(),
  rating: integer().notNull(),
  comment: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
