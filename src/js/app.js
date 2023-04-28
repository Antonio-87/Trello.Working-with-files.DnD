/**
 * Entry point of app: don't change this
 */
import InnCardTesks from "./InnCardTasks";
// don't write your code here

document.addEventListener("DOMContentLoaded", () => {
  const cardsTodo = new InnCardTesks("todo");
  cardsTodo.bindToDOM();
  const cardInProgress = new InnCardTesks("in progress");
  cardInProgress.bindToDOM();
  const cardDone = new InnCardTesks("done");
  cardDone.bindToDOM();
});

window.addEventListener("unload", () => {
  const cardTasks = [...document.querySelectorAll(".card-tasks")];
  for (let item of cardTasks) {
    const tasks = item.querySelector(".tasks").innerHTML;
    localStorage.setItem(
      item.querySelector("h2").textContent.toLocaleLowerCase(),
      JSON.stringify(tasks)
    );
  }
});
