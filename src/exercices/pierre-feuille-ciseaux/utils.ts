export const extractCommandAndArgument = (value: string) =>
  value
    .replace(/^\/\s*/, "")
    .trim()
    .split(/\s+/)
    .join("");

export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "");
};

export const generateRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * max) + min;
