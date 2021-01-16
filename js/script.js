/*
 * @Description:
 * @Author: Kotori Y
 * @Date: 2021-01-15 21:42:18
 * @LastEditors: Kotori Y
 * @LastEditTime: 2021-01-17 00:35:07
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
  constructor(elem, initX, initY, length) {
    /* {height:20px; width:20px} */
    this.elem = elem;
    this.initX = initX;
    this.initY = initY;
    this.length = length;
    this.width = 20;
    this.height = 20;
    this.speed = 50; // 1s move one grid --> 20px
    this.status = "alive";
    this.head = null;
    this.tail = null;
    this.snake = null;
    /* direction
        2
      4   6
        8
      direction
    */
    this.direction = 6;

    this.createHeader();
    for (let idx = 1; idx <= this.length; idx++) {
      this.addBody(this.initX - this.width * idx, this.initY);
    }
    this.snake = document.querySelectorAll(".snake-body");
    this.tail = this.snake[this.length];

    this.turn();
    // this.move();
  }

  createHeader() {
    var head = document.createElement("div");
    head.classList = "snake-body header";
    head.style.left = `${this.initX}px`;
    head.style.top = `${this.initY}px`;
    this.head = head;
    this.elem.appendChild(head);
  }

  addBody(xPos, yPos) {
    var body = document.createElement("div");
    body.classList = "snake-body";
    body.style.left = `${xPos}px`;
    body.style.top = `${yPos}px`;
    this.elem.appendChild(body);
  }

  turn() {
    document.querySelector(".game-area").addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowUp":
          this.direction = 2;
          break;
        case "ArrowDown":
          this.direction = 8;
          break;
        case "ArrowLeft":
          this.direction = 4;
          break;
        case "ArrowRight":
          this.direction = 6;
          break;
        default:
          this.direction = this.direction;
      }
    });
  }

  move() {
    interval((resolve, id) => {
      switch (this.direction) {
        case 2:
          this.tail.style.left = `${this.head.offsetLeft}px`;
          this.tail.style.top = `${this.head.offsetTop - this.height}px`;
          break;
        case 8:
          this.tail.style.left = `${this.head.offsetLeft}px`;
          this.tail.style.top = `${this.head.offsetTop + this.height}px`;
          break;
        case 4:
          this.tail.style.top = `${this.head.offsetTop}px`;
          this.tail.style.left = `${this.head.offsetLeft - this.width}px`;
          break;
        case 6:
          this.tail.style.top = `${this.head.offsetTop}px`;
          this.tail.style.left = `${this.head.offsetLeft + this.width}px`;
          break;
      }

      this.head.classList.remove("header");
      this.tail.classList.add("header");

      this.head = this.tail;
      this.tail = this.tail.previousElementSibling || this.snake[this.length];

      console.log(this.head.offsetLeft);

      if (this.head.offsetLeft >= 1580) {
        clearInterval(id);
      }
    }, this.speed);
  }
}

class Board {}

elem = document.querySelector(".snake");
snake = new Snake(elem, 600, 800, 30);

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    snake.move();
  }
});
