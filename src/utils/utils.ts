import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "..", "data", "students.json");

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "");
};

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

export const addNewStudent = (newStudent: Student) => {
  try {
    const students = getStudents();

    if (!students) {
      saveFile([{ ...newStudent, id: 1 }]);
      return;
    }

    saveFile([...students, { ...newStudent, id: students.length + 2 }]);
  } catch (err) {
    console.error(err);
  }
};

const saveFile = (students: Student[]) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
  } catch (err) {
    console.error(err);
  }
};

export const deleteStudent = (userId: number) => {
  const student = getStudentById(userId);

  if (!student) return;

  const students = getStudents();

  const newStudents = students!.filter((student) => student.id !== userId);

  saveFile(newStudents);
};

export const getStudentById = (id: number) => {
  const students = getStudents();
  return students?.find((student) => student.id === id);
};

export const updateStudent = (userId: number, updatedStudent: Student) => {
  const student = getStudentById(userId);

  if (!student) return;

  const students = getStudents();

  const newStudents = students!.map((student) =>
    student.id === userId ? { ...updatedStudent, id: userId } : student
  );

  saveFile(newStudents);
};
