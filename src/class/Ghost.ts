import {ctx} from '../constant'


interface Position {
	x: number,
	y: number,
}

interface GhostConstructor {
	position: Position,
	velocity: Position,
	color?: string
}

export class Ghost {
	static speed = 1;
	public position: Position;
	public velocity: Position;
	public color: string;
	public prevCollisions: (string)[];
	public speed: number;
	public scared: boolean;
	public radius: number;


	constructor({position, velocity, color = "red"}: GhostConstructor) {
		this.position = position;
		this.velocity = velocity;
		this.radius = 15;
		this.color = color;
		this.prevCollisions = [];
		this.speed = 1;
		this.scared = false;
	}


	draw() {
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.scared ? "blue" : this.color;
		ctx.fill();
		ctx.closePath();
	}


	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}
