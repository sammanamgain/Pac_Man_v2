import {ctx,} from "../constant";

interface Position {
	x: number,
	y: number,
}

interface PelletConstructor {
	position: Position
}

export class Pellet {
	public position: Position;
	public radius: number;

	constructor({position}: PelletConstructor) {
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
