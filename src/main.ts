import "./style.css";

// import
import { canvas, ctx,  keys } from "./constant";
import { PowerUp } from "./class/PowerUp";
import { Boundary } from "./class/Boundary";
import { Ghost } from "./class/Ghost";
import { Pellet } from "./class/Pellet";
import { Player } from "./class/Player";
import {

  checkColissionWithBoundary,
  checkColissionBetweenCircleAndCircle,
} from "./utils/util";
import { drawWall } from "./utils/drawWall";
import { eventListener } from "./utils/eventListener";
const score:HTMLElement = document.getElementById("score") as HTMLElement;
let gameOver: boolean = false;
canvas.width = innerWidth;
canvas.height = innerHeight;
let tmpScore:number = 0;

const powerUps:PowerUp[] = [];
const pellets:Pellet[] = [];
const boundaries:Boundary[] = [];

const ghosts = [
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: { x: Ghost.speed, y: 0 },
  }),
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 3 + Boundary.height / 2,
    },
    velocity: { x: Ghost.speed, y: 0 },
    color: "pink",
  }),
];

drawWall(boundaries, pellets, powerUps);

const player = new Player({
  position: { x: 100, y: 140 },
  velocity: {
    x: 0,
    y: 0,
  },
});


function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys.w.pressed && keys.lastkey === "w") {
    player.moveUp(boundaries);
  } else if (keys.a.pressed && keys.lastkey === "a") {
    player.moveLeft(boundaries);
  } else if (keys.s.pressed && keys.lastkey === "s") {
    player.moveDown(boundaries);
  } else if (keys.d.pressed && keys.lastkey === "d") {
    player.moveRight(boundaries);
  }
  boundaries.forEach((boundary) => {
    boundary.draw();
    if (checkColissionWithBoundary({ circle: player, rectangle: boundary })) {
      player.velocity.x = 0;
      player.velocity.y = 0;
    }
  });

  for (let i = pellets.length - 1; i >= 0; i--) {
    const pellet = pellets[i];
    pellet.draw();


    if (checkColissionBetweenCircleAndCircle(player, pellet)) {
      pellets.splice(i, 1);
      tmpScore += 10;
      score.innerHTML = `${tmpScore}`;
    }
  }

  if (pellets.length === 0) {
    gameOver = true;
  }

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerup:PowerUp = powerUps[i];
    powerup.draw();

    //Check Colission between player and pellet(circle and circel)
    if (checkColissionBetweenCircleAndCircle( player,powerup)) {
      powerUps.splice(i, 1); //The splice() method adds and/or removes array elements. The splice() method overwrites the original array.Syntax array.splice(index, howmanyToRemove, item1, ....., itemX)
      ghosts.forEach((ghost) => {
        ghost.scared = true;

        setTimeout(() => {
          ghost.scared = false;
        }, 5000);
      });
    }
  }
  ghosts.forEach((ghost) => {
    ghost.update();
  });
  player.update();

  for (let i = ghosts.length - 1; i >= 0; i--) {
    let ghost = ghosts[i];

    if (checkColissionBetweenCircleAndCircle( player,ghost)) {
      if (ghost.scared) {
        ghosts.splice(i, 1);
      } else {
        console.log("collision");

        gameOver = true;
      }
    }

    const collisions:string[] = [];
    boundaries.forEach((boundary) => {
      if (
        !collisions.includes("right") &&
        checkColissionWithBoundary({
          circle: {
            ...ghost,
            velocity: {
              x: ghost.speed,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("right");
      }
      if (
        !collisions.includes("left") &&
        checkColissionWithBoundary({
          circle: {
            ...ghost,
            velocity: {
              x: -ghost.speed,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("left");
      }
      if (
        !collisions.includes("up") &&
        checkColissionWithBoundary({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: -ghost.speed,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("up");
      }
      if (
        !collisions.includes("down") &&
        checkColissionWithBoundary({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: ghost.speed,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("down");
      }
    });
    if (collisions.length > ghost.prevCollisions.length)
      ghost.prevCollisions = collisions;

    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
      if (ghost.velocity.x > 0) {
        ghost.prevCollisions.push("right");
      } else if (ghost.velocity.x < 0) {
        ghost.prevCollisions.push("left");
      } else if (ghost.velocity.y > 0) {
        ghost.prevCollisions.push("down");
      } else if (ghost.velocity.y < 0) {
        ghost.prevCollisions.push("up");
      }
      const pathWays = ghost.prevCollisions.filter((collision) => {
        return !collisions.includes(collision);
      });

      const direction = pathWays[Math.floor(Math.random() * pathWays.length)];

      switch (direction) {
        case "right":
          ghost.velocity.x = ghost.speed;
          ghost.velocity.y = 0;

          break;
        case "left":
          ghost.velocity.x = -ghost.speed;
          ghost.velocity.y = 0;
          break;
        case "up":
          ghost.velocity.y = -ghost.speed;
          ghost.velocity.x = 0;
          break;
        case "down":
          ghost.velocity.y = ghost.speed;
          ghost.velocity.x = 0;
          break;
      }
      ghost.prevCollisions = [];
    }
  }

  //ghost ending

  if (!gameOver) {
    requestAnimationFrame(animate);
  }

  // rotating for chop chop animation
  if (player.velocity.x > 0) player.rotation = 0;
  else if (player.velocity.x < 0) player.rotation = Math.PI;
  else if (player.velocity.y > 0) player.rotation = Math.PI / 2;
  else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5;
}
animate();
eventListener();
