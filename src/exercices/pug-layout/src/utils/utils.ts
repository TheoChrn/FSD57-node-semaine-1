import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "..", "data", "contacts.json");

console.log(filePath);

const getContacts = () => {
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

export const updateContacts = (newContact: Contact) => {
  try {
    const contacts = getContacts();

    if (!contacts) return;

    fs.writeFileSync(
      filePath,
      JSON.stringify([...contacts, newContact], null, 2)
    );
  } catch (err) {
    console.error(err);
  }
};
