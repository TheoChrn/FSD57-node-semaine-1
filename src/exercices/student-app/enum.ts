export const commands = [
  "list",
  "find",
  "getByNoteOver",
  "help",
  "addNote",
] as const;

export type CommandValues = typeof commands;
export type CommandValue = CommandValues[number];

export const commandValues = {
  LIST: "list",
  FIND: "find",
  GET_BY_NOTE_OVER: "getByNoteOver",
  HELP: "help",
  ADD_NOTE: "addNote",
} as const satisfies Record<string, CommandValue>;
