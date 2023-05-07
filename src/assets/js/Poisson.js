import p5 from 'p5';
import { TDCanvas } from './TDCanvas';

class Point {
  constructor({
    position,
    index,
  }) {
    this.position = position || { x: 0, y: 0 };
    this.index = index || -1;
  }

  draw(s) {
    if (this.index === -1) return;

    s.stroke(10);
    s.strokeWeight(5);
    s.point(this.position.x, this.position.y);
  }
}

export class Poisson {
  constructor() {
    this.attempts = 25;
    this.radius = 20;
    this.cellWidth = this.radius / Math.sqrt(2); // 2 dimensions

    this.grid = [];
    this.activePoints = [];

    this.gridColumns = 0;
    this.gridRows = 0;

    this.canvas = new TDCanvas({
      setup: (s) => {
        this.generateGrid(s);
        this.poissonPoints(s);
      },
      draw: (s) => {
        for (let i = 0; i < this.grid.length; i++) {
          if (this.grid[i] === -1) continue;
          this.grid[i].draw(s);
        }
      },
    });

    this.canvas.init();
  }

  addPoint(point) {
    // add point to grid arrays
    this.grid[point.index] = point;
    this.activePoints.push(point.position);
  }

  poissonPoints(s) {
    // add 1st random point
    const { position, index } = this.getRandomPosition(s);
    const firstPoint = new Point({ position, index });
    this.addPoint(firstPoint);

    // search other points
    while (this.activePoints.length > 0) {
      const randomPointIndex = s.floor(s.random(this.activePoints.length));
      const position = this.activePoints[randomPointIndex];
      let pointFounded = false;
  
      for (let n = 0; n < this.attempts; n++) {
        // generate random point
        const candidate = p5.Vector.random2D();
        const magnitude = s.random(this.radius, this.radius * 2);
  
        candidate.setMag(magnitude);
        candidate.add(position);
  
        // get point index in grid
        const columnIndex = s.floor(candidate.x / this.cellWidth);
        const rowIndex = s.floor(candidate.y / this.cellWidth);
        const cellFilled = this.grid[columnIndex + rowIndex * this.gridColumns] !== -1;
        const isInsideGrid = columnIndex > -1 && rowIndex > -1 && columnIndex < this.gridColumns && rowIndex < this.gridRows;
  
        if (isInsideGrid && !cellFilled) {
          // check points around
          let isGoodPoint = true; // the candidate is far enough from neighbors
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const neighborIndex = (columnIndex + i) + (rowIndex + j) * this.gridColumns;
              const neighborPoint = this.grid[neighborIndex];

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
              index: columnIndex + rowIndex * this.gridColumns,
              position: candidate,
            });
            this.addPoint(newPoint);
          }
        }
      }
  
      if (!pointFounded) {
        this.activePoints.splice(randomPointIndex, 1);
      }
    }
  }

  generateGrid(s) {
    // initialize grid
    this.gridColumns = s.floor(this.canvas.width / this.cellWidth);
    this.gridRows = s.floor(this.canvas.height / this.cellWidth);

    this.grid.length = this.gridColumns * this.gridRows;
    this.grid.fill(-1);
  }

  getRandomPosition(s) {
    const x = s.random(this.canvas.width);
    const y = s.random(this.canvas.height);
    const i = s.floor(x / this.cellWidth);
    const j = s.floor(y / this.cellWidth);
    const position = s.createVector(x, y);
    const cellIndex = i + j * this.gridColumns;

    return {
      position,
      index: cellIndex,
    };
  }
}