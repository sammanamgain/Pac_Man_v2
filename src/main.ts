/* eslint-disable @typescript-eslint/no-unused-vars */
import "./style.css";


// import
import {canvas, ctx, keys, map as defaultMap,game,customgrid} from "./constant";
import {PowerUp} from "./class/PowerUp";
import {Boundary} from "./class/Boundary";
import {Ghost} from "./class/Ghost";
import {Pellet} from "./class/Pellet";
import {Player} from "./class/Player";
import {checkColissionBetweenCircleAndCircle, checkColissionWithBoundary,} from "./utils/util";
import {drawWall} from "./utils/drawWall";
import {eventListener} from "./utils/eventListener";
import {getBestMove} from './Algorithms/aStar.ts';
import {drawStartScreen} from './Pages/screen.ts'
import {customMapBuilder} from "./Pages/cutomMap.ts";

const score: HTMLElement = document.getElementById("score") as HTMLElement;
let gameOver: boolean = false;
canvas.width = 800;
canvas.height = 800;
let tmpScore: number = 0;
//let startTime: number = Date.now()
const powerUps: PowerUp[] = [];
const pellets: Pellet[] = [];
const boundaries: Boundary[] = [];
const elements:(Boundary | Pellet)[]=[];
const toolbar :(Boundary  | Pellet)[]=[];
function reinitializeGameEntities() {
	console.log("Reinitializing game entities...");
	ghosts.length = 0;
	powerUps.length = 0;
	pellets.length = 0;
	boundaries.length = 0;

	drawWall(map, boundaries, pellets, powerUps);

	ghosts.push(new Ghost({
		position: { x: Boundary.width * 6 + Boundary.width / 2, y: Boundary.height + Boundary.height / 2 },
		velocity: { x: Ghost.speed, y: 0 }
	}));
	ghosts.push(new Ghost({
		position: { x: Boundary.width * 6 + Boundary.width / 2, y: Boundary.height + Boundary.height / 2 },
		velocity: { x: -Ghost.speed, y: 0 }
	}));
	ghosts.push(new Ghost({
		position: { x: Boundary.width * 6 + Boundary.width / 2, y: Boundary.height * 3 + Boundary.height / 2 },
		velocity: { x: Ghost.speed, y: 0 },
		color: "pink",
		label: "aggressive"
	}));

	player = new Player({
		position: { x: 100, y: 140 },
		velocity: { x: 0, y: 0 }
	});

	console.log("Game entities reinitialized");
}


const ghosts = [
	new Ghost({
		position: {
			x: Boundary.width * 6 + Boundary.width / 2,
			y: Boundary.height + Boundary.height / 2,
		},
		velocity: {x: Ghost.speed, y: 0},
	}),
	new Ghost({
		position: {
			x: Boundary.width * 6 + Boundary.width / 2,
			y: Boundary.height + Boundary.height / 2,
		},
		velocity: {x: Ghost.speed, y: 0},
	}),
	new Ghost({
		position: {
			x: Boundary.width * 6 + Boundary.width / 2,
			y: Boundary.height * 3 + Boundary.height / 2,
		},
		velocity: {x: -Ghost.speed, y: 0},
		color: "pink",
		label:"aggressive"
	}),
];

let player: Player = new Player({
	position: {x: 100, y: 140},
	velocity: {
		x: 0,
		y: 0,
	},
});
let map:(string|number)[][]=defaultMap;


function drawMap() {

	if (game.customGridEnabled) {

		console.log("before boundary  update",boundaries.length)
		map=customgrid;

		boundaries.length=0;
		pellets.length=0
		powerUps.length=0
		game.customGridEnabled=false;
		reinitializeGameEntities()
	}
		drawWall(map, boundaries, pellets, powerUps);
	console.log("after boundary update",boundaries.length)
}

drawMap()

