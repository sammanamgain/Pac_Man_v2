import "./style.css";
import {
  canvas,
  ctx,
  keys,
  maps,
  ghostPositions,
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
import { checkColissionBetweenCircleAndCircle } from "./utils/util";
import { drawWall } from "./utils/drawWall";
import {
  customEventListener,
  eventListener,
  loadEventListener,
  startGameEventListener,
} from "./utils/eventListener";
import { customMapBuilder } from "./Pages/cutomMap";
import { saveToLocalStorage } from "./utils/saveToLocalStorage";
const score: HTMLElement = document.getElementById("score") as HTMLElement;

export class Games {
  public customGridEnabled: boolean;
  public player: Player;
  public ghosts: Ghost[];
  public startTime: number;
  public passedTime: number;
  public lives: number;
  public map: string[][];
  public boundaries: Boundary[];
  public pellets: Pellet[];
  public powerUps: PowerUp[];
  public items: Item[];
  public iswalldrawFinished: boolean;
  public level: number;
  public tmpScore: number;
  public gameOver: boolean;
  public gameInitialized: boolean;
  public state: string;
  public highScore: boolean;
  public elements: (Boundary | Pellet)[] = [];
  public toolbar: (Boundary | Pellet)[] = [];
  public levelUpdate: boolean = false;
  public drawwallstart: boolean = false;

  reset() {
    successAudio.play();
    this.level = 0;
    this.lives = 1;
    this.tmpScore = 0;
    if (this.gameOver) {
      this.map = JSON.parse(JSON.stringify(maps[this.level]));
    }
    this.gameOver = false;

    score.innerHTML = `${this.tmpScore}`;
    this.state = "play";
    this.gameInitialized = true;
  }

  constructor() {
    this.player = new Player({
      position: { x: 60, y: 60 },
      velocity: { x: 0, y: 0 },
    });
    this.highScore = false;
    this.level = 0;
    this.tmpScore = 0;
    this.gameOver = false;
    this.gameInitialized = false;
    this.state = "start";
    this.iswalldrawFinished = false;
    this.customGridEnabled = false;
    this.passedTime = 0;
    successAudio.pause();
    this.ghosts = [];
    this.lives = 2;
    this.map = JSON.parse(JSON.stringify(maps[this.level]));
    canvas.height = maps[this.level].length * Boundary.height;
    canvas.width = maps[this.level][0].length * Boundary.width;
    this.boundaries = [];
    this.pellets = [];
    this.powerUps = [];
    this.items = [];
    this.startTime = Date.now();
    this.addEvent();
    this.drawmap();
  }
  init() {
    if (this.customGridEnabled) {
      this.ghosts = [
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
          startAfter: 2 - this.level,
        }),
        new Ghost({
          position: {
            x: Boundary.width * 11 + Boundary.width / 2,
            y: Boundary.height * 6 + Boundary.height / 2,
          },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/redGhost.png",
          state: "cage",
          startAfter: 6 - this.level * 2,
        }),
        new Ghost({
          position: {
            x: Boundary.width * 12 + Boundary.width / 2,
            y: Boundary.height * 6 + Boundary.height / 2,
          },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/greenGhost.png",
          state: "cage",
          startAfter: 10 - this.level * 2,
        }),
      ];

      this.customGridEnabled = false;
      this.map = customgrid;
      canvas.width = this.map[0].length * Boundary.width + 80;
      canvas.height = this.map.length * Boundary.height + 80;
    } else {
      this.ghosts = [
        new Ghost({
          position: { ...ghostPositions[this.level][0] },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/orangeGhost.png",
          state: "cage",
          startAfter: 1,
          label: "aggressive",
        }),
        new Ghost({
          position: { ...ghostPositions[this.level][1] },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/blueGhost.png",
          state: "cage",
          startAfter: 6 - this.level,
        }),
        new Ghost({
          position: { ...ghostPositions[this.level][2] },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/redGhost.png",
          state: "cage",
          startAfter: 12 - this.level * 2,
        }),
        new Ghost({
          position: { ...ghostPositions[this.level][3] },
          velocity: { x: 0, y: 0 },
          imgSrc: "./img/sprites/greenGhost.png",
          state: "cage",
          startAfter: 18 - this.level * 2,
        }),
      ];
    }
  }

  drawmap() {
    drawWall(
      this.map,
      this.boundaries,
      this.pellets,
      this.powerUps,
      this.items
    ).then(() => {
      this.iswalldrawFinished = true;
      this.init();
      this.startTime = Date.now();
    });
  }

  clearLevel() {
    this.boundaries.length = 0;
    this.pellets.length = 0;
    this.powerUps.length = 0;
    this.items.length = 0;
    this.ghosts.length = 0;
    this.gameInitialized = false;
    if (this.customGridEnabled) {
      this.customGridEnabled = false;
      this.map = customgrid;
    }
    this.map = JSON.parse(JSON.stringify(maps[this.level]));
    const rowCount = this.map.length;
    const colCount = this.map[0].length;
    canvas.width = Boundary.width * colCount;
    canvas.height = Boundary.height * rowCount;
  }

  animate = () => {
    const Highest_score = document.getElementById(
      "Highest_score"
    ) as HTMLElement;
    Highest_score.innerHTML = localStorage.getItem("pacscore") as string;

    let result = saveToLocalStorage(0, false);
    this.tmpScore = result[0];
    this.highScore = result[1];
    if (this.state === "pause") {
      this.startTime = Date.now();
      requestAnimationFrame(this.animate);
      return;
    }

    if (this.state == "custom") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      customMapBuilder(this.elements, this.toolbar);
      this.elements.forEach((ele) => ele.draw());
      this.toolbar.forEach((ele) => ele.draw());
    } else if (this.state == "play") {
      if (!this.gameInitialized) {
        // this.gameInitialized = true;
        if (!this.iswalldrawFinished && !this.drawwallstart) {
          this.drawwallstart = true;
          requestAnimationFrame(this.animate);
        } else if (this.iswalldrawFinished) {
          this.state = "play";
          this.gameInitialized = true;
          this.startAnimation();
          this.startTime = Date.now();
        }
      } else {
        this.startAnimation();
      }
    } else if (this.state == "levelComplete") {
      ctx.fillStyle = "white";
      ctx.font = "40px Arial";
      ctx.fillText(
        "Level Complete!",
        canvas.width / 2 - 100,
        canvas.height / 2
      );
    } else if (this.state == "gameOver") {
      const endscreen = document.getElementById("endscreen") as HTMLElement;
      endscreen.style.display = "block";
      const game_over_highest_score = document.getElementById(
        "game_over_highest_score"
      ) as HTMLElement;
      game_over_highest_score.style.opacity = "0";
      game_over_highest_score.style.marginTop = "1rem";

      if (this.highScore) {
        let score: number = Math.floor(
          parseInt(localStorage.getItem("pacscore") as string)
        );
        game_over_highest_score.style.opacity = "100";
        game_over_highest_score.innerHTML = `you got the highest score : ${score}`;
        this.highScore = false;
      }

      const restart = document.getElementById("restart") as HTMLElement;
      restart.addEventListener("click", () => {
        endscreen.style.display = "none";
      });
    }

    //   requestAnimationFrame(this.animate);
  };

  startAnimation = () => {
    let currentTime = Date.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.boundaries.forEach((boundary) => {
      boundary.draw();
    });

    this.player.draw();
    this.ghosts.forEach((ghost) => {
      ghost.draw();
    });

    this.levelUpdate = false;
    const mapClone = JSON.parse(JSON.stringify(this.map));

    let coordinateX: number;
    let coordinateY: number;
    let coordinateGhostX: number;
    let coordinateGhostY: number;

    coordinateX = this.player.position.x;
    coordinateY = this.player.position.y;

    mapClone[Math.floor(coordinateY / Boundary.width)][
      Math.floor(coordinateX / Boundary.height)
    ] = "player";

    if (this.ghosts[0]) {
      coordinateGhostX = this.ghosts[0].position.x;
      coordinateGhostY = this.ghosts[0].position.y;

      mapClone[Math.floor(coordinateGhostY / Boundary.width)][
        Math.floor(coordinateGhostX / Boundary.height)
      ] = "ghost";
    }

    let dt: number = (currentTime - this.startTime) / 1000;
    this.passedTime += dt;
    if (keys.w.pressed && keys.lastkey === "w") {
      this.player.move("up");
    } else if (keys.a.pressed && keys.lastkey === "a") {
      this.player.move("left");
    } else if (keys.s.pressed && keys.lastkey === "s") {
      this.player.move("down");
    } else if (keys.d.pressed && keys.lastkey === "d") {
      this.player.move("right");
    }

    if (this.pellets.length <= 0 && this.state == "play") {
      this.state = "levelComplete";
      this.levelUpdate = true;
      this.level += 1;
      if (this.level < 2) {
        setTimeout(() => {
          this.state = "play";
        }, 1000);
      }
      if (this.level === 2) {
        setInterval(() => {
          successAudio.play();
        }, 1000);
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        this.state = "gameOver";
        return;
      }
    }

    if (this.pellets.length > 0) {
      for (let i = this.pellets.length - 1; i >= 0; i--) {
        const pellet = this.pellets[i];
        pellet.draw();
        if (checkColissionBetweenCircleAndCircle(this.player, pellet)) {
          let coordinateX = pellet.position.x;
          let coordinateY = pellet.position.y;

          this.map[Math.floor(coordinateY / Boundary.width)][
            Math.floor(coordinateX / Boundary.height)
          ] = "";
          let audiosrc = ["./audio/pellet.mp3", "./audio/pellet2.mp3"];

          let audio = new Audio(audiosrc[Math.floor(Math.random() * 2)]);
          audio.play();

          this.pellets.splice(i, 1);
          this.tmpScore += 10;
          score.innerHTML = `${this.tmpScore}`;
        }
      }
    }
    if (this.items.length > 0) {
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        item.draw();

        if (checkColissionBetweenCircleAndCircle(this.player, item)) {
          cherryAudio.play();
          this.items.splice(i, 1);
          this.tmpScore += 50;
          score.innerHTML = `${this.tmpScore}`;
        }
      }
    }

    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerup: PowerUp = this.powerUps[i];
      powerup.draw();

      if (checkColissionBetweenCircleAndCircle(this.player, powerup)) {
        powerupAudio.play();
        this.powerUps.splice(i, 1);

        this.ghosts.forEach((ghost) => {
          ghost.scared = true;
          ghost.image.src = ghost.scaredsrc;

          setTimeout(() => {
            ghost.image.src = ghost.defaultSrc;
            ghost.scared = false;
          }, 5000);
        });
      }
    }

    this.player.update(dt, this.boundaries);
    mapClone[Math.floor(coordinateY / Boundary.width)][
      Math.floor(coordinateX / Boundary.height)
    ] = "";
    coordinateX = this.player.position.x;
    coordinateY = this.player.position.y;
    mapClone[Math.floor(coordinateY / Boundary.width)][
      Math.floor(coordinateX / Boundary.height)
    ] = "player";
    this.ghosts.forEach((ghost, index) => {
      if (checkColissionBetweenCircleAndCircle(this.player, ghost)) {
        // console.log(" collison between player and ghost");
        if (this.ghosts && ghost.scared) {
          this.ghosts.splice(index, 1);
        } else {
          if (this.player.state !== "intermediate") {
            this.lives -= 1;
          }
          if (this.lives == 0) {
            this.customGridEnabled = false;
            this.level = 0;
            this.state = "gameOver";
            return;
          }
          this.state = "intermediate";
          this.ghosts.forEach((ghost) => {
            ghost.state = "pause";
          });

          setTimeout(() => {
            this.state = "play";
          }, 2000);
          return;
        }
      }

      // if (index === 0) {
      //   console.log(ghost.position.x, ghost.position.y);
      // }
      if (this.state == "pause") return;

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

      if (ghost.state === "cage" && this.passedTime >= ghost.startAfter) {
        ghost.state = "entering";
      }
      if (ghost.state === "active" || ghost.state === "entering") {
        ghost.update(dt, this.boundaries, this.level, mapClone);
      }

      // if (
      //   ghost.state === "entering" &&
      //   Date.now() - this.startTime >= ghost.startAfter * 1000 + 2000
      // ) {
      //   ghost.state = "active";
      // }
      // if (ghost.state === "entering") {
      //   setTimeout(() => {
      //     ghost.state = "active";
      //   }, 10000);
      // }
    });

    if (this.player.velocity.x > 0) this.player.rotation = 0;
    else if (this.player.velocity.x < 0) this.player.rotation = Math.PI;
    else if (this.player.velocity.y > 0) this.player.rotation = Math.PI / 2;
    else if (this.player.velocity.y < 0) this.player.rotation = Math.PI * 1.5;

    this.startTime = Date.now();
    requestAnimationFrame(this.startAnimation);
  };

  addEvent() {
    eventListener(this);
    startGameEventListener(this);
    customEventListener(this);
    loadEventListener(this);
    const pause = document.getElementById("pause") as HTMLElement;
    pause.addEventListener("click", () => {
      if (this.state == "play") {
        this.state = "pause";
      } else if (this.state == "pause") {
        this.startTime = Date.now();
        this.state = "play";
      }
      if (this.state == "play") {
        requestAnimationFrame(this.animate);
      }
    });
    const restart = document.getElementById("restart") as HTMLElement;
    restart.addEventListener("click", () => {
      this.lives = 2;
      this.gameOver = true;
      this.highScore = false;
    });
  }
}

const games = new Games();

games.animate();
