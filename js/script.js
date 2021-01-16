/*
 * @Description: js for snake
 * @Author: Kotori Y
 * @Date: 2021-01-15 21:42:18
 * @LastEditors: Kotori Y
 * @LastEditTime: 2021-01-16 20:28:40
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
  constructor(elem, initX, initY, length) {
    /* {height:20px; width:20px} */
    this.elem = elem;
    this.initX = initX;
    this.initY = initY;
    this.length = length;
    this.width = 20;
    this.speed = 10; // 1s move one grid --> 20px
    this.status = "alive"
    this.head = null
    this.tail = null
    this.snake = null
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
    this.snake = document.querySelectorAll('.snake-body')
    this.tail = this.snake[this.length]

    this.move();
  }

  createHeader() {
    var head = document.createElement("div");
    head.classList = "snake-body header"
    head.style.left = `${this.initX}px`;
    head.style.top = `${this.initY}px`;
    this.head = head
    this.elem.appendChild(head);
  }

  addBody(xPos, yPos) {
    var body = document.createElement("div");
    body.classList = "snake-body";
    body.style.left = `${xPos}px`;
    body.style.top = `${yPos}px`;
    this.elem.appendChild(body);
  }

  move() {
    interval((resolve, id)=>{
      

      this.tail.style.left = `${this.head.offsetLeft+this.width}px`
      this.head.classList.remove("header")
      this.tail.classList.add("header")

      this.head = this.tail
      this.tail = this.tail.previousElementSibling || this.snake[this.length]
      
      console.log(this.head.offsetLeft)

      if (this.head.offsetLeft >= 1580) {
        clearInterval(id)
      }
      
    }, this.speed)
  }

}

elem = document.querySelector('.snake')
snake = new Snake(elem, 840, 800, 5)
