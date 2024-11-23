import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const polls = pgTable("polls", {
    // Sequential ints would allow brute force attacks
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    title: varchar("title").notNull(),
    description: varchar("description"),
})