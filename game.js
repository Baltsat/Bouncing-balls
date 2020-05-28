var imported = document.createElement('script');
imported.src = "Vector.js";
document.head.appendChild(imported);

const canvas = document.querySelector('canvas');
const paragraph = document.querySelector('p');


const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

//SETTINGS
let framerate = 1;          let tmp = 0;
let BestScore = 99999;
const tension = 80   *0.01;
const acceleration = 100   *0.01;
const vLimitation = 10;
const koefficient = 10   *0.00001;

const ballsLimit = 60;
const mass_add_koefficient = 60    *0.01;
let ballsCount = 0;
const timeDelation = 500;

//**************************************************************************************\\

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}
function randomColor(){
  return 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
}


function Shape(coordinate, velocity, exists){
  this.coordinate = coordinate;
  this.velocity= velocity;
  this.exists = exists;
}

function Ball(coordinate, velocity, exists, color, size, mass, time){
  Shape.call(this, coordinate, velocity, exists);
  this.color = color;
  this.size = size;
  this.mass = mass;
  this.time = time;
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function() {
  if (this.exists == true){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.coordinate.x, this.coordinate.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}
Ball.prototype.update = function() {
  if (this.exists){
    if ((this.coordinate.x + this.size) >= width) {
      this.velocity.x = -(this.velocity.x);
    }
    if ((this.coordinate.x - this.size) <= 0) {
      this.velocity.x = -(this.velocity.x);
    }
    if ((this.coordinate.y + this.size) >= height) {
      this.velocity.y = -(this.velocity.y);
    }
    if ((this.coordinate.y - this.size) <= 0) {
      this.velocity.y = -(this.velocity.y);
    }
    this.coordinate.addTo(this.velocity);
  }
}
timer.start();
Ball.prototype.collisionDetect = function() {
  if (this.exists){
    for (let j = 0; j < balls.length; j++) {
      if (!(this === balls[j]) && balls[j].exists) {
        const dx = this.coordinate.x - balls[j].coordinate.x;
        const dy = this.coordinate.y - balls[j].coordinate.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if ((distance< this.size + balls[j].size && balls[j].exists) && ((timer.getTime() - this.time)>timeDelation) && (((timer.getTime()) - balls[j].time )>timeDelation)) {
          balls[j].color = this.color = randomColor();
          balls[j].time = timer.getTime();
          this.time = timer.getTime();
        }
      }
    }
  }
}

let balls = [];
function createBalls(){
  balls = [];
  while (balls.length < ballsLimit) {
    let size = random(24, 48);
    let ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      new Vector(random(0 + size,width - size), random(0 + size,height - size)), //coordinate
      new Vector(random(-5,5), random(-5,5)),  //velocity
      true, //exists
      randomColor(),  //color
      size,  //size
      size*size, //mass,
      0
    );
    balls.push(ball);
    ballsCount +=1;
    paragraph.textContent = 'Balls count: ' + ballsCount + '.';
}}
createBalls();

function EvilCircle(coordinate, velocity, exists, size, color, mass){
  Shape.call(this, coordinate, velocity, exists);
  this.color = color;
  this.size = size;
  this.mass = mass;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function(){
    if (this.exists){
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = this.color;
      this.size = Math.sqrt(this.mass);
      ctx.arc(this.coordinate.x, this.coordinate.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

EvilCircle.prototype.checkBounds = function(){
    if (this.exists){
      if ((this.coordinate.x + this.size) >= width) {
        this.coordinate.x -= Math.abs(this.coordinate.x+this.size-width);//+this.size*Number((this.coordinate.x + this.size) > width)
        this.velocity.x = -(this.velocity.x*tension);
      }

      if ((this.coordinate.x - this.size) <= 0) {
        this.coordinate.x += Math.abs(this.coordinate.x-this.size);  //+this.size*Number((this.coordinate.x - this.size) < 0)
        this.velocity.x = -(this.velocity.x*tension);
      }

      if ((this.coordinate.y + this.size) >= height) {
        this.coordinate.y -= Math.abs(this.coordinate.y+this.size-height);
        this.velocity.y = -(this.velocity.y*tension);
      }

      if ((this.coordinate.y - this.size) <= 0) {
        this.coordinate.y += Math.abs(this.coordinate.y-this.size);
        this.velocity.y = -(this.velocity.y*tension);
      }
    }
    this.coordinate.addTo(this.velocity);
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
function transform(delta, rightPressed, leftPressed, upPressed, downPressed){
  if (rightPressed){
    delta.x ++;
  }
  if (leftPressed){
    delta.x--;
  }
  if (upPressed){
    delta.y --;
  }
  if (downPressed) {
    delta.y++;
  }
  if (Math.abs(delta.x) == 1 & Math.abs(delta.y)==1){
    delta.x = delta.x / Math.sqrt(2);
    delta.y = delta.y / Math.sqrt(2);
  }
}
EvilCircle.prototype.setControls = function () {
  let tmp = 10 * acceleration / Math.sqrt(this.mass);
  let delta = new Vector(0,0);
  transform(delta, rightPressed, leftPressed, upPressed, downPressed);
  delta.x = delta.x * tmp;
  delta.y = delta.y * tmp;
  this.velocity.addTo(delta);
  this.trimVelocity(vLimitation);
}
EvilCircle.prototype.applyForce = function () {
  let tmp = this.mass/ (this.size*this.size * this.velocity.getMagnitude() * this.velocity.getMagnitude());
  let force = new Vector(0,0);
  force.x = - this.velocity.x * tmp/10000;
  force.y = - this.velocity.y * tmp/10000;
  this.velocity.addTo(force);
  this.trimVelocity(vLimitation);
}

EvilCircle.prototype.trimVelocity = function (vLimit) {
  if (this.velocity.getMagnitude() > vLimit){
    this.velocity.setMagnitude(vLimit);
  }
}

EvilCircle.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    const dx = this.coordinate.x - balls[j].coordinate.x;
    const dy = this.coordinate.y - balls[j].coordinate.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if ((distance < this.size + balls[j].size) & (balls[j].exists == true ) & (this.size>=balls[j].size)) {
      balls[j].exists = false;
      ballsCount --;
      paragraph.textContent = 'Ball count: ' + ballsCount+'.';
      this.mass += mass_add_koefficient * balls[j].mass;
    }
  }
}

let vel = new Vector(random(-4, -2),random(-4, 4));
let coord = new Vector(width/2 + random(-10, 10), height / 2 + random(-10,10));
let evil = new EvilCircle(coord,
                          vel,
                          true,//exists
                          10,
                          'white',
                          900);
framerate--;
function loop() {
  tmp ++;
  if (tmp >=framerate){
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, 0, width, height);

    evil.checkBounds();
    evil.draw();
    evil.collisionDetect();
    evil.setControls();
    evil.applyForce();
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].exists == true){
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
      }
    }
    tmp = 0;
    if (ballsCount==0){
      let flag;
      let your_time = document.getElementById('timer-id').innerText;
      let score = Number(your_time);
      if (score<BestScore){
        BestScore = score;
      }
      if (confirm("Your time: "+ your_time+"                                             \
      Best Score: " + BestScore+ "\n\nTry again?") == true) {flag = true;}
      else {flag = false;}
      if (flag){
        rightPressed = false;  leftPressed = false;  upPressed = false;  downPressed = false;
        timer.reset();
        let velocity = new Vector(random(-4, -2),random(-4, 4));
        let coordinate = new Vector(width/2 + random(-10, 10), height / 2 + random(-10,10));
        evil = new EvilCircle(coordinate,
                                  velocity,
                                  true,//exists
                                  10,
                                  'white',
                                  900);
        createBalls();
      }
    else{
      ballsCount = 11;
      paragraph.textContent = 'You are winner!';
    }
  }
  requestAnimationFrame(loop);
  }
}
loop();
