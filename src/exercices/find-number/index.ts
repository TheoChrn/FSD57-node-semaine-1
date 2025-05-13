const secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const maxAttempts = 10;

process.stdout.write(
  "Bienvenue dans le jeu du nombre mystère !\nDevinez un nombre entre 1 et 100. Vous avez 10 tentatives.\nVotre proposition : "
);

process.stdin.resume();
process.stdin.on("data", (chunk) => {
  if (attempts >= maxAttempts) {
    process.stdout.write(
      `Désolé, vous avez épuisé vos 10 tentatives. Le nombre était ${secretNumber}.\n`
    );
    process.exit();
  }

  const trimmed = chunk.toString().replace("\n", "").trim();
  const guess = Number(trimmed);

  if (isNaN(guess) || guess < 1 || guess > 100) {
    process.stdout.write(
      "Entrée invalide. Veuillez entrer un nombre entre 1 et 100.\nVotre proposition : "
    );
    return;
  }

  attempts++;

  if (guess === secretNumber) {
    process.stdout.write(
      `Bravo ! Vous avez trouvé le nombre ${secretNumber} en ${attempts} tentative(s).\n`
    );
    process.exit();
  } else if (guess < secretNumber) {
    process.stdout.write("C'est plus grand.\nVotre proposition : ");
  } else {
    process.stdout.write("C'est plus petit.\nVotre proposition : ");
  }
});
