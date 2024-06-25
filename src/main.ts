import "./style.css";
import {
  canvas,
  ctx,
  keys,
  maps,
  ghostPositions,
  getGame,
  customgrid,
  cherryAudio,
  powerupAudio,
  successAudio,
} from "./constant";
import { PowerUp } from "./class/PowerUp";
import { Boundary } from "./class/Boundary";
import { Ghost } from "./class/Ghost";
import { Pellet } from "./class/Pellet";
import { Player } from "./class/Player";
import { Item } from "./class/Item";

import {
  checkColissionBetweenCircleAndCircle,
} from "./utils/util";
import { drawWall } from "./utils/drawWall";
import { eventListener } from "./utils/eventListener";

import { customMapBuilder } from "./Pages/cutomMap";

const game = getGame();
let level = 0;
let lives = 2;
let mapClone:(string)[][];
let levelUpdate = false;

const score: HTMLElement = document.getElementById("score") as HTMLElement;
let gameOver: boolean = false;
let gameInitialized: boolean = false;

let tmpScore: number = 0;
let startTime: number = Date.now();
const powerUps: PowerUp[] = [];
const pellets: Pellet[] = [];
const boundaries: Boundary[] = [];
const elements: (Boundary | Pellet)[] = [];
const toolbar: (Boundary | Pellet)[] = [];
let ghosts: Ghost[] = [];
let items: Item[] = [];
let highScore: boolean = false;

let map = JSON.parse(JSON.stringify(maps[level]));
let rowCount = map.length;
let colCount = map[0].length;
canvas.width = Boundary.width * colCount + 40;
canvas.height = Boundary.height * rowCount + 40;
let player: Player;

let passedTime = 0;

let Game = {
  init() {
    player = new Player({
      position: { x: 60, y: 60 },
      velocity: { x: 0, y: 0 },
    });

    if (game.customGridEnabled) {
      ghosts = [
        new Ghost({
          position: {
            x: Boundary.width * 11 + Boundary.width / 2,
            y: Boundary.height * 5 + Boundary.height / 2,
          },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/orangeGhost.png",
          state: "active",
          startAfter: 0,
          label: "aggressive",
        }),
        new Ghost({
          position: {
            x: Boundary.width * 10 + Boundary.width / 2,
            y: Boundary.height * 6 + Boundary.height / 2,
          },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/blueGhost.png",
          state: "cage",
          startAfter: 2 - level,
        }),
        new Ghost({
          position: {
            x: Boundary.width * 11 + Boundary.width / 2,
            y: Boundary.height * 6 + Boundary.height / 2,
          },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/redGhost.png",
          state: "cage",
          startAfter: 6 - level * 2,
        }),
        new Ghost({
          position: {
            x: Boundary.width * 12 + Boundary.width / 2,
            y: Boundary.height * 6 + Boundary.height / 2,
          },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/greenGhost.png",
          state: "cage",
          startAfter: 10 - level * 2,
        }),
      ];

      game.customGridEnabled = false;
    } else {
      ghosts = [
        new Ghost({
          position: { ...ghostPositions[level][0] },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/orangeGhost.png",
          state: "active",
          startAfter: 0,
          label: "aggressive",
        }),
        new Ghost({
          position: { ...ghostPositions[level][1] },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/blueGhost.png",
          state: "cage",
          startAfter: 2 - level,
        }),
        new Ghost({
          position: { ...ghostPositions[level][2] },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/redGhost.png",
          state: "cage",
          startAfter: 6 - level * 2,
        }),
        new Ghost({
          position: { ...ghostPositions[level][3] },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/greenGhost.png",
          state: "cage",
          startAfter: 10 - level * 2,
        }),
      ];
    }

    startTime = Date.now();
    passedTime = 0;
    successAudio.pause();
  },

  reset() {
    successAudio.play();
    clearLevel();
    this.init();
  },
};

function resetGame() {
  level = 0;
  lives = 1;
  tmpScore = 0;
  if (gameOver) {
    map = JSON.parse(JSON.stringify(maps[level]));
  }

  gameOver = false;
  gameInitialized = false;
  score.innerHTML = `${tmpScore}`;
  Game.reset();
  initializeGameElements();
  game.state = "play";
  gameInitialized = true;
}

