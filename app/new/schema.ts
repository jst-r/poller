import { POLL_TYPES } from "@/lib/poll";
import { z } from "zod";

export const pollSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.enum(POLL_TYPES),
  options: z.array(z.object({
    text: z.string(),
  })),
  maxLength: z.number(),
});

export type PollSchema = z.infer<typeof pollSchema>;