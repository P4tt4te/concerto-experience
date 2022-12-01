import * as Tone from "tone";

const INSTRUMENTS = [
  {
    name: "Synth",
    value: "synth",
    notes: ["A4", "B4", "C4", "E4", "F4", "G4"],
    options: {
      volume: -8,
      detune: 0,
      portamento: 0,
      envelope: {
        attack: 0.05,
        attackCurve: "linear",
        decay: 0.3,
        decayCurve: "exponential",
        release: 0.8,
        releaseCurve: "exponential",
        sustain: 0.4,
      },
      filter: {
        Q: 1,
        detune: 0,
        frequency: 0,
        gain: 0,
        rolloff: -12,
        type: "lowpass",
      },
      filterEnvelope: {
        attack: 0.001,
        attackCurve: "linear",
        decay: 0.7,
        decayCurve: "exponential",
        release: 0.8,
        releaseCurve: "exponential",
        sustain: 0.1,
        baseFrequency: 300,
        exponent: 2,
        octaves: 4,
      },
      oscillator: {
        detune: 0,
        frequency: 440,
        partialCount: 8,
        partials: [
          1.2732395447351628, 0, 0.4244131815783876, 0, 0.25464790894703254, 0,
          0.18189136353359467, 0,
        ],
        phase: 0,
        type: "square8",
      },
    },
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
    let tab = new Array(machineGridLength);
    for (let i = 0; i < machineGridLength; i++) {
      let child = machineGrid.children[i];
      console.log(child);
      let childName = child.dataset.name;
      console.log(childName);
      let tabLine = new Array(16);
      for (let y = 0; y < 17; y++) {
        let childblock = child.children[y];
        if (y > 0) {
          if (childblock.dataset.selected.includes("true")) {
            tabLine[y] = true;
          } else {
            tabLine[y] = false;
          }
        } else {
          tabLine[0] = childName;
        }
      }
      tab[i] = tabLine;
    }
    return tab;
  }
}

export function soundMachine() {
  let data = [];
  data = readMachineSelection();
  let synth = new Tone.MonoSynth(INSTRUMENTS[0].options).toDestination();
  console.log(data);
  document.querySelector("#machine-pause").addEventListener("click", () => {
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
  });

  new Tone.Loop((time) => {
    for (let y = 1; y < 17; y++) {
      for (let i = 0; i < data.length; i++) {
        console.log(data[i][y]);
        if (data[i][y] === true) {
          synth.triggerAttackRelease(
            data[i][0],
            "8n",
            time + y * 0.2 + i * 0.001
          );
        }
      }
    }
  }, Tone.Time(3.2).toSeconds()).start(0);
  Tone.Transport.start();
}
