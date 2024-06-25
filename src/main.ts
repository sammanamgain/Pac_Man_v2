import "./style.css";
import {
  canvas,
  ctx,
  keys,
  maps,
  ghostPositions,
  getGame,
  customgrid,
  ghostAudio,
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
  checkColissionWithBoundary,
} from "./utils/util";
import { drawWall } from "./utils/drawWall";
import { eventListener } from "./utils/eventListener";
import { getBestMove } from "./Algorithms/aStar.ts";
import { drawStartScreen } from "./Pages/screen.ts";
import { customMapBuilder } from "./Pages/cutomMap";

const game = getGame();
let level = 0;
let lives = 2;

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
let levelCompleteFlag = false;
let ghosts: Ghost[] = [];
let items: Item[] = [];
let map = maps[level];
let rowCount = map.length;
let colCount = map[0].length;
canvas.width = Boundary.width * colCount;
canvas.height = Boundary.height * rowCount;
let player: Player;

function drawWallAsync(map, boundaries, pellets, powerUps, items) {
  return new Promise<void>((resolve) => {
    drawWall(map, boundaries, pellets, powerUps, items);
    resolve();
  });
}

let passedTime = 0;
const ghostReleaseTime = [0, 2, 4, 6];
let Game = {
  init() {
    player = new Player({
      position: { x: 60, y: 60 },
      velocity: { x: 0, y: 0 },
    });

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

    startTime = Date.now();
    passedTime = 0;
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
  gameOver = false;
  gameInitialized = false;
  score.innerHTML = `${tmpScore}`;
  Game.reset();
  initializeGameElements().then(() => {
    game.state = "play";
    gameInitialized = true;
  });
}

function clearLevel() {
  console.log("while clearing level", level);
  boundaries.length = 0;
  pellets.length = 0;
  powerUps.length = 0;
  items.length = 0;
  ghosts.length = 0;
  gameInitialized = false;
  if (game.customGridEnabled) {
    game.customGridEnabled = false;
    map = customgrid;
  } else {
    map = maps[level];
  }
  rowCount = map.length;
  colCount = map[0].length;
  canvas.width = Boundary.width * colCount;
  canvas.height = Boundary.height * rowCount;
}

function initializeGameElements() {
  if (game.customGridEnabled) {
    map = customgrid;
    canvas.width = map[0].length * Boundary.width + 80;
    canvas.height = map.length * Boundary.height + 80;
  }
  return drawWallAsync(map, boundaries, pellets, powerUps, items).then(() => {
    Game.init();
  });
}

function animate() {
  if (game.state === "pause") {
    return;
  }

  if (game.state == "custom") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    customMapBuilder(elements, toolbar);
    // elements.forEach((ele) => ele.draw());
    //toolbar.forEach((ele) => ele.draw());
  } else if (game.state == "play") {
    if (!gameInitialized) {
      initializeGameElements().then(() => {
        gameInitialized = true;
        startAnimation();
      });
    } else {
      startAnimation();
    }
  } else if (game.state == "levelComplete") {
    // Draw a "Level Complete" message
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Level Complete!", canvas.width / 2 - 100, canvas.height / 2);
  } else if (game.state == "gameOver") {
    // console.log("gamover");
    const endscreen = document.getElementById("endscreen");
    endscreen.style.display = "block";
    const restart = document.getElementById("restart");
    restart.addEventListener("click", () => {
      endscreen.style.display = "none";
      resetGame();
    });
  }

  requestAnimationFrame(animate);
}

function startAnimation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let coordinateX: number = player.position.x;
  let coordinateY: number = player.position.y;
  let coordinateGhostX: number;
  let coordinateGhostY: number;

  map[Math.floor(coordinateY / Boundary.width)][
    Math.floor(coordinateX / Boundary.height)
  ] = "player";

  if (ghosts[0]) {
    coordinateGhostX = ghosts[0].position.x;
    coordinateGhostY = ghosts[0].position.y;

    map[Math.floor(coordinateGhostY / Boundary.width)][
      Math.floor(coordinateGhostX / Boundary.height)
    ] = "ghost";
  }

  //console.log(map);
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
    //console.log("how many time it will be called");
    // Updated condition
    game.state = "levelComplete";

    level = level + 1;

    if (level < 2) {
      setTimeout(() => {
        clearLevel();
        game.state = "play";
      }, 2000);
    }

    if (level === 2) {
      setInterval(() => {
        successAudio.play();
      }, 1000);

      ctx.fillStyle = "white";
      ctx.font = "40px Arial";
      ctx.fillText("Game Complete!", canvas.width / 2 - 100, canvas.height / 2);
      game.state = "pause";
    }
  }

  if (pellets.length > 0) {
    for (let i = pellets.length - 1; i >= 0; i--) {
      const pellet = pellets[i];
      pellet.draw();

      if (checkColissionBetweenCircleAndCircle(player, pellet)) {
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
        ghost.image.src = ghost.image.scaredsrc;

        setTimeout(() => {
          ghost.image.src = ghost.defaultSrc;
          ghost.scared = false;
        }, 5000);
      });
    }
  }

  player.update(dt, boundaries);

  map[Math.floor(coordinateY / Boundary.width)][
    Math.floor(coordinateX / Boundary.height)
  ] = "";

  coordinateX = player.position.x;
  coordinateY = player.position.y;

  map[Math.floor(coordinateY / Boundary.width)][
    Math.floor(coordinateX / Boundary.height)
  ] = "player";

  ghosts.forEach((ghost, index) => {
    if (checkColissionBetweenCircleAndCircle(player, ghost)) {
      if (ghosts && ghost.scared) {
        ghosts.splice(index, 1);
      } else {
        lives--;
        if (lives == 0) {
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
        }, 3000);
        return;
      }
    }
    if (game.state == "pause") return;

    ghost.update(dt, boundaries, level, map);

    if (ghost.label === "aggressive") {
      map[Math.floor(coordinateGhostY / Boundary.width)][
        Math.floor(coordinateGhostX / Boundary.height)
      ] = "";
      coordinateGhostX = ghost.position.x;
      coordinateGhostY = ghost.position.y;
      map[Math.floor(coordinateGhostY / Boundary.width)][
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

document.getElementById("pause").addEventListener("click", () => {
  console.log(game.state);
  if (game.state == "play") {
    game.state = "pause";
  } else if (game.state == "pause") {
    game.state = "play";
  }

  requestAnimationFrame(animate);
});
