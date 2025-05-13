import fs from "node:fs";
import path from "node:path";

const getAverage = (notes: number[]) =>
  notes.reduce((acc, current) => acc + current) / notes.length;

export interface Student {
  name: string;
  notes: number[];
  address: string;
}

const filePath = path.join(__dirname, "...", "data", "student.txt");

// 1
fs.readFile(
  filePath,
  {
    encoding: "utf-8",
  },
  (err, data) => {
    if (err) {
      console.error(err);
      process.exit();
    }
    // console.log(data);
  }
);

//1 bis
const getStudents = () => {
  try {
    const res = fs.readFileSync(filePath, {
      encoding: "utf-8",
    });
    return JSON.parse(res);
  } catch (err) {
    console.error(err);
  }
};

const students: Student[] = getStudents();

const studentWithAverage = students.map((student) => ({
  ...student,
  averageNote: getAverage(student.notes),
}));

// 2
const studentsWithAverageOver17 = studentWithAverage.filter(
  (student) => student.averageNote > 17
);

// 3
const studentWithMaxNote = studentWithAverage.reduce(
  (currentStudent, nextStudent) => {
    const nextStudentMaxNote = Math.max(...nextStudent.notes);
    const currentStudentMaxNote = Math.max(...currentStudent.notes);

    return nextStudentMaxNote > currentStudentMaxNote
      ? nextStudent
      : currentStudent;
  }
);

const sortedByName = studentWithAverage.toSorted((a, b) =>
  a.name > b.name ? 1 : -1
);

const sortedByAverageNote = studentWithAverage.toSorted((a, b) => {
  const averageStudentA = getAverage(a.notes);
  const averageStudentB = getAverage(b.notes);

  return averageStudentA > averageStudentB ? 1 : -1;
});

// console.log(studentsWithNoteOver17);
// console.log(studentWithMaxNote);
// console.log(sortedByName);
// console.log(sortedByAverageNote);
