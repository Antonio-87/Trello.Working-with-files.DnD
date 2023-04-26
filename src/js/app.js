/**
 * Entry point of app: don't change this
 */
import InnCardTesks from "./cardTasks";
// don't write your code here

window.addEventListener("DOMContentLoaded", () => {
  const cardsTodo = new InnCardTesks("todo");
  cardsTodo.bindToDOM();
  cardsTodo.innTitle();
  const cardInProgress = new InnCardTesks("in progress");
  cardInProgress.bindToDOM();
  cardInProgress.innTitle();
  const cardDone = new InnCardTesks("done");
  cardDone.bindToDOM();
  cardDone.innTitle();
});
