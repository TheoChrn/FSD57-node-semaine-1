import { updateStudents } from "exercices/student-app/api";
import { mentionValues } from "exercices/student-app/enum";

import readline from "readline";

const getAverage = (notes: number[]) =>
  notes.reduce((acc, current) => acc + current) / notes.length;

export const extractCommandAndArgument = (value: string) => {
  const trimmedValue = value.replace(/^\/\s*/, "").trim();
  const [command, ...argumentParts] = trimmedValue.split(/\s+/);
  const argument = argumentParts.join(" ");

  return { command, argument: argument || null };
};

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "");
};

export const addNoteToStudent = (students: Student[]) => {
  rl.question(
    "A quel élève souhaitez-vous attribuer une nouvelle note ?\n",
    (student) => {
      const normalizedName = normalizeString(student);
      const existingStudent = students.find((student) =>
        normalizeString(student.name).includes(normalizedName)
      );

      if (!existingStudent) {
        console.log("Cette élève n'existe pas");
        return addNoteToStudent(students);
      }

      return askForStudentNote(existingStudent!, students);
    }
  );
};

const askForStudentNote = (student: Student, students: Student[]) => {
  rl.question("Quelle note souhaitez-vous lui attribuer ?\n", (note) => {
    const newNote = Number(note);
    const validNote = !isNaN(newNote) && newNote <= 20 && newNote >= 0;

    if (!validNote) {
      console.log(`Erreur : La note doit être comprise entre 0 et 20`);
      return askForStudentNote(student, students);
    }

    student.notes.push(newNote);

    updateStudents(students);

    console.log(`Vous avez attribuer la note de ${newNote} à ${student.name}`);
    console.log(`Voici ses nouvelles notes: ${student.notes}`);
    rl.prompt();
  });
};

export const addMentionToStudent = (students: Student[]) => {
  rl.question(
    "A quel élève souhaitez-vous attribuer une mention?\n",
    (student) => {
      const normalizedName = normalizeString(student);
      const existingStudent = students.find((student) =>
        normalizeString(student.name).includes(normalizedName)
      );

      if (!existingStudent) {
        console.log("Cet élève n'existe pas");
        return addMentionToStudent(students);
      }

      const studentAverageNote = getAverage(existingStudent.notes);

      if (studentAverageNote < 10) {
        console.log("Cet élève n'est pas éligible à la mention");
        return;
      }

      let newMention;
      if (studentAverageNote >= 10 && studentAverageNote < 12) {
        newMention = mentionValues.MENTIONA;
      } else if (studentAverageNote >= 12 && studentAverageNote < 14) {
        newMention = mentionValues.MENTIONB;
      } else if (studentAverageNote >= 14 && studentAverageNote < 16) {
        newMention = mentionValues.MENTIONC;
      } else if (studentAverageNote >= 16 && studentAverageNote <= 20) {
        newMention = mentionValues.MENTIOND;
      }

      if (existingStudent.mention === newMention) {
        console.log(`${existingStudent.name} à déjà cette mention`);
        rl.prompt();
        return;
      }

      existingStudent.mention = newMention;

      updateStudents(students);

      console.log(
        `Mention ${existingStudent.mention} ajoutée à l'élève ${existingStudent.name}`
      );
      rl.prompt();
    }
  );
};
