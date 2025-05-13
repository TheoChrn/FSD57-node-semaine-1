import path from "node:path";
import fs from "node:fs";

import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "..", "..", "data", "students.json");

export const getStudents = () => {
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

export const updateStudents = (students: Student[]) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
  } catch (err) {
    console.error(err);
  }
};
