import {ctx} from "../constant";
import {checkColissionWithBoundary} from "../utils/util";
import {Boundary} from "./Boundary.ts";


interface Position {
	x: number,
	y: number,
}

interface PlayerConstructor {
	position: Position,
	velocity: Position
}

export class Player {
	public position: Position;
	public velocity: Position;
	public radius: number;
	public radian: number;
	public openRate: number;
	public rotation: number;


	constructor({position, velocity}: PlayerConstructor) {
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

	moveUp(boundaries: (Boundary)[]) {
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
			}
			else {
				this.velocity.y = -5;
			}
		}
	}

	moveLeft(boundaries:(Boundary)[]) {
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
			}
			else {
				this.velocity.x = -5;
			}
		}
	}

	moveDown(boundaries: (Boundary)[]) {
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
			}
			else {
				this.velocity.y = 5;
			}
		}
	}

	moveRight(boundaries: (Boundary)[]) {
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
			}
			else {
				this.velocity.x = 5;
			}
		}
	}
}
