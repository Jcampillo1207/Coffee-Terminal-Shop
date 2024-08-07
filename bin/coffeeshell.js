#!/usr/bin/env node

import { exec } from "child_process";

// Obtener el argumento del comando
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: coffeeshell <command>");
  console.log("Commands:");
  console.log("  init order  Start a new coffee order");
  process.exit(1);
}

// Verificar el comando
switch (args[0]) {
  case "init":
    if (args[1] === "order") {
      // Ejecutar el script de pedido
      exec("node ./src/orderCoffee.js", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
        }
        console.log(stdout);
      });
    } else {
      console.error("Unknown command.");
      process.exit(1);
    }
    break;
  default:
    console.error("Unknown command.");
    process.exit(1);
    break;
}
