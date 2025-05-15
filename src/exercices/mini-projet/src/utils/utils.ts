import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "..", "api", "data.json");

const viewPath = path.join(__dirname, "..", "views");
const headerPath = path.join(viewPath, "header.html");
const footerPath = path.join(viewPath, "footer.html");
const navPath = path.join(viewPath, "navigation.html");

const header = fs.readFileSync(headerPath, { encoding: "utf8" });
const footer = fs.readFileSync(footerPath, { encoding: "utf8" });
const navigation = fs.readFileSync(navPath, { encoding: "utf8" });

export const getUsers = () => {
  try {
    const res = fs.readFileSync(filePath, {
      encoding: "utf-8",
    });
    return JSON.parse(res) as User[];
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier des étudiants :", err);
    return undefined;
  }
};

export const updateUsers = (users: User[]) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error(err);
  }
};

export const innerHTML = (html: string) =>
  `${header}${navigation}<main>${html}</main>${footer}`;
