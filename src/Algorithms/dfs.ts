export function shortestPathDirection(grid) {
  const directions = [
    { dr: 0, dc: -1, name: "left" },
    { dr: 0, dc: 1, name: "right" },
    { dr: -1, dc: 0, name: "up" },
    { dr: 1, dc: 0, name: "down" },
  ];

  const rows = grid.length;
  const cols = grid[0].length;
  let ghostPos = null;
  let playerPos = null;

  // Find the positions of the ghost and the player
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "ghost") {
        ghostPos = { r, c };
      } else if (grid[r][c] === "player") {
        playerPos = { r, c };
      }
    }
  }

  if (!ghostPos || !playerPos) {
    return null; // Return if either the ghost or the player is not found
  }

  // BFS setup
  const queue = [ghostPos];
  const visited = new Set();
  visited.add(`${ghostPos.r},${ghostPos.c}`);
  const parent = new Map();
  parent.set(`${ghostPos.r},${ghostPos.c}`, null);

  // BFS to find the shortest path to the player
  while (queue.length > 0) {
    const current = queue.shift();

    if (current.r === playerPos.r && current.c === playerPos.c) {
      break;
    }

    for (const { dr, dc, name } of directions) {
      const nr = current.r + dr;
      const nc = current.c + dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        (grid[nr][nc] === "." || grid[nr][nc] === "player") &&
        !visited.has(`${nr},${nc}`)
      ) {
        queue.push({ r: nr, c: nc });
        visited.add(`${nr},${nc}`);
        parent.set(`${nr},${nc}`, current);
      }
    }
  }

  // Backtrack to find the direction
  const playerKey = `${playerPos.r},${playerPos.c}`;
  if (!parent.has(playerKey)) {
    return null; // No path found
  }

  let path = [];
  let step = playerPos;
  while (step.r !== ghostPos.r || step.c !== ghostPos.c) {
    path.push(step);
    step = parent.get(`${step.r},${step.c}`);
  }

  const firstStep = path[path.length - 1];
  const directionVector = {
    dr: firstStep.r - ghostPos.r,
    dc: firstStep.c - ghostPos.c,
  };

  for (const { dr, dc, name } of directions) {
    if (directionVector.dr === dr && directionVector.dc === dc) {
      return name;
    }
  }

  return null; // Fallback in case something goes wrong
}
