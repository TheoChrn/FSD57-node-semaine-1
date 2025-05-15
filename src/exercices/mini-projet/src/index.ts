import http from "node:http";
import pug from "pug";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import querystring from "node:querystring";
import { fileURLToPath } from "node:url";
import { normalizeString } from "exercices/pierre-feuille-ciseaux/utils";
import {
  getUsers,
  innerHTML,
  updateUsers,
} from "exercices/mini-projet/src/utils/utils";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viewPath = path.join(__dirname, "views");

const { HOST, PORT } = process.env;

const loggedUser = {
  name: {
    first: "Jean",
    last: "Dupont",
  },
  age: 36,
  birthdate: new Date("1986-04-18"),
  location: {
    zipcode: "77420",
    city: "Champs-sur-Marne",
  },
  isAdmin: true,
};

const compile = pug.compileFile(path.join(viewPath, "logged-user.pug"), {
  pretty: true,
});

console.log(compile(loggedUser));

const server = http.createServer((req, res) => {
  const users = getUsers();

  if (!users) return;

  const url = req.url;

  if (url === "/favicon.ico") {
    res.writeHead(200, {
      "Content-type": "image/x-icon",
    });
    res.end();
    return;
  }

  if (url === "/protected") {
    const filePath = path.join(__dirname, "views", "protected.pug");

    pug.renderFile(filePath, { user: { isAdmin: true } }, (err, data) => {
      if (err) throw err;
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      res.end(innerHTML(data));
    });
    return;
  }

  if (url?.startsWith("/user?name=")) {
    const reqUrl = new URL(req.url!, `http://${req.headers.host}`);

    const searchParams = reqUrl.searchParams;
    const userName = searchParams.get("name");

    if (!userName) {
      res.writeHead(404, { "Content-type": "text/plain" });
      res.end("Aucun utilisateur trouvé");
      return;
    }

    const user = users?.find(
      (user) => normalizeString(user.nom) === normalizeString(userName!)
    );

    if (!user) {
      res.writeHead(404, { "Content-type": "text/plain" });
      res.end("Aucun utilisateur trouvé");
      return;
    }

    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(
      innerHTML(`<h1>Détails de ${user.nom}</h1><ul>
            <li>
             ${user.email}
            </li>
            <li>
             ${user.role}
               </li>
               </ul>`)
    );
    return;
  }

  if (url === "/") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(
      innerHTML(
        `<h1>Liste des utilisateurs</h1><ul>${users
          ?.map(
            (user) => `<li>
         
                <a href="/user?name=${user.nom.toString()}">
                  ${user.nom}
                </a>
        </li>`
          )
          .join("")}</ul>`
      )
    );
    return;
  }

  if (url === "/add-user" && req.method === "GET") {
    const form = fs.readFileSync(path.join(viewPath, "form.html"), {
      encoding: "utf8",
    });
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(innerHTML(form));
    return;
  }

  if (url === "/add-user" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const data = querystring.parse(body);

      if (
        !data.name ||
        (typeof data.name === "string" &&
          data.name.trim() === "" &&
          data.email) ||
        (typeof data.email === "string" && data.email.trim() === "")
      ) {
        res.writeHead(401, { "Content-type": "text/plain" });
        res.end("Les champs nom ne peuvent pas être vide");
        return;
      }

      const newUser = {
        email: data.email,
        nom: data.name,
        role: "utilisateur",
      } as User;

      updateUsers([...users, newUser]);
      res.writeHead(301, {
        Location: "/",
      });
      res.end();
      return;
    });
    return;
  }
});

server.listen(Number(PORT), HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
