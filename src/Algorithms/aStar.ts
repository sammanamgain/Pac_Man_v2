let lastMove = null; // This should be stored between frames in a persistent way

export function getBestMove(grid: (string | number)[][]) {
  const directions = [
    { x: 0, y: -1, name: "up", opposite: "down" },
    { x: 0, y: 1, name: "down", opposite: "up" },
    { x: -1, y: 0, name: "left", opposite: "right" },
    { x: 1, y: 0, name: "right", opposite: "left" },
  ];

  let ghostPos = null;
  let playerPos = null;

  // Find player and ghost positions
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
    return ["stay"]; // If either the player or ghost position is not found
  }

  function manhattanDistance(a: any, b: any) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  // Calculate distances for each possible move
  let moves = directions.map((direction) => {
    const newPos = { x: ghostPos.x + direction.x, y: ghostPos.y + direction.y };
    return {
      name: direction.name,
      opposite: direction.opposite,
      distance: manhattanDistance(newPos, playerPos),
    };
  });

  // Filter out the opposite of the last move
  if (lastMove) {
    moves = moves.filter((move) => move.name !== lastMove.opposite);
  }

  // Sort moves by ascending distance
  moves.sort((a, b) => a.distance - b.distance);

  // Store the best move as lastMove for the next frame
  lastMove = moves[0].name;

  // Return sorted move names
  return moves.map((move) => move.name);
}
