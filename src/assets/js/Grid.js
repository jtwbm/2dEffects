export class Grid {
  constructor({
    attempts = 25,
    radius = 20,
  }) {
    this.attempts = attempts;
    this.radius = radius;
    this.cellWidth = this.radius / Math.sqrt(2); // 2 dimensions
    this.points = [];
    this.columns = 0;
    this.rows = 0;
  }

  generate(s, width, height) {
    this.columns = s.floor(width / this.cellWidth);
    this.rows = s.floor(height / this.cellWidth);

    this.points.length = this.columns * this.rows;
    this.points.fill(-1);
  }

  addPoint(point) {
    // add point to grid arrays
    this.points[point.index] = point;
  }

  removePoint(index) {
    this.points.splice(index, 1);
  }
}
