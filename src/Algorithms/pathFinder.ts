

export function getBestMove(grid: (string | number)[][]) {
  const directions = [
    { x: 0, y: -1, name: "up", opposite: "down" },
    { x: 0, y: 1, name: "down", opposite: "up" },
    { x: -1, y: 0, name: "left", opposite: "right" },
    { x: 1, y: 0, name: "right", opposite: "left" },
  ];

  let ghostPos = null;
  let playerPos = null;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "player") {
        playerPos = { x: x, y: y };
      }
      if (grid[y][x] === "ghost") {
        ghostPos = { x: x, y: y };
      }
    }
  }

  if (!ghostPos || !playerPos) {
    return ["stay"];
  }

  function manhattanDistance(a: any, b: any) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  let moves = directions.map((direction) => {
    const newPos = { x: ghostPos.x + direction.x, y: ghostPos.y + direction.y };
    return {
      name: direction.name,
      opposite: direction.opposite,
      distance: manhattanDistance(newPos, playerPos),
    };
  });




  moves.sort((a, b) => a.distance - b.distance);




  return moves.map((move) => move.name);
}
