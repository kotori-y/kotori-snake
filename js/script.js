/*
 * @Description: script for my snake
 * @Author: Kotori Y
 * @Date: 2021-01-15 21:42:18
 * @LastEditors: Kotori Y
 * @LastEditTime: 2021-01-20 19:08:44
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

class Snake {
  #head = null;
  #tail = null;
  #snake = null;
  #width = 20;
  #height = 20;
  #initX = null;
  #initY = null;
  #areaHeight = null;
  #areaWidth = null;
  allowTurn = false;
  constructor(elem, length, speed) {
    /* {height:20px; width:20px} */
    this.elem = elem;
    this.length = length;
    this.speed = speed; // 50ms move one grid --> 20px
    this.status = "sleep"; // ["sleep", "alive", "dead"]
    /* direction
        2
      4   6
        8
      direction
    */
    this.direction = 6;

    this.#areaWidth = elem.parentElement.clientWidth;
    this.#areaHeight = elem.parentElement.clientHeight;

    this.#initX = this.#areaWidth / 2 + Math.ceil(length/2) * this.#width;
    this.#initY = this.#areaHeight - 80;

    this.#createHeader();
    for (let idx = 1; idx <= this.length; idx++) {
      this.addBody(this.#initX - this.#width * idx, this.#initY);
    }
    this.#snake = document.querySelectorAll(".snake-body");
    this.#tail = this.#snake[this.length];
  }

  #createHeader() {
    var head = document.createElement("div");
    head.classList = "snake-body header";
    head.style.left = `${this.#initX}px`;
    head.style.top = `${this.#initY}px`;
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

  #isColliding(div1, div2) {
    var d1Offset = { left: div1.offsetLeft, top: div1.offsetTop };
    var d2Offset = { left: div2.offsetLeft, top: div2.offsetTop };

    var notColliding =
      d1Offset.left !== d2Offset.left || d1Offset.top !== d2Offset.top;

    return !notColliding;
  }

  #isBited() {
    var bodys = document.querySelectorAll(".snake-body:not(.header)");
    var bited = Array.from(bodys).some((_body) =>
      this.#isColliding(this.#head, _body)
    );
    return bited;
  }

  #isOverspill() {
    return !(
      this.#head.offsetLeft >= 0 &&
      this.#head.offsetLeft <= this.#areaWidth - this.#width &&
      this.#head.offsetTop >= 0 &&
      this.#head.offsetTop <= this.#areaHeight - this.#height
    );
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

      this.allowTurn = true;

      this.#head.classList.remove("header");
      this.#tail.classList.add("header");

      this.#head = this.#tail;
      this.#tail =
        this.#tail.previousElementSibling || this.#snake[this.length];

      var oversplill = this.#isOverspill();
      var bited = this.#isBited();

      switch (true) {
        case !oversplill && !bited:
          resolve();
          break;
        case bited:
          clearInterval(id);
          this.status = "dead";
          this.#head.classList.add("bited");
          break;
        default:
          clearInterval(id);
          this.status = "dead";
          break;
      }
    }, this.speed);
  }

  move() {
    this.#move();
    this.status = "alive";
  }
}


class Controller extends Snake {
  constructor(elem, length, speed) {
    super(elem, length, speed);

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
    if (this.allowTurn) {
      switch (e.code) {
        case "ArrowUp":
          this.direction = this.direction != 8 ? 2 : 8;
          break;
        case "ArrowDown":
          this.direction = this.direction != 2 ? 8 : 2;
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
      this.allowTurn = false
    }
  };
}




elem = document.querySelector(".snake");
game = new Controller(elem, 30, 100);
