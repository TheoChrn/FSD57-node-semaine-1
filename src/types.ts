export {};
declare global {
  interface Student {
    name: string;
    notes: number[];
    address: string;
    mention?: string;
  }

  interface User {
    email: string;
    nom: string;
    role: "admin" | "utilisateur" | "modérateur";
  }

  interface Contact {
    name: string;
    email: string;
    content: string;
  }
}
