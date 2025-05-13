import { Student } from "exercices/fs";
import fs from "node:fs";
import path from "node:path";

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "");
};

const filePath = path.join(__dirname, "..", "..", "data", "students.json");

const commands = ["list", "find", "getByNoteOver", "help"] as const;

const splitCommandAndArgument = (value: string) => {
  const trimmedValue = value.replace(/^\/\s*/, "").trim();
  const [command, ...argumentParts] = trimmedValue.split(/\s+/);
  const argument = argumentParts.join(" ");

  return { command, argument: argument || null };
};

export type CommandValues = typeof commands;
export type CommandValue = CommandValues[number];

const commandValues = {
  LIST: "list",
  FIND: "find",
  GET_BY_NOTE_OVER: "getByNoteOver",
  HELP: "help",
} as const satisfies Record<string, CommandValue>;

const getStudents = () => {
  try {
    const res = fs.readFileSync(filePath, {
      encoding: "utf-8",
    });
    return JSON.parse(res) as Student[];
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier des étudiants :", err);
    return undefined;
  }
};

process.stdout.write(
  "Bienvenue sur l'interface de gestion des étudiants.\nTapez '/help' pour afficher les commandes disponibles.\n"
);

process.stdin.on("data", (chunk) => {
  const value = chunk.toString().replace("\n", "");

  if (!value.startsWith("/")) {
    process.stdout.write("Erreur : La commande doit commencer par '/'\n");
    return;
  }

  const { command, argument } = splitCommandAndArgument(value);

  if (!commands.includes(command as CommandValue)) {
    process.stdout.write(
      `Commande non reconnue : "${command}".\nUtilisez '/help' pour la liste des commandes disponibles.\n`
    );
    return;
  }

  if (command === commandValues.HELP) {
    process.stdout.write(
      `Commandes disponibles :\n` +
        `- '/list' : Afficher la liste complète des étudiants\n` +
        `- '/find [nom]' : Rechercher des étudiants par nom\n` +
        `- '/getByNoteOver [note]' : Lister les étudiants ayant une note supérieure à la valeur indiquée\n`
    );
    return;
  }

  const students = getStudents();
  if (!students) {
    console.log("Erreur : Aucun étudiant n'a été trouvé");
    return;
  }

  if (command === commandValues.LIST) {
    console.log("Liste complète des étudiants :");
    console.table(students);
    return;
  } else if (command === commandValues.FIND) {
    const validArg = argument && isNaN(Number(argument));

    if (!validArg) {
      console.log(`Erreur : "${argument}" n'est pas un nom valide`);
      return;
    }

    const studentsDetails = students.filter((student) =>
      normalizeString(student.name).includes(normalizeString(argument))
    );

    if (!studentsDetails.length) {
      console.log(`Aucun étudiant trouvé pour le nom "${argument}"`);
      return;
    }

    console.log(`Résultats de recherche pour "${argument}" :`);
    console.table(studentsDetails);
    return;
  } else if (command === commandValues.GET_BY_NOTE_OVER) {
    const validArg = !isNaN(Number(argument));
    const validNote = Number(argument) <= 20 && Number(argument) >= 0;

    if (!validArg) {
      console.log(`Erreur : "${argument}" doit être un nombre`);
      return;
    }

    if (!validNote) {
      console.log(`Erreur : La note doit être comprise entre 0 et 20`);
      return;
    }

    const studentsDetails = students.filter((student) =>
      student.notes.some((note) => note > Number(argument))
    );

    if (!studentsDetails.length) {
      console.log(
        `Aucun étudiant ayant une note supérieure à ${argument} n'a été trouvé`
      );
      return;
    }

    console.log(
      `Étudiants ayant obtenu au moins une note supérieure à ${argument} :`
    );
    console.table(studentsDetails);
    return;
  }
});
