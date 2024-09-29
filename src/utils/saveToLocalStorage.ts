export function saveToLocalStorage(
  tmpScore: number,
  highScore: boolean
): [number, boolean] {
  if (localStorage.getItem("pacscore") == null) {
    localStorage.setItem("pacscore", `${tmpScore}`);
  }
  if (Number(localStorage.getItem("pacscore")) < tmpScore) {
    highScore = true;
    localStorage.setItem("pacscore", `${tmpScore}`);
  }
  return [tmpScore, highScore];
}
