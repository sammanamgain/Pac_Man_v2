import { canvas, ctx, map, keys } from "../constant";
export class Pellet {
  //Basic Structure of Pellet
  constructor({ position }) {
    this.position = position;
    this.radius = 3;
  }

  // Used to draw a circle
  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }
}
