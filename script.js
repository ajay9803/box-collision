// inner container

const container = document.getElementById("container");

let containerWidth = container.clientWidth;
let containerHeight = container.clientHeight;

// resize event listener

window.addEventListener("resize", () => {
  containerWidth = container.clientWidth;
  containerHeight = container.clientHeight;
  init();
});

// initialize the balls
function init() {
  // remove existing balls
  ballArray.length = 0;
  document.querySelectorAll(".ball").forEach((ball) => ball.remove());

  const spawnMargin = maxRadius * 2;

  for (let i = 0; i < ballCount; i++) {
    const radius = getRandomNumber(minRadius, maxRadius);
    let x, y;
    let isValidPosition;

    do {
      x = getRandomNumber(
        radius + spawnMargin,
        containerWidth - radius - spawnMargin
      );
      y = getRandomNumber(
        radius + spawnMargin,
        containerHeight - radius - spawnMargin
      );
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

    const ball = new Ball(x, y, dx, dy, radius, color);
    ballArray.push(ball);
  }
}

function handleCollisions() {
  for (let i = 0; i < ballArray.length; i++) {
    for (let j = i + 1; j < ballArray.length; j++) {
      const ball1 = ballArray[i];
      const ball2 = ballArray[j];

      const dx = ball1.x - ball2.x;
      const dy = ball1.y - ball2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= ball1.radius + ball2.radius) {
        // resolve collision
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // rotate ball1's velocity
        const vx1 = ball1.dx * cos + ball1.dy * sin;
        const vy1 = ball1.dy * cos - ball1.dx * sin;

        // rotate ball2's velocity
        const vx2 = ball2.dx * cos + ball2.dy * sin;
        const vy2 = ball2.dy * cos - ball2.dx * sin;

        // collision reaction: Swap velocities in x direction
        const vx1Final = vx2;
        const vx2Final = vx1;

        // update ball velocities
        ball1.dx = vx1Final * cos - vy1 * sin;
        ball1.dy = vy1 * cos + vx1Final * sin;
        ball2.dx = vx2Final * cos - vy2 * sin;
        ball2.dy = vy2 * cos + vx2Final * sin;

        // ddjust positions to prevent overlap
        const overlap = ball1.radius + ball2.radius - distance;
        ball1.x += (overlap / 2) * cos;
        ball1.y += (overlap / 2) * sin;
        ball2.x -= (overlap / 2) * cos;
        ball2.y -= (overlap / 2) * sin;
      }
    }
  }
}

// run animation loop
function animate() {
  ballArray.forEach((ball) => ball.move());
  handleCollisions();
  requestAnimationFrame(animate);
}

init();
animate();
