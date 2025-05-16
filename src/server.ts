import dotenv from "dotenv";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import querystring from "node:querystring";
import pug from "pug";
import {
  addNewStudent,
  deleteStudent,
  getStudentById,
  updateStudent,
  getStudents,
} from "utils/utils";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, "assets");

const viewPath = path.join(__dirname, "views");

const { HOST, PORT } = process.env;

let toastMessage: string | undefined;

const server = http.createServer((req, res) => {
  const url = req.url;

  const reqUrl = new URL(req.url!, `http://${req.headers.host}`);
  const searchParams = reqUrl.searchParams;
  const success = searchParams.get("success");

  if (url === "/favicon.ico") {
    res.writeHead(200, {
      "Content-type": "image/x-icon",
    });
    res.end();
    return;
  }

  if (url?.startsWith("/styles")) {
    const stylesheet = fs.readFileSync(path.join(assetsPath, url!));

    res.writeHead(200, {
      "content-type": "text/css",
    });
    res.end(stylesheet);
    return;
  }

  if (url?.startsWith("/scripts")) {
    const scripts = fs.readFileSync(path.join(assetsPath, url!));

    res.writeHead(200, {
      "content-type": "text/css",
    });
    res.end(scripts);
    return;
  }

  if (url === "/" || url?.startsWith("/?")) {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    pug.renderFile(
      path.join(viewPath, "home.pug"),
      { url, toastMessage: success ? toastMessage : undefined },
      (err, data) => {
        if (err) throw err;
        res.end(data);
      }
    );

    toastMessage = undefined;
    return;
  }

  if (url === "/add-student" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const data = querystring.parse(body);
      console.log("Données du formulaire reçues:", data);

      if (
        typeof data.name !== "string" ||
        data.name.trim() === "" ||
        typeof data.birth !== "string" ||
        data.birth.trim() === ""
      ) {
        res.writeHead(401, { "Content-type": "text/plain" });
        res.end("Les champs nom ne peuvent pas être vide");
        return;
      }

      const newStudent = {
        name: data.name,
        birth: data.birth,
      } as Student;

      addNewStudent(newStudent);
      toastMessage = "Élève ajoutée !";
      res.writeHead(301, {
        Location: "/?success=true",
      });
      res.end();
      return;
    });
    return;
  }

  if (url?.startsWith("/student/")) {
    const userId = Number(url.split("/")[2].split("?")[0]);

    if (!userId || isNaN(userId)) {
      return;
    }
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const data = querystring.parse(body);

        const method = data._method;

        if (method === "DELETE") {
          deleteStudent(userId);
          toastMessage = `Élève supprimé !`;
          res.writeHead(301, {
            Location: "/students?success=true",
          });
          res.end();
          return;
        }

        if (method === "UPDATE") {
          const userId = Number(data.id);

          const updatedStudent = {
            name: data.name,
            birth: data.birth,
          } as Student;
          toastMessage = `Élève ${updatedStudent.name} modifié !`;
          updateStudent(userId, updatedStudent);

          res.writeHead(301, {
            Location: `/student/${userId}?success=true`,
          });
          res.end();
          return;
        }
      });
      return;
    }

    const student = getStudentById(userId);

    if (!student) {
      res.writeHead(404, {
        Location: "/not-found",
      });
      pug.renderFile(path.join(viewPath, "not-found.pug"), {}, (err, data) => {
        if (err) throw err;
        res.end(data);
      });
      toastMessage = undefined;
      return;
    }

    res.writeHead(200, {
      "content-type": "text/html",
    });

    pug.renderFile(
      path.join(viewPath, "student.pug"),
      { url, student, toastMessage },
      (err, data) => {
        if (err) throw err;
        res.end(data);
      }
    );
    toastMessage = undefined;
    return;
  }

  if (url === "/students" || url?.startsWith("/students?")) {
    const students = getStudents();

    res.writeHead(200, {
      "content-type": "text/html",
    });

    pug.renderFile(
      path.join(viewPath, "students.pug"),
      { url, students, toastMessage },
      (err, data) => {
        if (err) throw err;
        res.end(data);
      }
    );
    toastMessage = undefined;
    return;
  }

  if (url === "/not-found") {
  }

  res.writeHead(404, {
    Location: "/not-found",
    content: "text/html",
  });
  pug.renderFile(path.join(viewPath, "not-found.pug"), { url }, (err, data) => {
    if (err) throw err;
    res.end(data);
  });

  return;
});

server.listen(Number(PORT), HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
