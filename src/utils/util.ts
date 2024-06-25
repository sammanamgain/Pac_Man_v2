import { Boundary } from "./../class/Boundary";
import { PowerUp } from "../class/PowerUp.ts";
import { Player } from "../class/Player.ts";
import { Pellet } from "../class/Pellet.ts";
import {Ghost} from "../class/Ghost.ts";

interface Position {
  x: number;
  y: number;
}

interface GhostConstructor {
  position: Position;
  velocity: Position;
  color?: string;
  radius: number;
}

export function createImage(src: string) {
  const image = new Image();
  image.src = src;
  return image;
}

interface checkColissionWithBoundaryParameter {
  circle: Player | GhostConstructor;
  rectangle: Boundary;
}

export function checkColissionWithBoundary({
  circle,
  rectangle,
}: checkColissionWithBoundaryParameter) {
  const padding = Boundary.width / 2 - circle.radius - 2;
  return (
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + rectangle.height + padding &&
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x - padding &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y - padding &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + rectangle.width + padding
  );
}
export function checkColissionBetweenCircleAndCircle(
  player: Player,
  powerup: (PowerUp | Pellet | Ghost)
): boolean {
  return (
    Math.hypot(
      powerup.position.x - player.position.x,
      powerup.position.y - player.position.y
    ) <
    powerup.radius + player.radius
  );
}
export function checkColissionWithBoundaryWithOutPadding({
  circle,
  rectangle,
}: checkColissionWithBoundaryParameter) {
  // Empty space between circle boundary and square boundary
  // const padding = Boundary.width / 2 - circle.radius - 1;
  const padding = 0;
  return (
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + rectangle.height + padding &&
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x - padding &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y - padding &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + rectangle.width + padding
  );
}