function animate() {


	if (game.state=='start')
	{
		drawStartScreen()
	}

	else if(game.state=='custom')
	{
		ctx.clearRect(
			0,0,canvas.width,canvas.height
		)
		customMapBuilder(elements,toolbar)
		elements.forEach((ele) => {
			ele.draw();
		});
		toolbar.forEach((ele) => {
			ele.draw();
		});
	}

	else if(game.state=='play')
	{
	//	debugger;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("normal",map)
		let coordinateX: number = player.position.x;
		let coordinateY: number = player.position.y;
		let coordinateGhostX: number = ghosts[2].position.x;
		let coordinateGhostY: number = ghosts[2].position.y;

// update the player position in grid:

		map[Math.floor(coordinateY / Boundary.width)][Math.floor(coordinateX / Boundary.height)] = 'player';
		map[Math.floor(coordinateGhostY / Boundary.width)][Math.floor(coordinateGhostX / Boundary.height)] = 'ghost';


		if(game.customGridEnabled)
		{
			drawMap()
		}

	//	let currentTime = Date.now()
	//	let dt: number = (currentTime - startTime) / 1000
	//	startTime = currentTime
		if (keys.w.pressed && keys.lastkey === "w") {
			player.moveUp(boundaries);
		}
		else if (keys.a.pressed && keys.lastkey === "a") {
			player.moveLeft(boundaries);
		}
		else if (keys.s.pressed && keys.lastkey === "s") {
			player.moveDown(boundaries);
		}
		else if (keys.d.pressed && keys.lastkey === "d") {
			player.moveRight(boundaries);
		}
		boundaries.forEach((boundary) => {
			boundary.draw();
			if (checkColissionWithBoundary({circle: player, rectangle: boundary})) {
				player.velocity.x = 0;
				player.velocity.y = 0;
			}
		});

		for (let i = pellets.length - 1; i >= 0; i--) {
			const pellet = pellets[i];
			pellet.draw();


			if (checkColissionBetweenCircleAndCircle(player, pellet)) {
				pellets.splice(i, 1);
				tmpScore += 10;
				score.innerHTML = `${tmpScore}`;
			}
		}

		if (pellets.length === 0) {
			gameOver = true;
		}

		for (let i = powerUps.length - 1; i >= 0; i--) {
			const powerup: PowerUp = powerUps[i];
			powerup.draw();

			//Check Colission between player and pellet(circle and circle)
			if (checkColissionBetweenCircleAndCircle(player, powerup)) {
				powerUps.splice(i, 1); //The splice() method adds and/or removes array elements. The splice() method overwrites the original array.Syntax array.splice(index, howmanyToRemove, item1, ....., itemX)
				ghosts.forEach((ghost) => {
					ghost.scared = true;

					setTimeout(() => {
						ghost.scared = false;
					}, 5000);
				});
			}
		}



		player.update();

		map[Math.floor(coordinateY / Boundary.width)][Math.floor(coordinateX / Boundary.height)] = '';
		 coordinateX = player.position.x;
		 coordinateY = player.position.y;
		// update the player position in grid:
		map[Math.floor(coordinateY / Boundary.width)][Math.floor(coordinateX / Boundary.height)] = 'player';


		for (let i = ghosts.length - 1; i >= 0; i--) {
			let ghost = ghosts[i];
			if (checkColissionBetweenCircleAndCircle(player, ghost)) {
				if (ghost.scared) {
					ghosts.splice(i, 1);
				}
				else {
					console.log("collision");

					gameOver = true;
				}
			}
          //  console.log("while checking collison with boundary",boundaries.length)
			const collisions: string[] = [];
			boundaries.forEach((boundary) => {
				if (
					!collisions.includes("right") &&
					checkColissionWithBoundary({
						circle: {
							...ghost,
							velocity: {
								x: ghost.speed,
								y: 0,
							},
						},
						rectangle: boundary,
					})
				) {
					collisions.push("right");
				}
				if (
					!collisions.includes("left") &&
					checkColissionWithBoundary({
						circle: {
							...ghost,
							velocity: {
								x: -ghost.speed,
								y: 0,
							},
						},
						rectangle: boundary,
					})
				) {
					collisions.push("left");
				}
				if (
					!collisions.includes("up") &&
					checkColissionWithBoundary({
						circle: {
							...ghost,
							velocity: {
								x: 0,
								y: -ghost.speed,
							},
						},
						rectangle: boundary,
					})
				) {
					collisions.push("up");
				}
				if (
					!collisions.includes("down") &&
					checkColissionWithBoundary({
						circle: {
							...ghost,
							velocity: {
								x: 0,
								y: ghost.speed,
							},
						},
						rectangle: boundary,
					})
				) {
					collisions.push("down");
				}
			});
			if (collisions.length > ghost.prevCollisions.length)
				ghost.prevCollisions = collisions;

			if(ghost.label!=='aggressive') {



				if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
					if (ghost.velocity.x > 0) {
						ghost.prevCollisions.push("right");
					}
					else if (ghost.velocity.x < 0) {
						ghost.prevCollisions.push("left");
					}
					else if (ghost.velocity.y > 0) {
						ghost.prevCollisions.push("down");
					}
					else if (ghost.velocity.y < 0) {
						ghost.prevCollisions.push("up");
					}
					const pathWays = ghost.prevCollisions.filter((collision) => {
						return !collisions.includes(collision);
					});

					const direction = pathWays[Math.floor(Math.random() * pathWays.length)];

					switch (direction) {
						case "right":
							ghost.velocity.x = ghost.speed;
							ghost.velocity.y = 0;

							break;
						case "left":
							ghost.velocity.x = -ghost.speed;
							ghost.velocity.y = 0;
							break;
						case "up":
							ghost.velocity.y = -ghost.speed;
							ghost.velocity.x = 0;
							break;
						case "down":
							ghost.velocity.y = ghost.speed;
							ghost.velocity.x = 0;
							break;
					}
					ghost.prevCollisions = [];
				}
			}
			else{

                let bestMove=getBestMove(map)
				let validMove=bestMove.filter((move)=>{
					return !collisions.includes(move)
				})

				switch (validMove[0]) {
					case "right":

						ghost.velocity.x = 1;
						ghost.velocity.y = 0;
						break;
					case "left":
						ghost.velocity.x = -1;
						ghost.velocity.y = 0;
						break;
					case "up":
						ghost.velocity.y = -1;
						ghost.velocity.x = 0;
						break;
					case "down":
						ghost.velocity.y = 1;
						ghost.velocity.x = 0;
						break;
				}
              ghost.update();


				map[Math.floor(coordinateGhostY / Boundary.width)][Math.floor(coordinateGhostX / Boundary.height)] = '';
				coordinateGhostX = ghost.position.x;
				 coordinateGhostY = ghost.position.y;
				map[Math.floor(coordinateGhostY / Boundary.width)][Math.floor(coordinateGhostX / Boundary.height)] = 'ghost';

			}
			if (ghost.label!=='aggressive')
			{
				ghost.update()
			}

		}

	}



	if (!gameOver) {
		requestAnimationFrame(animate);
	}

	// rotating for chop chop animation
	if (player.velocity.x > 0) player.rotation = 0;
	else if (player.velocity.x < 0) player.rotation = Math.PI;
	else if (player.velocity.y > 0) player.rotation = Math.PI / 2;
	else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5;
}

animate();
eventListener();
