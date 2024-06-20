import { keys } from "../constant";
export function eventListener(lastkey) {
  addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "w":
        keys.w.pressed = true;
        keys.lastkey = "w";
        break;
      case "a":
        keys.lastkey = "a";
        keys.a.pressed = true;
        break;
      case "s":
        keys.lastkey = "s";
        keys.s.pressed = true;
        break;
      case "d":
        keys.lastkey = "d";
        keys.d.pressed = true;
        break;
    }
  });
  addEventListener("keyup", ({ key }) => {
    switch (key) {
      case "w":
        keys.w.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
      case "s":
        keys.s.pressed = false;
        break;
      case "d":
        keys.d.pressed = false;
        break;
    }
  });
}
