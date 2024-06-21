export function getBestMove(grid:(string|number)[][]) {
	const directions = [
		{ x: 0, y: -1, name: "up" },
		{ x: 0, y: 1, name: "down" },
		{ x: -1, y: 0, name: "left" },
		{ x: 1, y: 0, name: "right" }
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

	function manhattanDistance(a:any, b:any) {
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
	}

	// Calculate distances for each possible move
	const moves = directions.map(direction => {
		const newPos = { x: ghostPos.x + direction.x, y: ghostPos.y + direction.y };
		return {
			name: direction.name,
			distance: manhattanDistance(newPos, playerPos)
		};
	});

	// Sort moves by ascending distance
	moves.sort((a, b) => a.distance - b.distance);

	// Return sorted move names
	return moves.map(move => move.name);
}
