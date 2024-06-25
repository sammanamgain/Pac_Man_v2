import { canvas } from "./../constant";
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
    level = 0;
  }
});

document.getElementById("start").addEventListener("click", () => {
  const startGame = document.querySelector(".start_game");
  startGame.style.display = "none";
  game.state = "play";

  const score = document.getElementById("score");
  score.style.opacity = "100";

  const canvas = document.getElementById("canvas");
  canvas.style.opacity = "100";

  canvas.style.margin = "auto";
});

document.getElementById("custom").addEventListener("click", () => {
  const startGame = document.querySelector(".start_game");
  startGame.style.display = "none";
  game.state = "custom";

  const score = document.getElementById("score");
  score.style.opacity = "100";
  const load = document.getElementById("load");
  load.style.opacity = "100";

  const canvas = document.getElementById("canvas");
  canvas.style.opacity = "100";

  canvas.style.margin = "auto";
});
document.getElementById("load").addEventListener("click", () => {
  const startGame = document.querySelector(".start_game");
  startGame.style.display = "none";
  game.state = "play";

  const score = document.getElementById("score");
  score.style.opacity = "100";

  const canvas = document.getElementById("canvas");
  canvas.style.opacity = "100";
  game.customGridEnabled = true;
  level = 0;

  canvas.style.margin = "auto";
});
