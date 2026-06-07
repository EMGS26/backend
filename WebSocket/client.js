const WebSocket = require("ws");
const readline = require("readline");

const ws = new WebSocket("ws://192.168.0.130:3001");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

ws.on("open", () => ask());
ws.on("message", (data) => console.log("Reçu:", data.toString()));

function ask() {
  rl.question("Type > ", (type) => {
    rl.question("Data > ", (data) => {
      ws.send(JSON.stringify({ type, data: data || null }));
      ask();
    });
  });
}