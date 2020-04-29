const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min+1)) + min;
  return num;
}

function Ball(x, y, vx, vy, color, size){
  this.x = x;
  this.y = y;
  this.vx= vx;
  this.vy = vy;
  this.color = color;
  this.size = size;
}

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
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

let balls = [];

while (balls.length < 20) {
  let size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-5,5),
    random(-5,5),
    'rgb(' + random(30,255) + ',' + random(10,255) + ',' + random(50,255) +')',
    size
  );
  balls.push(ball);
}


let count = 0;
function loop() {
  count ++;

  if (count >=0){
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, width, height);


  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }
  count = 0;
}
  requestAnimationFrame(loop);
}

Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}


loop();
