import "./style.css";
import javascriptLogo from "./javascript.svg";
import { setupCounter } from "./counter.js";
import { initSound, soundMachine } from "./machine";
import { io } from "socket.io-client";

const socket = io("localhost:3000");
let numberOfUsers = 0;

// client-side
socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  socket.on("numberOfUsers", (arg) => getNumberOfUsers(arg));
  socket.emit("getNumberOfUsers");
});

function getNumberOfUsers(arg) {
  document.querySelector("#numberOfUsers").textContent = arg.number;
}

document.querySelector("#soundButton")?.addEventListener("click", async () => {
  initSound();
});
