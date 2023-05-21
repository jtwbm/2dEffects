import p5 from 'p5';
import { TDCanvas } from './TDCanvas';
import { Point } from './Point';
import { Grid } from './Grid';

class Main {
  constructor() {
    this.grid = null;
  }
}

export class Poisson {
  constructor() {
    this.radius = 20;

    this.activePoints = [];
    this.grid = new Grid({
      attempts: 25,
      radius: this.radius,
    });

    this.canvas = new TDCanvas({
      setup: (s) => {
        this.grid.generate(s, this.canvas.width, this.canvas.height);
        this.poissonPoints(s);
      },
      draw: (s) => {
        for (let i = 0; i < this.grid.points.length; i++) {
          if (this.grid.points[i] === -1) continue;
          this.grid.points[i].draw(s);
        }
      },
    });

    this.canvas.init();
  }

  generateNeighbors(s, position) {
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
          const newPoint = new Point({
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

  poissonPoints(s) {
    // add 1st random point
    const { position, index } = this.getRandomPosition(s);
    const firstPoint = new Point({
      position,
      index,
      radius: this.radius,
    });
    this.grid.addPoint(firstPoint);
    this.activePoints.push(firstPoint.position);

    while (this.activePoints.length > 0) {
      const randomPointIndex = s.floor(s.random(this.activePoints.length));
      const position = this.activePoints[randomPointIndex];

      this.generateNeighbors(s, position);
      this.activePoints.splice(randomPointIndex, 1);
    }
  }

  getRandomPosition(s) {
    const x = s.random(this.canvas.width);
    const y = s.random(this.canvas.height);
    const i = s.floor(x / this.grid.cellWidth);
    const j = s.floor(y / this.grid.cellWidth);
    const position = s.createVector(x, y);
    const cellIndex = i + j * this.grid.columns;

    return {
      position,
      index: cellIndex,
    };
  }
}