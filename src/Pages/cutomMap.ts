import { customgrid } from "./../constant";
import { PowerUp } from "./../class/PowerUp";
import { Boundary } from "./../class/Boundary";
import {  canvas, ctx } from "../constant.ts";
import { Pellet } from "../class/Pellet.ts";
import { Player } from "../class/Player.ts";
import { Item } from "../class/Item";
import { createImage } from "../utils/util.ts";

export function customMapBuilder(
  elements: (Boundary | Player | Pellet)[],
  toolbar: (Boundary | Pellet)[]
) {
  canvas.height = customgrid.length * Boundary.height + 80;
  canvas.width = customgrid[0].length * Boundary.width + 80;

  const gridSize = Boundary.width;
  let selectedElements:string = "";
  const walls:Boundary[] = [];

  toolbar.length = 0;

  // Prepare walls based on the custom grid
  for (let i = 0; i < customgrid.length; i++) {
    for (let j = 0; j < customgrid[i].length; j++) {
      const block = customgrid[i][j];
      const imgSrc = getImageSrc(block);
      if (imgSrc) {
        walls.push(
          new Boundary({
            position: { x: Boundary.width * j, y: Boundary.height * i },
            image: createImage(imgSrc),
          })
        );
      }
    }
  }

  function getImageSrc(block:string) {
    switch (block) {
      case "-":
        return "./img/pipeHorizontal.png";
      case "|":
        return "./img/pipeVertical.png";
      case "1":
        return "./img/pipeCorner1.png";
      case "2":
        return "./img/pipeCorner2.png";
      case "3":
        return "./img/pipeCorner3.png";
      case "4":
        return "./img/pipeCorner4.png";
      case "b":
        return "./img/block.png";
      case "[":
        return "./img/capLeft.png";
      case "]":
        return "./img/capRight.png";
      case "_":
        return "./img/capBottom.png";
      case "^":
        return "./img/capTop.png";
      case "+":
        return "./img/pipeCross.png";
      case "5":
        return "./img/pipeConnectorTop.png";
      case "6":
        return "./img/pipeConnectorRight.png";
      case "7":
        return "./img/pipeConnectorBottom.png";
      case "8":
        return "./img/pipeConnectorLeft.png";

      case "I":
        return "./img/sprites/cherry.png";
      default:
        return "";
    }
  }

  // Prepare toolbar items
  const toolbarItems = [
    { label: "Wall", type: Boundary, imgSrc: "./img/block.png" },
    { label: "Pellets", type: Pellet },
    { label: "Item", type: Item, imgSrc: "./img/sprites/blueGhost.png" },
    { label: "PowerUp", type: PowerUp },
  ];

  for (let i = 0; i < toolbarItems.length; i++) {
   const { label } = toolbarItems[i];
    if (label == "PowerUp") {
      toolbar.push(
        new PowerUp({
          position: {
            x: 40 * i,
            y: (customgrid.length + 1) * 40 + Boundary.height / 2,
          },
          label: "PowerUp",
        })
      );
    } else if (label == "Item") {
      toolbar.push(
        new Boundary({
          position: {
            x: 40 * i - 30,
            y: (customgrid.length + 1) * 40,
          },
          image: createImage("./img/sprites/cherry.png"),
          label: "Item",
        })
      );
    } else if (label == "Wall") {
      toolbar.push(
        new Boundary({
          position: { x: 40 * i, y: (customgrid.length + 1) * 40 },
          image: createImage("./img/block.png"),
          label: label,
        })
      );
    }
  }

  function drawGrid() {
    for (let i = 0; i < customgrid.length - 1; i++) {
      for (let j = 0; j < customgrid[0].length; j++) {
        const x = j * gridSize;
        const y = i * gridSize;
        if (customgrid[i][j] == "" || customgrid[i][j] == " ") {
          ctx.strokeRect(x, y, gridSize, gridSize);
        }
      }
    }
  }
  // drawGrid()

  function drawElements() {
    walls.forEach((wall) => wall.draw());
    toolbar.forEach((tool) => tool.draw());
  }

  // Initial draw
  drawGrid();
  drawElements();

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (y < (customgrid.length - 2) * 40) {
      handleGridClick(x, y);
    } else {
      handleToolbarClick(x);
    }
  });

  function handleGridClick(x:number, y:number) {
    const blockX = Math.floor(x / gridSize) * gridSize;
    const blockY = Math.floor(y / gridSize) * gridSize;

    if (selectedElements) {
      if (customgrid[blockY / 40][blockX / 40] !== "") {
        //  console.log("already there");
        return;
      }
      addElement(blockX, blockY, selectedElements);
    }
  }

  function handleToolbarClick(x:number) {
    const toolIndex = Math.floor(x / 40);
    const clickedTool = toolbar[toolIndex];

    if (clickedTool) {
      selectedElements= clickedTool.label as string;
      console.log(selectedElements);
    }
  }

  function addElement(x:number, y:number, type:string) {
    let element;
    switch (type) {
      case "Wall":
        customgrid[y / 40][x / 40] = "b";
        element = new Boundary({
          position: { x, y },
          image: createImage("./img/block.png"),
          label: "Wall",
        });
        break;
      case "Pellets":
        customgrid[y / 40][x / 40] = ".";
        element = new Pellet({
          position: { x: x + 25, y: y + 25 },
          label: "Pellets",
        });
        break;
      case "Item":
        customgrid[y / 40][x / 40] = "I";
        element = new Item({
          position: { x: x + 25, y: y + 25 },

          label: "Item",
        });
        break;
      case "PowerUp":
        customgrid[y / 40][x / 40] = "p";
        element = new PowerUp({
          position: { x: x + 25, y: y + 25 },
          label: "PowerUp",
        });
        break;
    }
    if (element) {
      elements.push(element);
    }
  }
}