function clearLevel() {
  boundaries.length = 0;
  pellets.length = 0;
  powerUps.length = 0;
  items.length = 0;
  ghosts.length = 0;
  gameInitialized = false;
  if (game.customGridEnabled) {
    game.customGridEnabled = false;
    map = customgrid;
  }
  if (levelUpdate) {
    map = JSON.parse(JSON.stringify(maps[level]));
  }
  rowCount = map.length;
  colCount = map[0].length;
  canvas.width = Boundary.width * colCount;
  canvas.height = Boundary.height * rowCount;
}

function initializeGameElements() {
  if (game.customGridEnabled) {
    lives = 2;
    map = customgrid;
    canvas.width = map[0].length * Boundary.width + 80;
    canvas.height = map.length * Boundary.height + 80;
  }
  drawWall(map, boundaries, pellets, powerUps, items);
  Game.init();
}

function animate() {
  const Highest_score = document.getElementById("Highest_score") as HTMLElement;
  Highest_score.innerHTML = localStorage.getItem("pacscore") as string;

  if (localStorage.getItem("pacscore") == null) {
    localStorage.setItem("pacscore", `${tmpScore}`);
  }
  if (Number(localStorage.getItem("pacscore")) < tmpScore) {
    highScore = true;
    localStorage.setItem("pacscore", `${tmpScore}`);
  }

  if (game.state === "pause") {
    startTime = Date.now();
    requestAnimationFrame(animate);
    return;
  }

  if (game.state == "custom") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    customMapBuilder(elements, toolbar);
    elements.forEach((ele) => ele.draw());
    toolbar.forEach((ele) => ele.draw());
  } else if (game.state == "play") {
    if (!gameInitialized) {
      initializeGameElements();
      gameInitialized = true;
    }
    startAnimation();
  } else if (game.state == "levelComplete") {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Level Complete!", canvas.width / 2 - 100, canvas.height / 2);
  } else if (game.state == "gameOver") {
    const endscreen = document.getElementById("endscreen") as HTMLElement;
    endscreen.style.display = "block";
    const game_over_highest_score = document.getElementById("game_over_highest_score") as HTMLElement;
    game_over_highest_score.style.opacity = "0";
    game_over_highest_score.style.marginTop = "1rem";

    if (highScore) {
      let score: number = Math.floor(parseInt(localStorage.getItem("pacscore") as string));
      game_over_highest_score.style.opacity = "100";
      game_over_highest_score.innerHTML = `you got the highest score : ${score}`;
      highScore = false;
    }

    const restart = document.getElementById("restart") as HTMLElement;

    restart.addEventListener("click", () => {
      endscreen.style.display = "none";
      resetGame();
    });
  }

  requestAnimationFrame(animate);
}


