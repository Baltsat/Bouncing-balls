// import p5;

const canvas = document.querySelector('canvas');
const paragraph = document.querySelector('p');

const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let tmp = 0;  const framerate = 1; //every (framerate's+1) frame

const tension = 30  *0.01;
const dv = 80*0.01;
const vLimit = 7;

const ballsLimit = 20;
let ballsCount = 0;


function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}
function randomColor(){
  return 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
}



function Shape(x, y, vx, vy, exists){
  this.x = x;
  this.y = y;
  this.vx= vx;
  this.vy = vy;
  this.exists = exists;
}

function Ball(x, y, vx, vy, exists, color, size, mass){
  Shape.call(this, x, y, vx, vy, exists);
  this.color = color;
  this.size = size;
  this.mass = mass;
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function() {
  if (this.exists == true){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}
Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.vx = -(this.vx);
  }
  if ((this.x - this.size) <= 0) {
    this.vx = -(this.vx);
  }
  if ((this.y + this.size) >= height) {
    this.vy = -(this.vy);
  }
  if ((this.y - this.size) <= 0) {
    this.vy = -(this.vy);
  }
  this.x += this.vx;
  this.y += this.vy ;
}
Ball.prototype.collisionDetect = function() {
  if (this.exists){
    for (let j = 0; j < balls.length; j++) {
      if (!(this === balls[j])) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance< this.size + balls[j].size && balls[j].exists) {
          balls[j].color = this.color = randomColor();
        }
      }
    }
  }
}


let balls = [];
while (balls.length < ballsLimit) {
  let size = random(10,24);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-5,5),
    random(-5,5),
    true, //exists
    randomColor(),
    size,
    size*size
  );
  balls.push(ball);
  ballsCount ++;
  paragraph.textContent = 'Balls count: ' + ballsCount+'.';
}



function EvilCircle(x, y, vx, vy, exists, size, color, mass){
  Shape.call(this, x, y, vx, vy, exists);
  this.size = size;
  this.color = color;
  this.mass = mass;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function(){
    if (this.exists == true){
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = this.color;
      this.size = Math.sqrt(this.mass);
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

EvilCircle.prototype.checkBounds = function(){
    if (this.exists){
      if ((this.x + this.size) >= width) {
        this.x -= Math.abs(this.x+this.size-width);//+this.size*Number((this.x + this.size) > width)
        this.vx = -(this.vx*tension);
      }

      if ((this.x - this.size) <= 0) {
        this.x += Math.abs(this.x-this.size);  //+this.size*Number((this.x - this.size) < 0)
        this.vx = -(this.vx*tension);
      }

      if ((this.y + this.size) >= height) {
        this.y -= Math.abs(this.y+this.size-height);
        this.vy = -(this.vy*tension);
      }

      if ((this.y - this.size) <= 0) {
        this.y += Math.abs(this.y-this.size);
        this.vy = -(this.vy*tension);
      }
      this.x +=this.vx;
      this.y += this.vy;
    }

  }

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
let rightPressed = false; let leftPressed = false; let upPressed = false; let downPressed = false;
function keyDownHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight" || e.key == 'd') {
      rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft" || e.key == 'a') {
      leftPressed = true;
  }
  else if(e.key == "Down" || e.key == "ArrowDown" || e.key == 's') {
      downPressed = true;
  }
  else if(e.key == "Up" || e.key == "ArrowUp" || e.key == 'w') {
      upPressed = true;
  }
}
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.key == 'd') {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft" || e.key == 'a') {
        leftPressed = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown" || e.key == 's') {
        downPressed = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp" || e.key == 'w') {
        upPressed = false;
    }
}
EvilCircle.prototype.setControls = function () {
  const vMag = Math.sqrt(this.vx*this.vx+this.vy*this.vy);
  let vx = Math.abs(this.vx);
  let vy = Math.abs(this.vy);
  let tmp = 10*dv/Math.sqrt(this.mass);
  if (rightPressed && (vx<vLimit || (this.vx<0 && vx>=vLimit))){
    this.vx+=tmp;
  }
   if (leftPressed && (vx<vLimit || (this.vx>0 && vx>=vLimit))){
    this.vx-=tmp;
  }
   if (upPressed && (vy<vLimit || (this.vy>0 && vy>=vLimit))){
    this.vy-=tmp;
  }
   if (downPressed && (vy<vLimit || (this.vy<0 && vy>=vLimit))){
    this.vy+=tmp;
  }
};

EvilCircle.prototype.collisionDetect = function() {
      for (let j = 0; j < balls.length; j++) {
          const dx = this.x - balls[j].x;
          const dy = this.y - balls[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size + balls[j].size & balls[j].exists == true) {
            balls[j].exists = false;
            ballsCount --;
            paragraph.textContent = 'Ball count: ' + ballsCount+'.';
            this.mass += 0.5*balls[j].mass;
          }
        }
      }

let evil = new EvilCircle(width/2*0.6,
                          height/2*1.5,
                          random(-4, 4),
                          random(-4, 4),
                          true,
                          10,
                          'white',
                          900);

function loop() {
  tmp ++;

  if (tmp >=framerate){
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, 0, width, height);

    evil.checkBounds();
    evil.draw();
    evil.collisionDetect();
    evil.setControls();
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].exists == true){
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
      }
    }

    tmp = 0;

  }

  requestAnimationFrame(loop);
}
loop();
