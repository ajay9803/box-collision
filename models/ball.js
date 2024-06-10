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

    // check if the ball falls within the range of mouse hover

    if (
      mouse.x - this.x < 100 &&
      mouse.x - this.x > -100 &&
      mouse.y - this.y < 100 &&
      mouse.y - this.y > -100
    ) {
      if (this.radius < maxRadius) {
        this.radius += 2;
        this.element.style.width = `${this.radius * 2}px`;
        this.element.style.height = `${this.radius * 2}px`;
      }
    } else if (this.radius > this.minRadius) {
      this.radius -= 2;
      this.element.style.width = `${this.radius * 2}px`;
      this.element.style.height = `${this.radius * 2}px`;
    }

    this.updatePosition();
  }
}
