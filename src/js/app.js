/**
 * Entry point of app: don't change this
 */
import InnCardTesks from "./InnCardTasks";
// don't write your code here
const board = document.querySelector(".board-tasks");
let draggedEl = null;
let shiftX;
let shiftY;

/**Отрисовываем карточки */
document.addEventListener("DOMContentLoaded", () => {
  const cardsTodo = new InnCardTesks("todo");
  cardsTodo.bindToDOM();
  const cardInProgress = new InnCardTesks("in progress");
  cardInProgress.bindToDOM();
  const cardDone = new InnCardTesks("done");
  cardDone.bindToDOM();
});

/**При перезагрузке записываем  в LocalStorage имеющиеся задачи по карточкам*/
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

/**Опеределяем переносимую карточку, рассчитываем координаты точки взятия */
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

/**Закрепляем координаты за переносимой карточкой */
function onMouseMove(e) {
  e.preventDefault();
  if (!draggedEl) {
    return;
  }
  draggedEl.style.left = `${e.pageX - shiftX}px`;
  draggedEl.style.top = `${e.pageY - shiftY}px`;
}

/**Вставляем в выделенное подкарточку место*/
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

/**Выделем место при наведении по размерам переносимой карточки */
document.documentElement.addEventListener("mouseover", (e) => {
  const plugElement = document.createElement("li");
  plugElement.classList.add("drop");
  if (draggedEl && draggedEl != e.target) {
    plugElement.style.height = draggedEl.offsetHeight + "px";
    const { top, bottom } = draggedEl.getBoundingClientRect();
    const parentEl = document.elementFromPoint(e.clientX, e.clientY);
    if (
      e.target.classList.contains("task") &&
      !e.target.classList.contains("preview")
    ) {
      if (document.querySelector(".drop"))
        document.querySelector(".drop").remove();
      const cardTask = parentEl.closest(".card-tasks");
      const ul = cardTask.querySelector("ul");

      if (top - e.clientY < bottom - e.clientY) {
        ul.insertBefore(plugElement, parentEl);
      }
      if (top - e.clientY > bottom - e.clientY) {
        ul.insertBefore(plugElement, parentEl.nextElementSibling);
      }
    }

    if (
      (e.target.tagName === "h2" || e.target.classList.contains("another")) &&
      e.target.closest(".card-tasks")
    ) {
      const cardTask = parentEl.closest(".card-tasks");
      const ul = cardTask.querySelector("ul");
      if (!ul.querySelector("task") && !ul.querySelector(".preview")) {
        if (document.querySelector(".drop")) {
          document.querySelector(".drop").remove();
        }
        ul.insertAdjacentElement("afterbegin", plugElement);
      }
      if (ul.querySelector(".preview")) {
        if (document.querySelector(".drop")) {
          document.querySelector(".drop").remove();
        }
        ul.querySelector(".preview").insertAdjacentElement(
          "afterend",
          plugElement
        );
      }
    }
  }
});
