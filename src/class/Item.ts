import { ctx } from "../constant";

interface Position {
  x: number;
  y: number;
}

interface ItemConstructor {
  position: Position;

  label?: string;
}

export class Item {
  public position: Position;
  public radius: number;
  public label: string | undefined;
  public image:HTMLImageElement;
  private center:Position;
  private radian:number;
  private loaded:boolean;

  constructor({ position, label }: ItemConstructor) {
    this.loaded=false;
    this.position = position;
    this.radius = 10;
    this.image = new Image();
    this.image.src = "./img/sprites/cherry.png";
    this.center = { ...this.position };
    this.radian = 0;
    this.label = label;
    this.image.onload = () => {
      this.loaded = true;
    };
  }

  draw() {
    this.radian += 0.05;

    this.position.x = this.center.x + Math.cos(this.radian);
    this.position.y = this.center.y + Math.sin(this.radian);
    ctx.fillStyle = "red";

    if (this.loaded) {
      ctx.drawImage(
        this.image,
        this.position.x - this.image.width / 2,
        this.position.y - this.image.height / 2
      );
    } else {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
