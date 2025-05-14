import {
  commands,
  CommandValue,
  symboldIndex,
  SymboValue,
  weakerSymbol,
} from "exercices/pierre-feuille-ciseaux/enum";
import {
  extractCommandAndArgument,
  generateRandomNumber,
} from "exercices/pierre-feuille-ciseaux/utils";
import { normalizeString } from "exercices/student-app/utils";
import readline from "readline";

console.log("Bienvenue sur l'interface de pierre, feuille, ciseaux.");
console.log("Tapez '/start' commencer une partie");

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

let gameArray = [];

rl.on("line", (line) => {
  console.log(line);
  if (!line.startsWith("/")) {
    console.log("Erreur : La commande doit commencer par '/'\n");
    rl.prompt();
    return;
  }
  const command = extractCommandAndArgument(line);
  if (!commands.includes(command as CommandValue)) {
    console.log(`Commande non reconnue : "${command}".`);
    rl.prompt();
    return;
  }
  startGame();
});

const startGame = () => {
  rl.question("Combien de partie voulez-vous définir ?", (games) => {
    const totalGames = Number(games);

    if (isNaN(totalGames)) {
      console.log(`${totalGames} n'est pas un nombre valide`);
      return startGame();
    }

    let gameScore = {
      rounds: 0,
      playerA: 0,
      playerB: 0,
    };

    for (let i = 0; i < totalGames; i++) {
      let playerASymbol = generateRandomNumber(1, 3);
      let playerBSymbol = generateRandomNumber(1, 3);
      const winner = checkSymbols([
        symboldIndex[playerASymbol as keyof typeof symboldIndex],
        symboldIndex[playerBSymbol as keyof typeof symboldIndex],
      ]);

      winner !== "draw" && winner === "playerA"
        ? (gameScore.playerA += 1)
        : (gameScore.playerB += 1);

      gameScore.rounds++;
    }

    const winner =
      gameScore.playerA === gameScore.playerB
        ? "draw"
        : gameScore.playerA > gameScore.playerB
        ? "playerA"
        : "playerB";

    if (winner === "draw") console.log("Égalité ! Merci d'avoir joué !");
    console.log(`${winner} a gagné la partie !`);
    gameArray.push({ ...gameScore, game: games.length + 1 });

    rl.question(
      "Souhaitez-vous relancer une partie ? Répondez par 'oui' ou 'non'",
      (answer) => {
        const normalizedString = normalizeString(answer);
        if (normalizedString !== "oui" && normalizedString !== "non") {
          console.log("Valeur incorrecte merci d'avoir joué");
          process.exit();
        }

        if (normalizedString === "oui") {
          return startGame();
        }
        process.exit();
      }
    );
  });
};

const checkSymbols = (symbols: [SymboValue, SymboValue]) => {
  const [A, B] = symbols;
  if (A === B) return "draw";
  return weakerSymbol[A] === B ? "playerA" : "playerB";
};
