import dotenv from "dotenv";
dotenv.config();

export const commands = ["start"] as const;

export type CommandValues = typeof commands;
export type CommandValue = CommandValues[number];

export const commandValues = {
  START: "start",
} as const satisfies Record<string, CommandValue>;

export const symbols = ["pierre", "feuille", "ciseaux"] as const;

export type SymbolValues = typeof symbols;
export type SymboValue = SymbolValues[number];

export const symboldValues = {
  PIERRE: "pierre",
  FEUILLE: "feuille",
  CISEAUX: "ciseaux",
} as const satisfies Record<string, SymboValue>;

export const symboldIndex = {
  1: symboldValues.PIERRE,
  2: symboldValues.FEUILLE,
  3: symboldValues.CISEAUX,
} as const satisfies Record<number, SymboValue>;

export const weakerSymbol = {
  [symboldValues.PIERRE]: symboldValues.CISEAUX,
  [symboldValues.CISEAUX]: symboldValues.FEUILLE,
  [symboldValues.FEUILLE]: symboldValues.PIERRE,
};
