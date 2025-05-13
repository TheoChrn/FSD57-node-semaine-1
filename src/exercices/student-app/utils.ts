import { Student } from "exercices/fs";
import { updateStudents } from "exercices/student-app/api";
import readline from "readline";

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

export const askForStudent = (students: Student[]) => {
  rl.question(
    "A quel élève souhaitez-vous attribuer une nouvelle note ?\n",
    (student) => {
      const normalizedName = normalizeString(student);
      const existingStudent = students.find((student) =>
        normalizeString(student.name).includes(normalizedName)
      );

      if (!existingStudent) {
        console.log("Cette élève n'existe pas");
        return askForStudent(students);
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
  });
};
