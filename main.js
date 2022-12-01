import "./style.css";
import { initSound } from "./machine";
import { io } from "socket.io-client";

const socket = io("localhost:3000");
let synthTimeline = [];
let congaTimeline = [];
let drumsTimeline = [];

// client-side
socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  socket.on("numberOfUsers", (arg) => updateNumberOfUsers(arg));
  socket.on("updateNumberOfUsers", (arg) => updateNumberOfUsers(arg));
  socket.emit("getNumberOfUsers");
  socket.on("synthTimeline", (arg) => getTimeline("synth", arg.data));
  socket.on("addSynthTimeline", (arg) => addTimeline("synth", arg));
  socket.on("congaTimeline", (arg) => getTimeline("conga", arg.data));
  socket.on("addCongaTimeline", (arg) => addTimeline("conga", arg));
  socket.on("drumsTimeline", (arg) => getTimeline("drums", arg.data));
  socket.on("addDrumsTimeline", (arg) => addTimeline("drums", arg));
  socket.emit("getTimelines");
});

function updateNumberOfUsers(arg) {
  document.querySelector("#numberOfUsers").textContent = arg.number;
}

function getTimeline(type, timelinedata) {
  console.log(timelinedata);
  switch (type) {
    case "synth":
      synthTimeline = timelinedata;
      break;
    case "conga":
      congaTimeline = timelinedata;
      break;
    case "drums":
      drumsTimeline = timelinedata;
      break;
  }
  generateTimeline(type);
}

function addTimeline(type, data) {
  console.log("addTimeline");
  switch (type) {
    case "synth":
      synthTimeline.push(data);
      generateTimeline("synth");
      break;
    case "conga":
      congaTimeline.push(data);
      generateTimeline("conga");
      break;
    case "drums":
      drumsTimeline.push(data);
      generateTimeline("drums");
      break;
  }
}

function generateTimeline(type) {
  let timeline;
  let parent;
  switch (type) {
    case "synth":
      timeline = synthTimeline;
      parent = document.querySelector("#timeline-content-synth");
      break;
    case "conga":
      timeline = congaTimeline;
      parent = document.querySelector("#timeline-content-conga");
      break;
    case "drums":
      timeline = drumsTimeline;
      parent = document.querySelector("#timeline-content-drums");
      break;
  }
  console.log("generateTimeline");
  console.log(parent);
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  console.log(timeline);
  for (let i = 0; i < timeline.length; i++) {
    let card = document.createElement("div");
    card.classList.add("timeline-card");
    let cardContent = document.createElement("div");
    cardContent.classList.add("timeline-card-content");
    for (let x = 0; x < timeline[i].length; x++) {
      let line = document.createElement("div");
      line.classList.add("timeline-card-line");
      for (let y = 1; y < 17; y++) {
        let block = document.createElement("div");
        block.classList.add("timeline-card-block");
        if (timeline[i][x][y]) {
          block.classList.add("selected");
        }
        line.appendChild(block);
      }
      cardContent.appendChild(line);
    }
    card.appendChild(cardContent);
    parent.appendChild(card);
  }
}

export function sendTimelineBlock(type, data) {
  console.log("sendTimelineBlock");
  socket.emit("addTimeline", {
    type: type,
    data: data,
  });
}

document.querySelector("#soundButton")?.addEventListener("click", startMachine);

async function startMachine() {
  await initSound();
  document.querySelector("#soundButton")?.removeEventListener("click", startMachine);
}
