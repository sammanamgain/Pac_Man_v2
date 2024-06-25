import { ctx, canvas } from "../constant";
let canvasWidth = canvas.width;

let background_image = new Image();
background_image.src = "./img/block.png";
let opening_background_image = new Image();
opening_background_image.src = "./img/block.png";
function drawOpeningBackground() {
  ctx.drawImage(opening_background_image, 641, 240, 640, 960, 0, 0, 640, 1024);
}
export function drawClosingBackground() {
  ctx.drawImage(opening_background_image, 641, 190, 640, 960, 0, 0, 640, 1024);
}
export function drawStartScreen() {



//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   drawOpeningBackground();
//   ctx.fillStyle = "red";
//   ctx.font = "48px 'Comic Neue', sans-serif";
//   ctx.fillText("Pac-Man", canvasWidth / 2 - 120, 100);
//   ctx.fillStyle = "black";
//   ctx.font = "36px 'Comic Neue', sans-serif";
//   ctx.fillText("play", canvasWidth / 2 - 30, 250);
//   ctx.fillStyle = "green";
//   ctx.font = "36px 'Comic Neue', sans-serif";
//   ctx.fillText("press Enter to start", canvasWidth / 2 - 140, 350);
//   ctx.fillText("press c to make custom  level", canvasWidth / 2 - 140, 400);
//   ctx.beginPath();
//   ctx.strokeStyle = "black";
//   ctx.lineWidth = 3;
//   ctx.roundRect(canvasWidth / 2 - 60, 210, 120, 50, 10);
//   ctx.stroke();
}
