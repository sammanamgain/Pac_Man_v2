import {canvas,ctx,map,keys} from '../constant'
export class Ghost {
    static speed = 1;
    //Basic Structure of Ghost
    constructor({ position, velocity, color = "red" }) {
      this.position = position;
      this.velocity = velocity;
      this.radius = 15;
      this.color = color;
      this.prevCollisions = [];
      this.speed = 1;
      this.scared = false;
    }
  
    // Used to draw a circle
    draw() {
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.scared ? "blue" : this.color;
      ctx.fill();
      ctx.closePath();
    }
  
    // For Movement of player
    update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }