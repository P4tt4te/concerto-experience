import * as Tone from "tone";

const INSTRUMENTS = [
  {
    name: "Synth",
    value: "synth",
    notes: ["C4", "E4", "E5", "F4", "G4", "J4"],
  },
  {
    name: "fmSynth",
    value: "fmsynth",
    notes: ["C4", "E4", "E5", "F4", "G4", "J4", "TEST"],
  },
];
let INSTRUMENT_SELECTION = "";

export async function initSound() {
  await Tone.start();
  console.log("audio is ready");
  document
    .querySelector("#instrument-selector")
    .addEventListener("change", readInstrumentSelection);
  document
    .querySelector("#machine-play")
    .addEventListener("click", soundMachine);
}

//lit l'instrument selectionné et vérifie si il existe
function readInstrumentSelection() {
  let block = document.querySelector("#instrument-selector");
  console.log(block.value);
  if (block.value === "") {
    block.value = "synth";
  }
  INSTRUMENT_SELECTION = block.value;
  generateMachineGrid(INSTRUMENT_SELECTION);
}

//génère la grille de la machine en fonction de l'instrument selectionné
function generateMachineGrid(selection) {
  const parent = document.querySelector(".machine-grid");
  let objSelection = INSTRUMENTS.filter((item) => item.value === selection);
  let notes = objSelection[0].notes;
  console.log(notes);
  let noteslength = notes.length;
  console.log(noteslength);

  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  for (let i = 0; i < noteslength; i++) {
    let line = document.createElement("div");
    line.classList.add("machine-grid-line");
    line.dataset.name = notes[i];
    let name = document.createElement("span");
    name.textContent = notes[i];
    line.appendChild(name);
    console.log("newline");
    for (let y = 0; y < 16; y++) {
      let block = document.createElement("div");
      block.classList.add("machine-grid-block");
      block.dataset.selected = "false";
      block.addEventListener("click", (e) => {
        let selectedblock = e.target;
        console.log(selectedblock);
        console.log(selectedblock.dataset.selected);
        console.log(selectedblock.dataset.selected.includes("false"));
        if (selectedblock.dataset.selected.includes("false")) {
          selectedblock.dataset.selected = "true";
          selectedblock.classList.add("selected");
        } else if (selectedblock.dataset.selected.includes("true")) {
            selectedblock.dataset.selected = "false";
            selectedblock.classList.remove("selected");
          }
      });
      line.appendChild(block);
      console.log("new block");
    }
    parent.appendChild(line);
  }
  console.log(objSelection);
}

//lit les blocks selectionnés de la machine et joue le son
function readMachineSelection() {
  let machineGrid = document.querySelector(".machine-grid");
  console.log(machineGrid);
  if (machineGrid.childElementCount > 0) {
    let machineGridLength = machineGrid.childElementCount;
    for (let i = 0; i < machineGridLength; i++) {
      let child = machineGrid.children[i];
      console.log(child);
      let childName = child.dataset.name;
      console.log(childName);
    }
  }
}

export function soundMachine() {
  let data = [];
  data = readMachineSelection();
  const synth = new Tone.Synth().toDestination();
  const now = Tone.now();
  for (let i = 0; i < 3; i++) {
    synth.triggerAttackRelease("C4", "8n", now + i);
    synth.triggerAttackRelease("E4", "8n", now + i + 0.4);
    synth.triggerAttackRelease("G4", "8n", now + i + 0.8);
  }
}
