import { Player } from "./player.js";

//NOTE: Instead of passing all individual items like i had in the Python version
//NOTE: I can now pass them over into an Object instead using Destructuring

//NOTE: Temp variables for debugging
let player = new Player({
  name: "Olly",
  player_class: "Fighter",
});

console.log(player);
