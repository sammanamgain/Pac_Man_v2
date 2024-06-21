import {canvas, ctx, customgrid } from '../constant.ts';
import {Boundary} from "../class/Boundary.ts";

import {Pellet} from "../class/Pellet.ts";
import {Player} from "../class/Player.ts";
import {createImage} from "../utils/util.ts";


export function customMapBuilder(elements: (Boundary | Player | Pellet)[], toolbar: (Boundary | Pellet)[]) {
	const gridSize = Boundary.width;
	let selectedElements: string = '';
	const walls = [];
	//console.log("starting grid",customgrid)
    toolbar.length=0
	// drawing initial grid
	for (let i = 0; i < customgrid.length ; i++) {

		for (let j = 0; j < customgrid[i].length; j++) {
			let block = customgrid[i][j];
			let imgSrc = '';
			switch (block) {
				case '-':
					imgSrc = './img/pipeHorizontal.png';
					break;
				case '|':
					imgSrc = './img/pipeVertical.png';
					break;
				case '1':
					imgSrc = './img/pipeCorner1.png';
					break;
				case '2':
					imgSrc = './img/pipeCorner2.png';
					break;
				case '3':
					imgSrc = './img/pipeCorner3.png';
					break;
				case '4':
					imgSrc = './img/pipeCorner4.png';
					break;
				case 'b':
					imgSrc = './img/block.png';
					break;
				case '[':
					imgSrc = './img/capLeft.png';
					break;
				case ']':
					imgSrc = './img/capRight.png';
					break;
				case '_':
					imgSrc = './img/capBottom.png';
					break;
				case '^':
					imgSrc = './img/capTop.png';
					break;
				case '+':
					imgSrc = './img/pipeCross.png';
					break;
				case '5':
					imgSrc = './img/pipeConnectorTop.png';
					break;
				case '6':
					imgSrc = './img/pipeConnectorRight.png';
					break;
				case '7':
					imgSrc = './img/pipeConnectorBottom.png';
					break;
				case '8':
					imgSrc = './img/pipeConnectorLeft.png';
					break;
			}
			if (imgSrc != '') {
				walls.push(new Boundary({
					position: {x:Boundary.width * j, y:Boundary.height * i},
					image: createImage(imgSrc)
				}));
			}
		}

	}




	function drawGrid() {
		for (let i = 0; i < customgrid.length ; i++) {
			for (let j = 0; j < customgrid[0].length; j++) {
				const x = j * gridSize;
				const y = i * gridSize;
				if (customgrid[i][j] === '.') {
					ctx.strokeRect(x, y, gridSize, gridSize);
				}
			}
		}
	}

	walls.forEach((wall) => {
		wall.draw();
	});


	const toolbarItems = [
		{label: 'Wall'},
		{label: 'Pellets'},

	];

	for (let i = 0; i < toolbarItems.length; i++) {
	//	console.log("loop called")

		const toolbarItem = toolbarItems[i];

		if (toolbarItem.label == 'Wall') {

			toolbar.push(new Boundary({
				position: {x:40 * i, y:(customgrid.length+1) * 40 },
				image: createImage('./img/block.png'),
				label: toolbarItem.label

			}));
		}
		else if (toolbarItem.label == 'Pellets') {
			toolbar.push(new Pellet(
				{
					position: {x:40 * i+Boundary.width/2 , y:(customgrid.length+1) * 40 +Boundary.height/2  },
					label:toolbarItem.label

				})
			)
		}
	}


	//console.log("final",toolbar)

	function drawToolbar() {
		toolbar.forEach((tool) => {
			tool.draw();
		});
	}

	// Initial draw
	drawGrid();
	drawToolbar();

	canvas.addEventListener('click', (e) => {
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Check if the click is outside the toolbar area
		if (y < (customgrid.length*40) ) {
			const blockX = Math.floor(x / gridSize) * gridSize;
			const blockY = Math.floor(y / gridSize) * gridSize;

			if (selectedElements) {
				if (selectedElements === 'Wall') {
					customgrid[blockY / 40][blockX / 40] = 'b';
					let wall = new Boundary({
						position: {x:blockX,y: blockY},

						image: createImage('./img/block.png'),
						label: "Wall"
					});
					elements.push(wall);
				}

				else if (selectedElements === 'Pellets') {
					customgrid[blockY / 40][blockX / 40] = '.';
					let wall = new Pellet(
						{
							position: {x: blockX + 25, y: blockY + 25},
						})

					elements.push(wall);
				}
			}
		}
		else {
			// Handle toolbar click
			const toolIndex = Math.floor(x / 40);
			const clickedTool = toolbar[toolIndex];

			if (clickedTool) {
				selectedElements = clickedTool.label as string;
			}
		}
	});
}
