import { getStudents } from "exercices/student-app/api";
import {
  commands,
  CommandValue,
  commandValues,
} from "exercices/student-app/enum";
import {
  askForStudent,
  extractCommandAndArgument,
  normalizeString,
  rl,
} from "exercices/student-app/utils";

rl.setPrompt("Bienvenue sur l'interface de gestion des étudiants.\n");
rl.prompt();

rl.setPrompt("Tapez '/help' pour afficher les commandes disponibles.\n");
rl.prompt();

rl.on("line", (line) => {
  if (!line.startsWith("/")) {
    console.log("Erreur : La commande doit commencer par '/'\n");
    rl.prompt();
    return;
  }
  const { command, argument } = extractCommandAndArgument(line);
  if (!commands.includes(command as CommandValue)) {
    console.log(`Commande non reconnue : "${command}".`);
    rl.prompt();
    return;
  }
  if (command === commandValues.HELP) {
    console.log(
      `Commandes disponibles :\n` +
        `- '/list' : Afficher la liste complète des étudiants\n` +
        `- '/find [nom]' : Rechercher des étudiants par nom\n` +
        `- '/getByNoteOver [note]' : Lister les étudiants ayant une note supérieure à la valeur indiquée\n` +
        `- '/addNote' : Permet d'ajouter une note à un élève\n`
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
    const validNote =
      !isNaN(Number(argument)) &&
      Number(argument) <= 20 &&
      Number(argument) >= 0;

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
  } else if (command === commandValues.ADD_NOTE) {
    if (argument) {
      console.log("Aucun argument nécessaire pour cette commande");
      rl.prompt();
      return;
    }
    askForStudent(students);
    return;
  }
});
