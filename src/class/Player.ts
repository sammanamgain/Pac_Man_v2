import { ctx, canvas } from "../constant";
import { checkColissionWithBoundary } from "../utils/util";
import { Boundary } from "./Boundary.ts";
const SPEED = 250;
const CELL_SIZE = 20;
interface Position {
  x: number;
  y: number;
}

interface PlayerConstructor {
  position: Position;
  velocity: Position;
}

export class Player {
  static speed: number = 100;
  public position: Position;
  public velocity: Position;
  public radius: number;
  public radian: number;
  public openRate: number;
  public rotation: number;
  public state: string;
  private desiredDirection: { x: number; y: number } = { x: 0, y: 0 };

  constructor({ position, velocity }: PlayerConstructor) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.radian = 0.75;
    this.openRate = 0.12;
    this.rotation = 0;
    this.state = "active";
  }

  draw() {
    ctx.save();
    // global canvas function
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.translate(-this.position.x, -this.position.y);
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radian,

      2 * Math.PI - this.radian
    );
    ctx.lineTo(this.position.x, this.position.y);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  collision(boundaries) {
    for (const boundary of boundaries) {
      if (
        checkColissionWithBoundary({
          circle: this,
          rectangle: boundary,
        })
      ) {
        return true;
        break;
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

  isValidMove(boundaries) {
    for (const boundary of boundaries) {
      // 5 is the constant so to get 5 px space
      if (
        checkColissionWithBoundary({
          circle: {
            ...this,
            velocity: {
              x: this.desiredDirection.x * 5,
              y: this.desiredDirection.y * 5,
            },
          },
          rectangle: boundary,
        })
      ) {
        return false;
      }
    }
    return true;
  }

  movePlayer(dt, boundaries) {
    if (this.isValidMove(boundaries)) {
      this.velocity.x = this.desiredDirection.x;
      this.velocity.y = this.desiredDirection.y;
    }
    if (this.collision(boundaries)) {
      this.velocity.y = 0;
      this.velocity.x = 0;

      this.snapToGrid();
    } else {
      this.position.x += this.velocity.x * dt * SPEED;
      this.position.y += this.velocity.y * dt * SPEED;
    }
    if (this.radian < 0 || this.radian > 0.75) {
      this.openRate = -this.openRate;
    }
    this.radian += this.openRate;

    this.checkOutOfXaxis();
    this.checkOutOfYaxis();
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
  // when we add dt, we check collision at 5 px per frame, but in reality we are moving at different range due to dt variation

  update(dt: number, boundaries) {
    this.draw();
    if (this.state === "active") {
      this.movePlayer(dt, boundaries);
    } else if (this.state === "intermediate") {
      this.radian = 0 - 0.0001;
    }
  }

  move(direction) {
    switch (direction) {
      case "up":
        this.desiredDirection = {
          x: 0,
          y: -1,
        };
        break;
      case "down":
        this.desiredDirection = {
          x: 0,
          y: 1,
        };
        break;
      case "left":
        this.desiredDirection = {
          x: -1,
          y: 0,
        };
        break;
      case "right":
        this.desiredDirection = {
          x: 1,
          y: 0,
        };
        break;
    }
  }
}
