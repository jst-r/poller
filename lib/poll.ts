export type Poll = {
    id: number
    title: string
    description: string
} & PollData

export const POLL_TYPES = [
    "SINGLE_CHOICE",
    "MULTIPLE_CHOICE",
    "TEXT",
] as const;

export type PollType = typeof POLL_TYPES[number];

export type PollData = {
    _type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE",
    options: string[]
} | {
    _type: "TEXT",
    maxLength: number
}