import { Boundary } from "./class/Boundary";
export const canvas: HTMLCanvasElement = document.getElementById(
  "canvas"
) as HTMLCanvasElement;
export const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d"
) as CanvasRenderingContext2D;
export const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  lastkey: "",
};

export const maps:string[][][] = [
  [
    ["1", "-", "-", "-", "-", "]", ".", "[", "-", "-", "-", "-", "2"],
    ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "I", ".", "|"],
    ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "I", ".", "|"],
    ["|", ".", ".", "b", ".", "[", "7", "]", ".", "b", ".", ".", "|"],
    ["|", ".", ".", ".", ".", ".", "|", ".", ".", ".", ".", ".", "|"],
    ["|", ".", ".", "[", "]", ".", "_", ".", "[", "]", ".", ".", "|"],
    ["_", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "_"],
    [".", ".", ".", "b", ".", "[", "5", "]", ".", "b", ".", ".", "."],
    ["^", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "^"],
    ["|", ".", ".", "[", "]", ".", "^", ".", "[", "]", ".", ".", "|"],
    ["|", ".", ".", ".", ".", ".", "|", ".", ".", ".", ".", ".", "|"],
    ["|", ".", ".", "b", ".", "[", "5", "]", ".", "b", ".", ".", "|"],
    ["|", ".", "I", ".", ".", ".", ".", ".", ".", ".", "p", ".", "|"],
    ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "I", ".", "|"],
    ["4", "-", "-", "-", "-", "]", ".", "[", "-", "-", "-", "-", "3"],
  ],
  [
    ["1", "-", "-", "-", "]", ".", "[", "-", "-", "-", "2"],
    ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
    ["|", ".", "[", "]", ".", "b", ".", "[", "]", ".", "|"],
    ["_", ".", ".", ".", ".", ".", ".", ".", ".", ".", "_"],
    [".", ".", "b", ".", "[", "5", "]", ".", "b", ".", "."],
    ["^", ".", ".", ".", ".", ".", ".", ".", ".", ".", "^"],
    ["|", ".", "[", "]", ".", "b", ".", "[", "]", ".", "|"],
    ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
    ["4", "-", "-", "-", "]", ".", "[", "-", "-", "-", "3"],
  ],
];

export const customgrid:string[][] = [
  [
    "1",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",

    "-",
    "-",
    "]",
    ".",
    "[",
    "-",

    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "2",
  ],
  [
    "|",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "|",
  ],
  [
    "|",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "|",
  ],
  [
    "|",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "|",
  ],
  [
    "|",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "|",
  ],
  [
    "_",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "_",
  ],
  [
    ".",
    "",
    "",
    "",
    "",
    ".",
    "",
    ".",

    ".",
    "",
    "[",
    "5",
    "]",
    ".",
    ".",
    "",
    "",
    "",
    "",
    ".",
    ".",
    "",
    "",
  ],
  [
    "^",
    "",
    "",
    "",
    "",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "",
    "",
    ".",
    ".",
    "",
    "",
    "^",
  ],
  [
    "|",
    "",
    "",
    "",
    "",
    ".",
    "",
    "",
    ".",
    "",
    ".",
    "",
    "",
    ".",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "|",
  ],
  [
    "|",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "|",
  ],
  [
    "|",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "|",
  ],
  [
    "|",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "|",
  ],
  [
    "4",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "]",
    ".",
    "[",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "3",
  ],
];

export const game:{state:string,customGridEnabled:boolean,level:number} = {
  state: "start",
  customGridEnabled: false,
  level: 0,
};

export function getGame() {
  return game;
}

export function updateGameLevel() {
  game.level = (game.level + 1) % 2;
}

export const ghostPositions = [
  [
    {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 6 + 0.5 * Boundary.height,
    },
    {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 7 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 5 + Boundary.width / 2,
      y: Boundary.height * 7 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 7 + Boundary.width / 2,
      y: Boundary.height * 7 + Boundary.height / 2,
    },
  ],
  [
    {
      x: Boundary.width * 5 + Boundary.width / 2,
      y: Boundary.height * 3 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 5 + Boundary.width / 2,
      y: Boundary.height * 4 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 4 + Boundary.width / 2,
      y: Boundary.height * 4 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 4 + Boundary.height / 2,
    },
  ],
];

export let ghostAudio:HTMLAudioElement = new Audio("./audio/siren.mp3");
export let cherryAudio:HTMLAudioElement = new Audio("./audio/cherry.wav");
export let powerupAudio:HTMLAudioElement = new Audio("./audio/powerup.wav");
//export let scaredGhostAudio:HTMLAudioElement = new Audio("./audio/ghostscared.wav");
export let successAudio:HTMLAudioElement = new Audio("./audio/success.wav");
