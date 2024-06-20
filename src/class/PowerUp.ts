import {canvas,ctx,map,keys} from '../constant'
export class PowerUp {
    //Basic Structure of Pellet
    constructor({ position }) {
      this.position = position;
      this.radius = 10;
    }
  
    // Used to draw a circle
    draw() {
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.closePath();
    }
}