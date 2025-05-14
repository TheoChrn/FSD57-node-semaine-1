export const users = ["Alan", "Sophie", "Bernard", "Elie"];

export const shuffle = (arr: string[] | number[]) => {
  if (!Array.isArray(arr)) {
    return [];
  }

  const copy = [...arr];
  let currentIndex = copy.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [copy[currentIndex], copy[randomIndex]] = [
      copy[randomIndex],
      copy[currentIndex],
    ];
  }

  return copy;
};
