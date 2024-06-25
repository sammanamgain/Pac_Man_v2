import { ctx } from "../constant";

interface Position {
  x: number;
  y: number;
}

interface BoundaryConstructor {
  position: Position;
  image: HTMLImageElement;
  label?: string;
}

export class Boundary {
  static width = 40;
  static height = 40;
  public position: Position;
  public image: HTMLImageElement;
  public width: number;
  public height: number;
  public label: string | null | undefined;

  constructor({ position, image, label }: BoundaryConstructor) {
    this.position = position;
    this.width = 40;
    this.height = 40;
    this.image = image;
    this.label = label;
  }


  draw() {
    ctx.fillStyle = "blue";
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
