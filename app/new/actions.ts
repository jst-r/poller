"use server";

import { db } from "@/db";
import { PollSchema, pollSchema } from "./schema";
import { pollOptions, polls } from "@/db/schema";



export async function createPoll(formData: PollSchema) {
  const { data, error } = pollSchema.safeParse(formData);
  if (error) {
    throw error;
  }

  const poll = {
    title: data.title,
    description: data.description,
    type: data.type,
    config: {},
  };

  if (poll.type === "TEXT") {
    poll.config = {
      maxLength: data.maxLength,
    };
  }

  const returned = await db.insert(polls).values(poll).returning({ id: polls.id });
  const { id } = returned[0];

  if (poll.type === "MULTIPLE_CHOICE" || poll.type === "SINGLE_CHOICE") {
    db.insert(pollOptions).values(data.options.map((option) => ({ pollId: id, text: option.text })));
  }
}