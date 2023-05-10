/**
 * Entry point of app: don't change this
 */
import InnCardTasks from "./InnCardTasks";
import Controller from "./Controller";

/**Отрисовываем карточки */
document.addEventListener("DOMContentLoaded", () => {
  const cardsTodo = new InnCardTasks("todo");
  cardsTodo.bindToDOM();
  const cardInProgress = new InnCardTasks("in progress");
  cardInProgress.bindToDOM();
  const cardDone = new InnCardTasks("done");
  cardDone.bindToDOM();
});

/**Подключаем управление DnD*/
const controller = new Controller(document.querySelector(".tasks"));

document.documentElement.addEventListener("mouseover", controller.onMouseOver);
document.documentElement.addEventListener("mouseout", controller.onMouseOut);
document.documentElement.addEventListener("mousedown", controller.onMouseDown);
document.documentElement.addEventListener("mousemove", controller.onMouseMove);
document.documentElement.addEventListener("mouseup", controller.onMouseUp);

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
