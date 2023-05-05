export default class InnCardTesks {
  constructor(title) {
    this.title = title;
    this.board = document.querySelector(".board-tasks");
    this._activTask = undefined;
    this.saveTasks = JSON.parse(localStorage.getItem(this.title.toLowerCase()))
      ? JSON.parse(localStorage.getItem(this.title.toLowerCase()))
      : undefined;

    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  static get markup() {
    return `
      <div class="card-tasks">
        <h2></h2>
        <ul class="tasks">
        </ul>
        <div class="add-card">
          <h3 class="another">+ Add another card</h3>
          <div class="add-button-container unvisible">
              <textarea class="description-card" cols="10" rows="3" maxlength="130" placeholder="Enter a title for this card" required></textarea>
              <button class="add-button">Add Card</button>
              <div class="close-description"></div>
          </div>
        </div>
      </div>
    `;
  }

  static get cardTasksSelector() {
    return ".card-tasks";
  }

  static get tasksSelector() {
    return ".tasks";
  }

  static get descriptionCardSelector() {
    return ".description-card";
  }

  static get addCardSelector() {
    return ".add-card";
  }

  static get anotherSelector() {
    return ".another";
  }
  static get addButtonContainerSelector() {
    return ".add-button-container";
  }

  static get addButtonSelector() {
    return ".add-button";
  }

  static get closeDescriptionSelector() {
    return ".close-description";
  }

  bindToDOM() {
    const boardTasks = document.querySelector(".board-tasks");

    boardTasks.insertAdjacentHTML("beforeend", InnCardTesks.markup);

    this.cardTasks = [
      ...document.querySelectorAll(InnCardTesks.cardTasksSelector),
    ].filter(
      (el) =>
        !el.classList.contains(this.title.toLowerCase()) &&
        el.classList.length < 2
    )[0];
    this.tasks = this.cardTasks.querySelector(InnCardTesks.tasksSelector);
    this.descriptionCard = this.cardTasks.querySelector(
      InnCardTesks.descriptionCardSelector
    );
    this.addCard = this.cardTasks.querySelector(InnCardTesks.addCardSelector);
    this.another = this.cardTasks.querySelector(InnCardTesks.anotherSelector);
    this.addButtonContainer = this.cardTasks.querySelector(
      InnCardTesks.addButtonContainerSelector
    );
    this.addButton = this.cardTasks.querySelector(
      InnCardTesks.addButtonSelector
    );
    this.closeDescription = this.cardTasks.querySelector(
      InnCardTesks.closeDescriptionSelector
    );

    this.innTitle();

    if (!this.tasks.querySelector(".preview") && this.title === "todo")
      this.tasks.innerHTML = `<li class="task preview">Welcome to Trolle!</li>`;

    if (this.saveTasks) this.tasks.innerHTML = this.saveTasks;

    this.board.addEventListener("click", this.onClick);

    this.board.addEventListener("mouseover", this.onMouseOver);

    this.board.addEventListener("mouseout", this.onMouseOut);
  }

  onClick(e) {
    const target = e.target;
    const unActiveAnother = [
      ...document.querySelectorAll(InnCardTesks.anotherSelector),
    ].filter((el) => el.classList.contains("unvisible"));
    const activeAddButton = [
      ...document.querySelectorAll(InnCardTesks.addButtonContainerSelector),
    ].filter((el) => !el.classList.contains("unvisible"));

    if (target == this.another && e.currentTarget !== activeAddButton) {
      unActiveAnother.forEach((el) => el.classList.remove("unvisible"));
      activeAddButton.forEach((el) => el.classList.add("unvisible"));
      this.addButtonContainer.classList.remove("unvisible");
      this.descriptionCard.value = "";
      this.another.classList.add("unvisible");
    }

    if (target == this.addButton) {
      this.addButtonContainer.classList.add("unvisible");
      this.another.classList.remove("unvisible");
      this.addTask();
    }

    if (target == this.closeDescription) {
      this.addButtonContainer.classList.add("unvisible");
      this.another.classList.remove("unvisible");
    }

    if (target.classList.contains("close-task")) {
      target.closest(".task").remove();
    }
  }

  innTitle() {
    const titleList = this.title.split(" ");
    for (let title of titleList) {
      this.cardTasks.classList.add(title.toLowerCase());
    }
    this.cardTasks.querySelector("h2").textContent = titleList
      .join(" ")
      .toUpperCase();
    this.cardTasks = [
      ...document.querySelectorAll(InnCardTesks.cardTasksSelector),
    ].filter((el) => el.classList.contains(titleList[0].toLowerCase()))[0];
  }

  addTask() {
    if (this.descriptionCard.value !== "") {
      const task = document.createElement("li");
      task.classList.add("task");
      task.innerHTML = `
          <p>${this.descriptionCard.value}</p>
          <div class="close-task"></div>
        `;
      if (this.tasks.querySelector(".preview")) {
        this.tasks
          .querySelector(".preview")
          .insertAdjacentElement("afterend", task);
      } else {
        this.tasks.insertAdjacentElement("afterbegin", task);
      }
    }
  }

  onMouseOver(e) {
    const closeTask = e.target.querySelector(".close-task");
    if (
      e.target.classList.contains("task") &&
      !e.target.classList.contains("preview") &&
      !e.target.classList.contains("board-tasks")
    ) {
      if (this._activTask) this._activTask.style.display = "none";
      closeTask.style.display = "block";
      this._activTask = closeTask;
    }
  }

  onMouseOut(e) {
    if (!e.target.classList.contains("task")) {
      if (this._activTask !== undefined) {
        this._activTask.style.display = "none";
      }
    }
  }
}
