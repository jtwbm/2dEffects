import p5 from 'p5';

export class Poisson {
  constructor({
    particleClass,
    radius,
    grid,
  }) {
    this.radius = radius;
    this.grid = grid;

    this.activePoints = [];

    this._createParticle = ({ position, index, radius }) => {
      return new particleClass({ position, index, radius });
    };
  }

  generatePoints(s, canvasWidth, canvasHeight) {
    // add 1st random point
    const { position, index } = this.grid.getRandomPosition(s, canvasWidth, canvasHeight);
    const firstPoint = this._createParticle({
      position,
      index,
      radius: this.radius,
    });
    this.grid.addPoint(firstPoint);
    this.activePoints.push(firstPoint.position);

    while (this.activePoints.length > 0) {
      const randomPointIndex = s.floor(s.random(this.activePoints.length));
      const position = this.activePoints[randomPointIndex];

      this._generateNeighbors(s, position);
      this.activePoints.splice(randomPointIndex, 1);
    }
  }

  _generateNeighbors(s, position) {
    const Candidate = () => {
      const candidate = p5.Vector.random2D();
      const magnitude = s.random(this.radius, this.radius * 2);

      candidate.setMag(magnitude);
      candidate.add(position);

      return candidate;
    };

    const cellReady = (candidate) => {
      const columnIndex = s.floor(candidate.x / this.grid.cellWidth);
      const rowIndex = s.floor(candidate.y / this.grid.cellWidth);
      const cellFilled = this.grid.points[columnIndex + rowIndex * this.grid.columns] !== -1;
      const isInsideGrid = columnIndex > -1 && rowIndex > -1 && columnIndex < this.grid.columns && rowIndex < this.grid.rows;

      return isInsideGrid && !cellFilled;
    };

    for (let n = 0; n < this.grid.attempts; n++) {
      // generate random point
      const candidate = Candidate();
      const goodPoint = cellReady(candidate);

      const columnIndex = s.floor(candidate.x / this.grid.cellWidth);
      const rowIndex = s.floor(candidate.y / this.grid.cellWidth);

      if (goodPoint) {
        // check points around
        let isGoodPoint = true; // the candidate is far enough from neighbors
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const neighborIndex = (columnIndex + i) + (rowIndex + j) * this.grid.columns;
            const neighborPoint = this.grid.points[neighborIndex];

            if (neighborPoint === undefined || neighborPoint === -1) continue;

            const distanceBetweenPoints = p5.Vector.dist(candidate, neighborPoint.position);
            if (distanceBetweenPoints < this.radius) {
              isGoodPoint = false;
            }
          }
        }

        if (isGoodPoint) {
          // add new point
          const newPoint = this._createParticle({
            index: columnIndex + rowIndex * this.grid.columns,
            position: candidate,
            radius: this.radius,
          });

          this.grid.addPoint(newPoint);
          this.activePoints.push(newPoint.position);
        }
      }
    }
  }
}