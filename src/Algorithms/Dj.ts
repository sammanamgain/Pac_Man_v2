// @ts-nocheck

export function findShortestPath(originalMap:(string|number)[][]) {
	// Create a deep copy of the map
	const map = originalMap.map(row => [...row]);

	const rows = map.length;
	const cols = map[0].length;
	const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, Down, Left, Right

	// Find the starting positions of ghost and player
	let ghostRow, ghostCol;
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (map[i][j] === 'ghost') {
				ghostRow = i;
				ghostCol = j;
			}
		}
	}

	// Check the valid moves and rank them based on their proximity to the player
	const validMoves = [];
	for (const [dr, dc] of dirs) {
		const newRow = ghostRow + dr;
		const newCol = ghostCol + dc;
		if (
			newRow >= 0 &&
			newRow < rows &&
			newCol >= 0 &&
			newCol < cols &&
			map[newRow][newCol] === '.'
		) {
			const distance = calculateDistanceToPlayer(map, newRow, newCol);
			validMoves.push({ row: newRow, col: newCol, distance });
		}
	}

	// Sort the valid moves based on their distance to the player (ascending order)
	validMoves.sort((a, b) => a.distance - b.distance);

	// Return the directions of the valid moves, from best to worst
	const directions = [];
	for (const move of validMoves) {
		const { row, col } = move;
		if (row === ghostRow - 1 && col === ghostCol) {
			directions.push('up');
		} else if (row === ghostRow + 1 && col === ghostCol) {
			directions.push('down');
		} else if (row === ghostRow && col === ghostCol - 1) {
			directions.push('left');
		} else if (row === ghostRow && col === ghostCol + 1) {
			directions.push('right');
		}
	}

	return directions;
}

function calculateDistanceToPlayer(map, row, col) {
	const rows = map.length;
	const cols = map[0].length;

	// Find the player's position
	let playerRow, playerCol;
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (map[i][j] === 'player') {
				playerRow = i;
				playerCol = j;
			}
		}
	}

	// Calculate the Manhattan distance between (row, col) and (playerRow, playerCol)
	return Math.abs(row - playerRow) + Math.abs(col - playerCol);
}