function startAnimation() {
  levelUpdate = false;
  mapClone = JSON.parse(JSON.stringify(map));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let coordinateX: number;
  let coordinateY: number;
  let coordinateGhostX: number;
  let coordinateGhostY: number;

  coordinateX = player.position.x;
  coordinateY = player.position.y;

  mapClone[Math.floor(coordinateY / Boundary.width)][
      Math.floor(coordinateX / Boundary.height)
      ] = "player";

  if (ghosts[0]) {
    coordinateGhostX = ghosts[0].position.x;
    coordinateGhostY = ghosts[0].position.y;

    mapClone[Math.floor(coordinateGhostY / Boundary.width)][
        Math.floor(coordinateGhostX / Boundary.height)
        ] = "ghost";
  }

  let currentTime = Date.now();
  let dt: number = (currentTime - startTime) / 1000;
  startTime = currentTime;

  passedTime += dt;

  if (keys.w.pressed && keys.lastkey === "w") {
    player.move("up");
  } else if (keys.a.pressed && keys.lastkey === "a") {
    player.move("left");
  } else if (keys.s.pressed && keys.lastkey === "s") {
    player.move("down");
  } else if (keys.d.pressed && keys.lastkey === "d") {
    player.move("right");
  }

  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  if (pellets.length <= 0 && game.state == "play") {
    game.state = "levelComplete";
    levelUpdate = true;
    level = level + 1;
    if (level < 2) {
      setTimeout(() => {
        clearLevel();
        game.state = "play";
      }, 1000);
    }
    if (level === 2) {
      setInterval(() => {
        successAudio.play();
      }, 1000);
      ctx.fillStyle = "white";
      ctx.font = "40px Arial";

      // ctx.fillText("Game Complete!", canvas.width / 2 - 100, canvas.height / 2);
      game.state = "gameOver";
      return;
    }
  }

  if (pellets.length > 0) {
    for (let i = pellets.length - 1; i >= 0; i--) {
      const pellet = pellets[i];
      pellet.draw();
      if (checkColissionBetweenCircleAndCircle(player, pellet)) {
        let coordinateX = pellet.position.x;
        let coordinateY = pellet.position.y;

        map[Math.floor(coordinateY / Boundary.width)][
            Math.floor(coordinateX / Boundary.height)
            ] = "";
        let audiosrc = ["./audio/pellet.mp3", "./audio/pellet2.mp3"];

        let audio = new Audio(audiosrc[Math.floor(Math.random() * 2)]);
        audio.play();

        pellets.splice(i, 1);
        tmpScore += 10;
        score.innerHTML = `${tmpScore}`;
      }
    }
  }
  if (items.length > 0) {
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      item.draw();

      if (checkColissionBetweenCircleAndCircle(player, item)) {
        cherryAudio.play();
        items.splice(i, 1);
        tmpScore += 50;
        score.innerHTML = `${tmpScore}`;
      }
    }
  }

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerup: PowerUp = powerUps[i];
    powerup.draw();

    if (checkColissionBetweenCircleAndCircle(player, powerup)) {
      powerupAudio.play();
      powerUps.splice(i, 1);

      ghosts.forEach((ghost) => {
        ghost.scared = true;
        ghost.image.src = ghost.scaredsrc;

        setTimeout(() => {
          ghost.image.src = ghost.defaultSrc;
          ghost.scared = false;
        }, 5000);
      });
    }
  }

  player.update(dt, boundaries);
  mapClone[Math.floor(coordinateY / Boundary.width)][
      Math.floor(coordinateX / Boundary.height)
      ] = "";
  coordinateX = player.position.x;
  coordinateY = player.position.y;
  mapClone[Math.floor(coordinateY / Boundary.width)][
      Math.floor(coordinateX / Boundary.height)
      ] = "player";
  ghosts.forEach((ghost, index) => {
    if (checkColissionBetweenCircleAndCircle(player, ghost)) {
      if (ghosts && ghost.scared) {
        ghosts.splice(index, 1);
      } else {
        if (player.state !== "intermediate") {
          lives = lives - 1;
        }

        if (lives == 0) {
          game.customGridEnabled = false;
          level = 0;
          game.state = "gameOver";
          return;
        }
        player.state = "intermediate";
        ghosts.forEach((ghost) => {
          ghost.state = "pause";
        });

        setTimeout(() => {
          Game.reset();
          game.state = "play";
        }, 2000);
        return;
      }
    }
    if (game.state == "pause") return;


    ghost.update(dt, boundaries, level, mapClone);

    if (ghost.label === "aggressive") {
      mapClone[Math.floor(coordinateGhostY / Boundary.width)][
          Math.floor(coordinateGhostX / Boundary.height)
          ] = "";
      coordinateGhostX = ghost.position.x;
      coordinateGhostY = ghost.position.y;
      mapClone[Math.floor(coordinateGhostY / Boundary.width)][
          Math.floor(coordinateGhostX / Boundary.height)
          ] = "ghost";
    }

    if (ghost.state === "cage" && passedTime >= ghost.startAfter) {
      ghost.state = "entering";
    }

    if (
        ghost.state === "entering" &&
        Date.now() - startTime >= ghost.startAfter * 1000 + 2000
    ) {
      ghost.state = "active";
    }
  });

  if (player.velocity.x > 0) player.rotation = 0;
  else if (player.velocity.x < 0) player.rotation = Math.PI;
  else if (player.velocity.y > 0) player.rotation = Math.PI / 2;
  else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5;
  player.draw();
}


eventListener();
animate();
const pause = document.getElementById("pause") as HTMLElement;
pause.addEventListener("click", () => {
  if (game.state == "play") {
    game.state = "pause";
  } else if (game.state == "pause") {
    startTime = Date.now();
    game.state = "play";
  }
  if (game.state == "play") {
    requestAnimationFrame(animate);
  }
});
const restart = document.getElementById("restart") as HTMLElement;
restart.addEventListener("click", () => {
  lives = 2;
  gameOver = true;
  highScore = false;
  Game.reset();
});
