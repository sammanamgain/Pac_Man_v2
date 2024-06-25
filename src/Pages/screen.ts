import { ctx} from "../constant";

let background_image = new Image();
background_image.src = "./img/block.png";
let opening_background_image = new Image();
opening_background_image.src = "./img/block.png";
export function drawClosingBackground() {
  ctx.drawImage(opening_background_image, 641, 190, 640, 960, 0, 0, 640, 1024);
}
