
import { customgrid, game, keys } from "../constant";

export function eventListener() {
  addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "w":
        keys.w.pressed = true;
        keys.lastkey = "w";
        break;
      case "a":
        keys.lastkey = "a";
        keys.a.pressed = true;
        break;
      case "s":
        keys.lastkey = "s";
        keys.s.pressed = true;
        break;
      case "d":
        keys.lastkey = "d";
        keys.d.pressed = true;
        break;
    }
  });
  addEventListener("keyup", ({ key }) => {
    switch (key) {
      case "w":
        keys.w.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
      case "s":
        keys.s.pressed = false;
        break;
      case "d":
        keys.d.pressed = false;
        break;
    }
  });
}

addEventListener("keydown", ({ key }) => {
  if (key === "p") {
    console.log("played called");

    game.state = "play";
  } else if (key === "c") {
    game.state = "custom";
  }
  if (key === "l" && game.state === "custom") {
    console.log("added eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    //   debugger
    console.log(customgrid);
    game.state = "play";
    game.customGridEnabled = true;

  }
});

const start=document.getElementById("start") as HTMLElement
start.addEventListener("click", () => {
  const startGame = document.querySelector(".start_game") as HTMLElement;
  startGame.style.display = "none";
  game.state = "play";

  const score = document.getElementById("score") as HTMLElement;
  score.style.opacity = "100";
  score.style.marginTop = "-100px";
  const scoretext = document.getElementById("scoretext") as HTMLElement;
  const scoreDiv = document.getElementById("scorediv") as HTMLElement;
  scoreDiv.style.opacity = "100";
  scoreDiv.style.display = "block";
  scoreDiv.style.position = "absolute";
  scoreDiv.style.top = "3rem";
  scoretext.style.opacity = "100";
  scoretext.style.marginTop = "-100px";
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.style.opacity = "100";
  const pause = document.getElementById("pause") as HTMLElement;
  pause.style.display = "block";

  canvas.style.margin = "auto";
});
const custom=document.getElementById("custom") as HTMLElement;
custom.addEventListener("click", () => {
  const startGame = document.querySelector(".start_game") as HTMLElement;
  startGame.style.display = "none";
  game.state = "custom";

  const score = document.getElementById("score") as HTMLElement;
  score.style.opacity = "100";
  const load = document.getElementById("load") as HTMLElement;
  load.style.opacity = "100";

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.style.opacity = "100";

  canvas.style.margin = "auto";
});

const load=document.getElementById("load") as HTMLElement;
load.addEventListener("click", () => {
  const startGame = document.querySelector(".start_game") as HTMLElement;
  startGame.style.display = "none";
  game.state = "play";

  const score = document.getElementById("score") as HTMLElement;
  score.style.opacity = "100";

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.style.opacity = "100";
  game.customGridEnabled = true;

  canvas.style.margin = "auto";
});
