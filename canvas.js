const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.95;
  canvas.height = window.innerHeight * 0.95;
}
resizeCanvas();

// resize event listener
window.addEventListener("resize", () => {
  resizeCanvas();
  init();
});

const ballCount = 300;
const maxRadius = 10;
const minRadius = 6;
const ballArray = [];

// ball class

class Ball {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  // draw arc - circle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    // update position
    this.x += this.dx;
    this.y += this.dy;

    // check for wall-collisions
    if (this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius;
      this.dx = -this.dx;
    } else if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.dx = -this.dx;
    }

    if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius;
      this.dy = -this.dy;
    } else if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.dy = -this.dy;
    }

    this.draw();
  }
}

// initialize the balls
function init() {
  ballArray.length = 0;

  for (let i = 0; i < ballCount; i++) {
    const radius = getRandomNumber(minRadius, maxRadius);
    let x, y;
    let isValidPosition;

    do {
      x = getRandomNumber(radius, canvas.width - radius);
      y = getRandomNumber(radius, canvas.height - radius);
      isValidPosition = true;

      for (const ball of ballArray) {
        const dx = x - ball.x;
        const dy = y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < radius + ball.radius) {
          isValidPosition = false;
          break;
        }
      }
    } while (!isValidPosition);

    const dx = getRandomNumber(-2, 2);
    const dy = getRandomNumber(-2, 2);
    const color = getRandomColor();
    ballArray.push(new Ball(x, y, dx, dy, radius, color));
  }
}

// handle ball-collisions
function handleCollisions() {
  for (let i = 0; i < ballArray.length; i++) {
    for (let j = i + 1; j < ballArray.length; j++) {
      const ball1 = ballArray[i];
      const ball2 = ballArray[j];

      const dx = ball1.x - ball2.x;
      const dy = ball1.y - ball2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ball1.radius + ball2.radius) {
        const overlap = ball1.radius + ball2.radius - distance;
        const halfOverlap = overlap / 2;

        const angle = Math.atan2(dy, dx);
        const adjustX = Math.cos(angle) * halfOverlap;
        const adjustY = Math.sin(angle) * halfOverlap;

        ball1.x += adjustX;
        ball1.y += adjustY;
        ball2.x -= adjustX;
        ball2.y -= adjustY;

        // simple elastic collision
        const vx1 = ball1.dx;
        const vy1 = ball1.dy;
        ball1.dx = ball2.dx;
        ball1.dy = ball2.dy;
        ball2.dx = vx1;
        ball2.dy = vy1;
      }
    }
  }
}

// run animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ballArray.forEach((ball) => ball.update());
  handleCollisions();
  requestAnimationFrame(animate);
}

init();
animate();
