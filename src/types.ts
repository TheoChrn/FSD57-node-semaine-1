export {};
declare global {
  interface Student {
    name: string;
    notes: number[];
    address: string;
    mention?: string;
  }
}
