/**
 * Entry point of app: don't change this
 */
import InnCardTesks from "./InnCardTasks";
// don't write your code here
const board = document.querySelector(".board-tasks");
let draggedEl = null;
let shiftX;
let shiftY;

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

document.documentElement.addEventListener("mousedown", (e) => {
  if (
    e.target.classList.contains("task") &&
    !e.target.classList.contains("preview")
  ) {
    e.preventDefault();
    draggedEl = e.target;
    draggedEl.classList.add("dragged");
    board.style.cursor = "grabbing";
    shiftX = e.clientX - e.target.getBoundingClientRect().left;
    shiftY = e.clientY - e.target.getBoundingClientRect().top;

    document.documentElement.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseup", onMouseUp);
  }
});

function onMouseMove(e) {
  e.preventDefault();
  if (!draggedEl) {
    return;
  }
  draggedEl.style.left = `${e.pageX - shiftX}px`;
  draggedEl.style.top = `${e.pageY - shiftY}px`;
}

function onMouseUp(e) {
  if (!draggedEl) {
    return;
  }
  const replaceEL = document.elementFromPoint(e.clientX, e.clientY);
  if (
    (!replaceEL.classList.contains("preview") &&
      replaceEL.classList.contains("drop")) ||
    replaceEL.classList.contains("task")
  ) {
    const { top } = replaceEL.getBoundingClientRect();
    if (e.pageY > window.scrolly + top + replaceEL.offsetHeight / 2) {
      replaceEL
        .closest(".tasks")
        .insertBefore(draggedEl, replaceEL.nextElementSibling);
    } else {
      replaceEL.closest(".tasks").insertBefore(draggedEl, replaceEL);
    }
  }
  draggedEl.classList.remove("dragged");
  draggedEl.style = "";

  if (document.querySelector(".drop")) document.querySelector(".drop").remove();

  board.style.cursor = "pointer";
  draggedEl = null;

  document.documentElement.removeEventListener("mousemove", onMouseMove);
  document.documentElement.removeEventListener("mouseup", onMouseUp);
}

document.documentElement.addEventListener("mouseover", (e) => {
  if (
    draggedEl &&
    draggedEl != e.target &&
    e.target.classList.contains("task") &&
    !e.target.classList.contains("preview")
  ) {
    const plugElement = document.createElement("li");
    plugElement.classList.add("drop");
    plugElement.style.height = draggedEl.offsetHeight + "px";
    const { top, bottom } = draggedEl.getBoundingClientRect();
    const parentEl = document.elementFromPoint(e.clientX, e.clientY);
    const cardTask = parentEl.closest(".card-tasks");
    const ul = cardTask.querySelector("ul");
    if (document.querySelector(".drop"))
      document.querySelector(".drop").remove();
    if (top - e.clientY < bottom - e.clientY) {
      ul.insertBefore(plugElement, parentEl);
    }
    if (top - e.clientY > bottom - e.clientY) {
      ul.insertBefore(plugElement, parentEl.nextElementSibling);
    }
  }
});
