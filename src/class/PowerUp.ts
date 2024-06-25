import { ctx } from "../constant";

interface Position {
  x: number;
  y: number;
}

interface PowerUpConstructor {
  position: Position;
  label?: string;
}

export class PowerUp {
  public position: Position;
  public radius: number;
  public label: string | undefined;

  constructor({ position, label }: PowerUpConstructor) {
    this.position = position;
    this.label = label;
    this.radius = 10;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }
}
