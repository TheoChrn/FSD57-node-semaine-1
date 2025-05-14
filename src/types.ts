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
}
