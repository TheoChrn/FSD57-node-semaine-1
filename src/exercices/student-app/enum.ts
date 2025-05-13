import dotenv from "dotenv";
dotenv.config();

export const commands = [
  "list",
  "find",
  "getByNoteOver",
  "help",
  "addNote",
  "addMention",
] as const;

export type CommandValues = typeof commands;
export type CommandValue = CommandValues[number];

export const commandValues = {
  LIST: "list",
  FIND: "find",
  GET_BY_NOTE_OVER: "getByNoteOver",
  HELP: "help",
  ADD_NOTE: "addNote",
  ADD_MENTION: "addMention",
} as const satisfies Record<string, CommandValue>;

export const mentions = [
  process.env.MENTIONA!,
  process.env.MENTIONB!,
  process.env.MENTIONC!,
  process.env.MENTIOND!,
] as const;

export type MentionValues = typeof mentions;
export type MentionValue = MentionValues[number];

export const mentionValues = {
  MENTIONA: process.env.MENTIONA!,
  MENTIONB: process.env.MENTIONB!,
  MENTIONC: process.env.MENTIONC!,
  MENTIOND: process.env.MENTIOND!,
} as const satisfies Record<string, MentionValue>;
