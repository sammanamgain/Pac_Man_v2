import { ghostPositions, ghostAudio } from "./../constant";
import { ctx, canvas } from "../constant";
import { getBestMove } from "../Algorithms/pathFinder.ts";
const SPEED = 140;
const CELL_SIZE = 20;
import { checkColissionWithBoundary } from "../utils/util";
import { Boundary } from "./Boundary.ts";

interface Position {
  x: number;
  y: number;
}

interface GhostConstructor {
  position: Position;
  velocity: Position;
  color?: string;
  label?: string;
  imgSrc: string;
  state?: string;
  startAfter?: number;
}

export class Ghost {
  static speed = 1;
  public position: Position;
  public velocity: Position;
  public color: string;
  public prevCollisions: string[];
  public speed: number;
  public scared: boolean;
  public radius: number;
  public label: string | null | undefined;
  public previousValidMoves: { x: number; y: number }[];
  public image: HTMLImageElement;
  public state: string;
  public startAfter: number;
  public startTime: number;
  public imageLoaded: boolean;
  public timePassed: number;
  public currentFrame: number;
  public defaultSrc: string;
  public scaredsrc: string;
  public isEntering: boolean;
  public animationPosition: Position;

  constructor({
    position,
    velocity,
    color = "red",
    label,
    imgSrc,
    state = "cage",
    startAfter = 0,
  }: GhostConstructor) {
    this.position = { ...position };
    this.velocity = velocity;
    this.radius = 15;
    this.color = color;
    this.prevCollisions = [];
    this.speed = 2;
    this.scared = false;
    this.label = label;
    this.previousValidMoves = [];
    this.image = new Image();
    this.defaultSrc = imgSrc;
    this.image.src = imgSrc;
    this.scaredsrc = "./img/sprites/scaredGhost.png";
    this.imageLoaded = false;
    this.timePassed = 0;
    this.currentFrame = 0;
    this.state = state;
    this.startAfter = startAfter;
    this.startTime = Date.now();
    this.isEntering = false;
    this.animationPosition = { x: this.position.x, y: this.position.y };

    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  draw() {
    if (this.imageLoaded) {
      const width = this.image.width * 2;
      const height = this.image.height * 2;
      ctx.drawImage(
        this.image,
        (this.currentFrame * this.image.width) / 8,
        0,
        this.image.width / 8,
        this.image.height,
        this.position.x - this.image.width / 8,
        this.position.y - this.image.height,
        width / 8,
        height
      );
    }
  }

  checkOutOfXaxis() {
    if (this.position.x + this.radius > canvas.width) {
      this.position.x = this.radius;
    }
    if (this.position.x - this.radius < 0) {
      this.position.x = canvas.width - this.radius;
    }
  }

  checkOutOfYaxis() {
    if (this.position.y - this.radius < 0) {
      this.position.y = canvas.height - this.radius;
    }
    if (this.position.y + this.radius > canvas.height) {
      this.position.y = this.radius;
    }
  }
  update(dt: number, boundaries: Boundary[], level: number, map: string[][]) {
    // this.draw();
    this.updateSprite(dt);

    if (this.state === "entering" && !this.isEntering) {
      this.enterGame(level);
      return;
    }

    if (this.state === "pause") {
      return;
    }

    if (this.state !== "active") {
      ghostAudio.play();
      if (Date.now() - this.startTime >= this.startAfter * 1000) {
        this.state = "entering";
      } else {
        return;
      }
    }

    if (this.label === "aggressive") {
      this.aggressiveUpdate(map, boundaries, dt, level);
    } else {
      const validMoves = this.gatherValidMoves(boundaries);
      if (
        validMoves.length > 0 &&
        validMoves.length !== this.previousValidMoves.length
      ) {
        const myMove =
          validMoves[Math.floor(Math.random() * validMoves.length)];
        this.velocity.x = myMove.x;
        this.velocity.y = myMove.y;
      }
      if (this.collision(boundaries)) {
        this.velocity.y = 0;
        this.velocity.x = 0;
        this.snapToGrid();
      } else {
        this.position.x += this.velocity.x * dt * (SPEED + 50 * level);
        this.position.y += this.velocity.y * dt * (SPEED + 50 * level);
      }

      this.previousValidMoves = validMoves;
    }
    this.checkOutOfYaxis();
    this.checkOutOfXaxis();
  }

  aggressiveUpdate(
    map: string[][],
    boundaries: Boundary[],
    dt: number,
    level: number
  ) {
    const bestMove = getBestMove(map);
    for (const move of bestMove) {
      switch (move) {
        case "up":
          this.velocity.x = 0;
          this.velocity.y = -1;
          break;
        case "down":
          this.velocity.x = 0;
          this.velocity.y = 1;
          break;
        case "right":
          this.velocity.x = 1;
          this.velocity.y = 0;
          break;
        case "left":
          this.velocity.x = -1;
          this.velocity.y = 0;
          break;
      }

      if (!this.collision(boundaries)) {
        this.position.x += this.velocity.x * dt * (SPEED + 50 * level);
        this.position.y += this.velocity.y * dt * (SPEED + 50 * level);

        break;
      } else {
      }
    }
  }

  updateSprite(dt: number) {
    this.timePassed += dt;
    if (this.timePassed > 0.3) {
      this.currentFrame = (this.currentFrame + 1) % 8;
      this.timePassed = 0;
    }
  }

  collision(boundaries: Boundary[]) {
    for (const boundary of boundaries) {
      if (
        checkColissionWithBoundary({
          circle: this,
          rectangle: boundary,
        })
      ) {
        return true;
      }
    }
    return false;
  }

  snapToGrid() {
    this.position = {
      x: Math.round(this.position.x / CELL_SIZE) * CELL_SIZE,
      y: Math.round(this.position.y / CELL_SIZE) * CELL_SIZE,
    };
  }

  gatherValidMoves(boundaries: Boundary[]) {
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];
    const validMoves = directions.filter((direction) => {
      const oppositeDirection = {
        x: -1 * this.velocity.x,
        y: -1 * this.velocity.y,
      };
      return (
        direction.x !== oppositeDirection.x ||
        direction.y !== oppositeDirection.y
      );
    });

    for (const boundary of boundaries) {
      // 5 is the constant so to get 5 px space
      for (const direction of directions) {
        if (
          checkColissionWithBoundary({
            circle: {
              ...this,
              velocity: {
                x: direction.x * 5,
                y: direction.y * 5,
              },
            },
            rectangle: boundary,
          })
        ) {
          validMoves.splice(
            validMoves.findIndex(
              (move) => move.x === direction.x && move.y === direction.y
            ),
            1
          );
        }
      }
    }
    return validMoves;
  }
  enterGame(level: number) {
    const targetX = ghostPositions[level][1].x;
    const targetY = ghostPositions[level][1].y - Boundary.height;
    const intermediateX = ghostPositions[level][1].x;
    const intermediateY = ghostPositions[level][1].y;
    this.isEntering = true;
    const t = (window as any).gsap.timeline({
      onComplete: () => {
        this.state = "active";
        this.isEntering = false;
      },
    });

    t.to(this.animationPosition, {
      x: intermediateX,
      y: intermediateY,
      duration: 1.5,
      ease: "power1.inOut",
      onUpdate: () => {
        this.position.x = this.animationPosition.x;
        this.position.y = this.animationPosition.y;
        this.draw();
      },
    });

    // Second animation: B to A
    t.to(this.animationPosition, {
      x: targetX,
      y: targetY,
      duration: 1.5,
      ease: "power1.inOut",
      onUpdate: () => {
        this.position.x = this.animationPosition.x;
        this.position.y = this.animationPosition.y;
        this.draw();
      },
    });

    // console.log(this.state);
  }
}
