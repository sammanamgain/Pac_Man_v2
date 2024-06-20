import { canvas, ctx, map, keys } from "../constant";
import { checkColissionWithBoundary } from "../utils/util";
export class Player {
  /**
   * Constructor for initializing position, velocity, and radius.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 10;
    this.radian = 0.75;
    this.openRate = 0.12;
    this.rotation = 0;
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

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.radian < 0 || this.radian > 0.75) {
      this.openRate = -this.openRate;
      this.radian += this.openRate;
    }
  }

  moveUp(boundaries) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        checkColissionWithBoundary({
          circle: {
            ...this,
            velocity: {
              x: 0,
              y: -5,
            },
          },
          rectangle: boundary,
        })
      ) {
        this.velocity.y = 0;
        break;
      } else {
        this.velocity.y = -5;
      }
    }
  }

  moveLeft(boundaries) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        checkColissionWithBoundary({
          circle: {
            ...this,
            velocity: {
              x: -5,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        this.velocity.x = 0;
        break;
      } else {
        this.velocity.x = -5;
      }
    }
  }
  moveDown(boundaries) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        checkColissionWithBoundary({
          circle: {
            ...this,
            velocity: {
              x: 0,
              y: 5,
            },
          },
          rectangle: boundary,
        })
      ) {
        this.velocity.y = 0;
        break;
      } else {
        this.velocity.y = 5;
      }
    }
  }

  moveRight(boundaries) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        checkColissionWithBoundary({
          circle: {
            ...this,
            velocity: {
              x: 5,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        this.velocity.x = 0;
        break;
      } else {
        this.velocity.x = 5;
      }
    }
  }
}
