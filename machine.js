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
    name: "Conga",
    value: "conga",
    notes: [
      "Valve1",
      "Valve2",
      "Valve3",
      "Valve4",
      "Valve5",
      "Valve6",
      "Valve7",
    ],
  },
  {
    name: "Drums",
    value: "drums",
    notes: ["Tom 1", "Tom 2", "Tom 3", "Hi-Hat", "Snare", "Kick"],
  },
];
const DRUMS_KIT_LIST = [
  "4OP-FM",
  "acoustic-kit",
  "Bongos",
  "breakbeat8",
  "breakbeat9",
  "breakbeat13",
  "CR78",
  "Kit3",
  "Kit8",
  "KPR77",
  "LINN",
  "loops",
  "R8",
  "Stark",
  "Techno",
  "TheCheebacabra1",
  "TheCheebacabra2",
];
let INSTRUMENT_SELECTION = "";
let INSTRUMENT_CONFIGURATION = null;
let DRUMS_KIT = "breakbeat13";

export async function initSound() {
  await Tone.start();
  console.log("audio is ready");
  document
    .querySelector("#instrument-selector")
    .addEventListener("change", readInstrumentSelection);
  document
    .querySelector("#machine-play")
    .addEventListener("click", soundMachine);
    document.querySelector("#addButton").addEventListener("click",() => {
      document.querySelector("#machine").classList.toggle("on");
    })
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
  instrumentConfiguration();
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

function instrumentConfiguration() {
  let instrument;
  switch (INSTRUMENT_SELECTION) {
    case "synth":
      instrument = new Tone.MonoSynth(INSTRUMENTS[0].options).toDestination();
      break;
    case "conga":
      instrument = new Tone.Players().toDestination();
      instrument.add(
        "Valve1",
        new Tone.ToneAudioBuffer("./sounds/Conga/Conga_MF_Valve1.wav", () => {
          console.log("loaded");
        })
      );
      instrument.add(
        "Valve2",
        new Tone.ToneAudioBuffer("./sounds/Conga/Conga_MF_Valve2.wav", () => {
          console.log("loaded");
        })
      );
      instrument.add(
        "Valve3",
        new Tone.ToneAudioBuffer("./sounds/Conga/Conga_MF_Valve3.wav", () => {
          console.log("loaded");
        })
      );
      instrument.add(
        "Valve4",
        new Tone.ToneAudioBuffer("./sounds/Conga/Conga_MF_Valve4.wav", () => {
          console.log("loaded");
        })
      );
      instrument.add(
        "Valve5",
        new Tone.ToneAudioBuffer("./sounds/Conga/Conga_MF_Valve5.wav", () => {
          console.log("loaded");
        })
      );
      instrument.add(
        "Valve6",
        new Tone.ToneAudioBuffer("./sounds/Conga/Conga_MF_Valve6.wav", () => {
          console.log("loaded");
        })
      );
      instrument.add(
        "Valve7",
        new Tone.ToneAudioBuffer("./sounds/Conga/Conga_MF_Valve7.wav", () => {
          console.log("loaded");
        })
      );
      break;
    case "drums":
      instrument = new Tone.Players().toDestination();
      instrument.add(
        "Tom 1",
        new Tone.ToneAudioBuffer(
          "./sounds/Drums/" + DRUMS_KIT + "/tom1.wav",
          () => {
            console.log("loaded");
          }
        )
      );
      instrument.add(
        "Tom 2",
        new Tone.ToneAudioBuffer(
          "./sounds/Drums/" + DRUMS_KIT + "/tom2.wav",
          () => {
            console.log("loaded");
          }
        )
      );
      instrument.add(
        "Tom 3",
        new Tone.ToneAudioBuffer(
          "./sounds/Drums/" + DRUMS_KIT + "/tom3.wav",
          () => {
            console.log("loaded");
          }
        )
      );
      instrument.add(
        "Hi-Hat",
        new Tone.ToneAudioBuffer(
          "./sounds/Drums/" + DRUMS_KIT + "/hihat.wav",
          () => {
            console.log("loaded");
          }
        )
      );
      instrument.add(
        "Snare",
        new Tone.ToneAudioBuffer(
          "./sounds/Drums/" + DRUMS_KIT + "/snare.wav",
          () => {
            console.log("loaded");
          }
        )
      );
      instrument.add(
        "Kick",
        new Tone.ToneAudioBuffer(
          "./sounds/Drums/" + DRUMS_KIT + "/kick.wav",
          () => {
            console.log("loaded");
          }
        )
      );
      break;
  }
  INSTRUMENT_CONFIGURATION = instrument;
}

export function soundMachine() {
  let data = [];
  let instrument = INSTRUMENT_CONFIGURATION;
  data = readMachineSelection();
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
          switch (INSTRUMENT_SELECTION) {
            case "synth":
              instrument.triggerAttackRelease(
                data[i][0],
                "8n",
                time + y * 0.1 + i * 0.001
              );
              break;
            case "conga":
              instrument.player(data[i][0]).start(time + y * 0.15 + i * 0.001);
              break;
            case "drums":
              instrument.player(data[i][0]).start(time + y * 0.15 + i * 0.001);
              break;
          }
        }
      }
    }
  }, Tone.Time(2.4).toSeconds()).start(0);
  Tone.Transport.start();
}
