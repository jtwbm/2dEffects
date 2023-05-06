class Poisson {
  constructor() {
    this.attempts = 25;
    this.radius = 20;
    this.cellWidth = this.radius / Math.sqrt(2); // 2 dimensions

    this.grid = [];
    this.activePoints = [];
    this.pointsAttempts = [];

    this.gridColumns = 0;
    this.gridRows = 0;
  }

  setup() {
    createCanvas(600, 600);
    background(55);
    strokeWeight(4);
  
    // initialize grid
    this.gridColumns = floor(width / this.cellWidth);
    this.gridRows = floor(height / this.cellWidth);
  
    this.grid.length = this.gridColumns * this.gridRows;
    this.grid.fill(-1);
  
    // get 1st random point
    const x = random(width);
    const y = random(height);
    const i = floor(x / this.cellWidth);
    const j = floor(y / this.cellWidth);
    const position = createVector(x, y);
    const cellIndex = i + j * this.gridColumns;
  
    // add point to grid arrays
    this.grid[cellIndex] = position;
    this.activePoints.push(position);
    this.pointsAttempts[cellIndex] = 1;
  }

  draw() {
    background(0);
    noLoop();
  
    while (this.activePoints.length > 0) {
      const randomPointIndex = floor(random(this.activePoints.length));
      const position = this.activePoints[randomPointIndex];
      let pointFounded = false;
  
      for (let n = 0; n < this.attempts; n++) {
        // generate random point
        const candidate = p5.Vector.random2D();
        const magnitude = random(this.radius, this.radius * 2);
  
        candidate.setMag(magnitude);
        candidate.add(position);
  
        // get point index in grid
        const columnIndex = floor(candidate.x / this.cellWidth);
        const rowIndex = floor(candidate.y / this.cellWidth);
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
  
              const distanceBetweenPoints = p5.Vector.dist(candidate, neighborPoint);
              if (distanceBetweenPoints < this.radius) {
                isGoodPoint = false;
              }
            }
          }
  
          if (isGoodPoint) {
            // add new point
            this.grid[columnIndex + rowIndex * this.gridColumns] = candidate;
            this.activePoints.push(candidate);
            this.pointsAttempts[columnIndex + rowIndex * this.gridColumns] = n + 1;
          }
        }
      }
  
      if (!pointFounded) {
        this.activePoints.splice(randomPointIndex, 1);
      }
    }
  
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i] === -1) continue;
  
      stroke(this.pointsAttempts[i] * 10);
      strokeWeight(5);
      point(this.grid[i].x, this.grid[i].y);
    }
  }
}