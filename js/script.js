/*
 * @Description: script for my snake
 * @Author: Kotori Y
 * @Date: 2021-01-15 21:42:18
 * @LastEditors: Kotori Y
 * @LastEditTime: 2021-01-19 17:02:35
 * @FilePath: \kotori-snake\js\script.js
 * @AuthorMail: kotori@cbdd.me
 */

async function interval(callback, delay) {
  return new Promise((resolve) => {
    let id = setInterval(() => {
      callback(resolve, id);
    }, delay);
  });
}

// async sleeper(delay)

class Snake {
  #head = null;
  #tail = null;
  #snake = null;
  #width = 20;
  #height = 20;
  constructor(elem, initX, initY, length) {
    /* {height:20px; width:20px} */
    this.elem = elem;
    this.initX = initX;
    this.initY = initY;
    this.length = length;
    this.speed = 50; // 1s move one grid --> 20px
    this.status = "sleep"; // ["sleep", "alive", "dead"]
    /* direction
        2
      4   6
        8
      direction
    */
    this.direction = 6;

    this.#createHeader();
    for (let idx = 1; idx <= this.length; idx++) {
      this.addBody(this.initX - this.#width * idx, this.initY);
    }
    this.#snake = document.querySelectorAll(".snake-body");
    this.#tail = this.#snake[this.length];
  }

  #createHeader() {
    var head = document.createElement("div");
    head.classList = "snake-body header";
    head.style.left = `${this.initX}px`;
    head.style.top = `${this.initY}px`;
    this.#head = head;
    this.elem.appendChild(head);
  }

  addBody(xPos, yPos) {
    var body = document.createElement("div");
    body.classList = "snake-body";
    body.style.left = `${xPos}px`;
    body.style.top = `${yPos}px`;
    this.elem.appendChild(body);
  }

  #move() {
    interval((resolve, id) => {
      switch (this.direction) {
        case 2:
          this.#tail.style.left = `${this.#head.offsetLeft}px`;
          this.#tail.style.top = `${this.#head.offsetTop - this.#height}px`;
          break;
        case 8:
          this.#tail.style.left = `${this.#head.offsetLeft}px`;
          this.#tail.style.top = `${this.#head.offsetTop + this.#height}px`;
          break;
        case 4:
          this.#tail.style.top = `${this.#head.offsetTop}px`;
          this.#tail.style.left = `${this.#head.offsetLeft - this.#width}px`;
          break;
        case 6:
          this.#tail.style.top = `${this.#head.offsetTop}px`;
          this.#tail.style.left = `${this.#head.offsetLeft + this.#width}px`;
          break;
      }

      this.#head.classList.remove("header");
      this.#tail.classList.add("header");

      this.#head = this.#tail;
      this.#tail =
        this.#tail.previousElementSibling || this.#snake[this.length];

      console.log(this.#head.offsetLeft);

      this.#head.offsetLeft >= 0 &&
      this.#head.offsetLeft <= 1580 &&
      this.#head.offsetTop >= 0 &&
      this.#head.offsetTop <= 880
        ? resolve()
        : clearInterval(id);
    }, this.speed);
  }

  move() {
    this.#move();
    this.status = "alive";
  }
}

class Controller extends Snake {
  constructor(elem, initX, initY, length) {
    super(elem, initX, initY, length);

    this.#startGame();
  }

  #startGame() {
    var myFunc = (e) => {
      if (e.key === "Enter") {
        this.elem.parentNode.focus();
        this.elem.parentNode.addEventListener("keydown", this.#turn);
        this.move();
        document.removeEventListener("keydown", myFunc);
      }
    };

    document.addEventListener("keydown", myFunc);
  }

  #turn = (e) => {
    switch (e.code) {
      case "ArrowUp":
        this.direction = this.direction != 8 ? 2 : 8;
        break;
      case "ArrowDown":
        this.direction = this.direction != 8 ? 8 : 2;
        break;
      case "ArrowLeft":
        this.direction = this.direction != 6 ? 4 : 6;
        break;
      case "ArrowRight":
        this.direction = this.direction != 4 ? 6 : 4;
        break;
      default:
        this.direction = this.direction;
    }
  };
}

elem = document.querySelector(".snake");
game = new Controller(elem, 600, 800, 30);
