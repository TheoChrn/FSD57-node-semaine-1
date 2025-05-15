import dotenv from "dotenv";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import querystring from "node:querystring";
import pug from "pug";
import { updateContacts } from "exercices/pug-layout/src/utils/utils";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, "assets");

const viewPath = path.join(__dirname, "views");

const { HOST, PORT } = process.env;

const server = http.createServer((req, res) => {
  const url = req.url;

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

  if (url?.startsWith("/?")) {
    const reqUrl = new URL(req.url!, `http://${req.headers.host}`);
    const searchParams = reqUrl.searchParams;
    const success = searchParams.get("success");

    res.writeHead(200, {
      "content-type": "text/html",
    });

    pug.renderFile(
      path.join(viewPath, "home.pug"),
      { url, success },
      (err, data) => {
        if (err) throw err;
        res.end(data);
      }
    );
    return;
  }

  if (url === "/contact-me") {
    if (req.method === "POST") {
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
          typeof data.email !== "string" ||
          data.email.trim() === "" ||
          typeof data.content !== "string" ||
          data.content.trim() === ""
        ) {
          res.writeHead(401, { "Content-type": "text/plain" });
          res.end("Les champs nom ne peuvent pas être vide");
          return;
        }

        const newContact = {
          name: data.name,
          email: data.email,
          content: data.content,
        } as Contact;

        console.log("Nouveau contact à ajouter:", newContact);
        updateContacts(newContact);
        res.writeHead(301, {
          Location: "/?success=true",
        });
        res.end();
        return;
      });
      return;
    }

    res.writeHead(200, {
      "content-type": "text/html",
    });

    pug.renderFile(
      path.join(viewPath, "contact-me.pug"),
      { url },
      (err, data) => {
        if (err) throw err;
        res.end(data);
      }
    );
    return;
  }
});

server.listen(Number(PORT), HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
