import { Boundary } from "./../class/Boundary";

export function createImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

export function checkColissionWithBoundary({ circle, rectangle }) {
  // Empty space between circle boundary and square boundary
  const padding = Boundary.width / 2 - circle.radius - 1;
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
export function checkColissionBetweenCircleAndCircle(powerup,player):boolean {
return(
  Math.hypot(
    powerup.position.x - player.position.x,
    powerup.position.y - player.position.y
  ) <
  powerup.radius + player.radius)
}
