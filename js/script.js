/*
 * @Description: script for my snake
 * @Author: Kotori Y
 * @Date: 2021-01-15 21:42:18
 * @LastEditors: Kotori Y
 * @LastEditTime: 2021-01-31 16:26:38
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

class Food {
  constructor(foodElem) {
    this.foodElem = foodElem;
    this.areaWidth = snakeElem.parentElement.clientWidth;
    this.areaHeight = snakeElem.parentElement.clientHeight;
  }

  createFood(width, height) {
    this.foodElem.style.width = `${width}px`;
    this.foodElem.style.height = `${height}px`;

    this.foodElem.style.left = `${
      Math.floor(Math.random() * ((this.areaWidth - width) / width)) * width
    }px`;
    this.foodElem.style.top = `${
      Math.floor(Math.random() * ((this.areaHeight - height) / height)) * height
    }px`;
  }
}

class Snake extends Food {
  #head = null;
  #tail = null;
  #snake = null;
  #width = 20;
  #height = 20;
  #initX = null;
  #initY = null;
  allowTurn = false;
  constructor(foodElem, snakeElem, startElem, overElem, length, speed) {
    super(foodElem);
    this.snakeElem = snakeElem;
    this.startElem = startElem;
    this.overElem = overElem;
    this.length = length;
    this.speed = speed; // 50ms move one grid --> 20px
    this.status = "sleep"; // ["sleep", "alive", "dead"]
    this.score = 0;
    this.eatNum = 0;
    /* direction
        2
      4   6
        8
      direction
    */
    this.direction = 6;

    this.#initX = this.areaWidth / 2 + Math.ceil(length / 2) * this.#width;
    this.#initY = this.areaHeight - 80;

    this.#createHeader();
    for (let idx = 1; idx <= this.length; idx++) {
      var body = this.#createBody(this.#initX - this.#width * idx, this.#initY);
      this.snakeElem.appendChild(body);
    }

    this.#snake = document.querySelectorAll(".snake-body");
    this.#tail = this.#snake[this.length];
    this.#createFood(20, 20, false);

    this.#startGame();
  }

  #createHeader() {
    var head = document.createElement("div");
    head.classList = "snake-body header";
    head.style.left = `${this.#initX}px`;
    head.style.top = `${this.#initY}px`;
    this.#head = head;
    this.snakeElem.appendChild(head);
  }

  #createFood(width, height, withoutHead) {
    super.createFood(width, height);
    var bodys = withoutHead
      ? document.querySelectorAll(".snake-body:not(.header)")
      : document.querySelectorAll(".snake-body");

    var overlap = Array.from(bodys).some((_body) =>
      this.#isColliding(this.foodElem, _body)
    );
    if (overlap) {
      this.#createFood(width, height, withoutHead);
    }
  }

  #createBody(xPos, yPos) {
    var body = document.createElement("div");
    body.classList = "snake-body";
    body.style.left = `${xPos}px`;
    body.style.top = `${yPos}px`;
    return body;
  }

  #reset() {
    this.speed = 100;
    this.length = 5;
    this.status = "alive";
    this.snakeElem.innerHTML = "";
    this.direction = 6;

    this.#initX = this.areaWidth / 2 + Math.ceil(length / 2) * this.#width;
    this.#initY = this.areaHeight - 80;

    this.#createHeader();
    for (let idx = 1; idx <= this.length; idx++) {
      var body = this.#createBody(this.#initX - this.#width * idx, this.#initY);
      this.snakeElem.appendChild(body);
    }

    this.#snake = document.querySelectorAll(".snake-body");
    this.#tail = this.#snake[this.length];
    this.#createFood(20, 20, false);
  }

  #isColliding(div1, div2) {
    var d1Offset = { left: div1.offsetLeft, top: div1.offsetTop };
    var d2Offset = { left: div2.offsetLeft, top: div2.offsetTop };

    var notColliding =
      Math.abs(d1Offset.left - d2Offset.left) >= div2.clientWidth ||
      Math.abs(d1Offset.top - d2Offset.top) >= div2.clientHeight;

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
      this.#head.offsetLeft <= this.areaWidth - this.#width &&
      this.#head.offsetTop >= 0 &&
      this.#head.offsetTop <= this.areaHeight - this.#height
    );
  }

  #isAte() {
    return this.#isColliding(this.#head, this.foodElem);
  }

  #move() {
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
  }

  #grow() {
    var x = this.#tail.offsetLeft;
    var y = this.#tail.offsetTop;
    var body = this.#createBody(x, y);
    this.snakeElem.insertBefore(body, this.#tail);
    this.#snake = document.querySelectorAll(".snake-body");
    this.length++;
  }

  move() {
    interval((resolve, id) => {
      this.#move();
      this.#head.classList.remove("header");
      this.#tail.classList.add("header");

      this.#head = this.#tail;
      this.#tail =
        this.#tail.previousElementSibling || this.#snake[this.length];

      this.allowTurn = true;

      var ate = this.#isAte();
      if (ate) {
        this.#grow();

        let [width, height, _score] =
          Math.random() <= 0.1 ? [30, 30, 2] : [20, 20, 20];
        this.eatNum++;
        this.score += _score;
        this.#createFood(width, height, true);
      }
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

      if (this.status === "dead") {
        this.snakeElem.parentNode.style.opacity = 0.5;
        this.overElem.style.opacity = 1;
        this.#startGame();
      }
    }, this.speed);
  }

  #turn = (e) => {
    if (this.allowTurn) {
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          this.direction = this.direction != 8 ? 2 : 8;
          break;
        case "ArrowDown":
        case "KeyS":
          this.direction = this.direction != 2 ? 8 : 2;
          break;
        case "ArrowLeft":
        case "KeyA":
          this.direction = this.direction != 6 ? 4 : 6;
          break;
        case "ArrowRight":
        case "KeyD":
          this.direction = this.direction != 4 ? 6 : 4;
          break;
        default:
          this.direction = this.direction;
      }
      this.allowTurn = false;
    }
  };

  #startGame() {
    var myFunc = (e) => {
      if (e.key === "Enter") {
        if (this.status === "dead") {
          this.#reset();
        }
        this.snakeElem.parentNode.focus();
        this.snakeElem.parentNode.style.opacity = 1;
        this.startElem.style.opacity = 0;
        this.overElem.style.opacity = 0;
        this.snakeElem.parentNode.addEventListener("keydown", this.#turn);
        document.removeEventListener("keydown", myFunc);
        this.move();
      }
    };

    document.addEventListener("keydown", myFunc);
  }
}

// class Controller extends Snake {
//   constructor(foodElem, snakeElem, startElem, overElem, length, speed) {
//     super(foodElem, snakeElem, overElem, length, speed);
//     this.startElem = startElem;
//     this.overElem = overElem;
//     this.#startGame();
//   }

// }

snakeElem = document.querySelector(".snake");
foodElem = document.querySelector(".food");
startElem = document.querySelector(".start");
overElem = document.querySelector(".over");
game = new Snake(foodElem, snakeElem, startElem, overElem, 5, 100);
