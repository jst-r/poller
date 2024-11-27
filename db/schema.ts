import { integer, jsonb, pgEnum, pgTable, primaryKey, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { POLL_TYPES } from "@/lib/poll"

export const pollTypeEnum = pgEnum("poll_type", POLL_TYPES)

export const polls = pgTable("polls", {
    // Sequential ints would allow brute force attacks
    id: uuid().defaultRandom().primaryKey(),
    createdAt: timestamp().defaultNow(),
    title: varchar().notNull(),
    description: varchar("description"),
    type: pollTypeEnum(),
    config: jsonb()
})

export const pollsRelations = relations(polls, ({ many }) => ({
    options: many(pollOptions)
}))

export const pollOptions = pgTable("poll_options", {
    id: serial().primaryKey(),
    pollId: uuid().notNull().references(() => polls.id),
    createdAt: timestamp().defaultNow(),
    text: varchar().notNull(),
})

export const pollOptionsRelations = relations(pollOptions, ({ many, one }) => ({
    poll: one(polls, { fields: [pollOptions.id], references: [polls.id] }),
    votes: many(optionsVotes)
}))

export const votes = pgTable("votes", {
    id: serial().primaryKey(),
    pollId: uuid().notNull().references(() => polls.id),
    createdAt: timestamp().defaultNow(),
})

export const votesRelations = relations(votes, ({ many, one }) => ({
    options: many(optionsVotes),
    text: one(textVotes),
}))

export const optionsVotes = pgTable("options_votes", {
    voteId: integer().notNull().references(() => votes.id),
    optionId: integer().notNull().references(() => pollOptions.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.voteId, t.optionId] }),
}))

export const optionsVotesRelations = relations(optionsVotes, ({ one }) => ({
    option: one(pollOptions, { fields: [optionsVotes.optionId], references: [pollOptions.id] }),
    vote: one(votes, { fields: [optionsVotes.voteId], references: [votes.id] }),
}))

export const textVotes = pgTable("text_votes", {
    id: serial().primaryKey(),
    voteId: integer().notNull().references(() => votes.id),
    text: varchar().notNull(),
})

export const textVotesRelations = relations(textVotes, ({ one }) => ({
    vote: one(votes, { fields: [textVotes.voteId], references: [votes.id] }),
}))