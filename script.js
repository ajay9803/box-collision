const container = document.getElementById("container");

// Basic variable declarations

let containerWidth = container.clientWidth;
let containerHeight = container.clientHeight;

const ballCount = 500;

const maxRadius = 10;
const minRadius = 6;

const ballArray = [];

window.addEventListener("resize", () => {
  containerWidth = container.clientWidth;
  containerHeight = container.clientHeight;
  init();
});

// Utility function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Utility function to generate a random number within a range
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Ball class
class Ball {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color = color;
    this.element = document.createElement("div");
    this.element.className = "ball";
    this.element.style.backgroundColor = this.color;
    container.appendChild(this.element);
    this.updateSize();
    this.updatePosition();
  }

  updateSize() {
    this.element.style.width = `${this.radius * 2}px`;
    this.element.style.height = `${this.radius * 2}px`;
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  move() {
    // Update position
    this.x += this.dx;
    this.y += this.dy;

    // Check for wall-collision
    if (
      (this.x <= 0 && this.dx < 0) ||
      (this.x + this.radius * 2 >= containerWidth && this.dx > 0)
    ) {
      this.dx = -this.dx;
    }
    if (
      (this.y <= 0 && this.dy < 0) ||
      (this.y + this.radius * 2 >= containerHeight && this.dy > 0)
    ) {
      this.dy = -this.dy;
    }

    this.updatePosition();
  }
}

// Initialize the balls 
function init() {
  // Ensure the ball doesn't spawn overlapping other balls
  //  const spawnMargin = Math.max(maxRadius * 2, 200); // Adjust this value as needed

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

// function handleCollisions() {
//   for (let i = 0; i < ballArray.length; i++) {
//     for (let j = i + 1; j < ballArray.length; j++) {
//       const ball1 = ballArray[i];
//       const ball2 = ballArray[j];

//       const dx = ball1.x - ball2.x;
//       const dy = ball1.y - ball2.y;
//       const distance = Math.sqrt(dx * dx + dy * dy);

//       // Check if the balls are colliding
//       if (distance <= ball1.radius + ball2.radius) {
//         // Reverse velocities
//         ball1.dx = -ball1.dx;
//         ball1.dy = -ball1.dy;
//         ball2.dx = -ball2.dx;
//         ball2.dy = -ball2.dy;

//         // Adjust positions to avoid overlap
//         const overlap = (ball1.radius + ball2.radius - distance) / 2;
//         const correctionX = (dx / distance) * overlap;
//         const correctionY = (dy / distance) * overlap;

//         ball1.x += correctionX;
//         ball1.y += correctionY;
//         ball2.x -= correctionX;
//         ball2.y -= correctionY;
//       }
//     }
//   }
// }

function handleCollisions() {
  for (let i = 0; i < ballArray.length; i++) {
    for (let j = i + 1; j < ballArray.length; j++) {
      const ball1 = ballArray[i];
      const ball2 = ballArray[j];

      const dx = ball1.x - ball2.x;
      const dy = ball1.y - ball2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= ball1.radius + ball2.radius) {
        // Resolve collision
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Rotate ball1's position
        const x1 = 0;
        const y1 = 0;

        // Rotate ball2's position
        const x2 = dx * cos + dy * sin;
        const y2 = dy * cos - dx * sin;

        // Rotate ball1's velocity
        const vx1 = ball1.dx * cos + ball1.dy * sin;
        const vy1 = ball1.dy * cos - ball1.dx * sin;

        // Rotate ball2's velocity
        const vx2 = ball2.dx * cos + ball2.dy * sin;
        const vy2 = ball2.dy * cos - ball2.dx * sin;

        // Collision reaction: Swap velocities in x direction (1D collision)
        const vx1Final = vx2;
        const vx2Final = vx1;

        // Update ball velocities based on rotated values
        ball1.dx = vx1Final * cos - vy1 * sin;
        ball1.dy = vy1 * cos + vx1Final * sin;
        ball2.dx = vx2Final * cos - vy2 * sin;
        ball2.dy = vy2 * cos + vx2Final * sin;

        // Adjust positions to prevent overlap
        const overlap = ball1.radius + ball2.radius - distance;
        ball1.x += (overlap / 2) * cos;
        ball1.y += (overlap / 2) * sin;
        ball2.x -= (overlap / 2) * cos;
        ball2.y -= (overlap / 2) * sin;
      }
    }
  }
}

// Animation loop
function animate() {
  ballArray.forEach((ball) => ball.move());
  handleCollisions();
  requestAnimationFrame(animate);
}

// Start the animation
init();
animate();
