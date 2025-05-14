import { shuffle, users } from "exercices/shuffle/src/utils";
import http from "node:http";

const server = http.createServer((req, res) => {
  if (!req.url) return;

  const url = req.url;

  if (url === "/") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    res.end(`
			<!DOCTYPE html>
			<html lang="fr">
				<head>
				 <title>Root</title>
				</head>
				<body>
					<ul>${users.map((user) => `<li>${user}</li>`)}</ul>
				</body>
			</html>
		`);
    return;
  }

  if (url === "/shuffle") {
    const shuffledUsers = shuffle(users);

    res.writeHead(200, {
      "Content-type": "text/html",
    });

    res.end(`
                  <!DOCTYPE html>
                  <html lang="fr">
                      <head>
                       <title>Shuffle</title>
                      </head>
                      <body>
                         <ul>${shuffledUsers.map(
                           (user) => `<li>${user}</li>`
                         )}</ul>
                      </body>
                  </html>
              `);
    return;
  }
});

server.listen(3000, "localhost", () => {
  console.log(`Server running on http://localhost:3000`);
});
