import p5 from 'p5';

export class Point {
  constructor({
    position,
    index,
    radius,
  }) {
    this.position = position || { x: 0, y: 0 };
    this.index = index || -1;
    this.radius = radius;
    this.nextPoint = null;
    this.progress = 0; // 0-1, прогресс движения по направлению к nextPoint
  }

  draw(s) {
    if (this.index === -1) return;

    s.stroke(10);
    s.strokeWeight(5);
    s.point(this.position.x, this.position.y);

    this.next(s);
  }

  next(s) {
    if (!this.nextPoint) {
      this.nextPoint = this.randomNeighbor(s, this.position);
    }

    if (this.progress >= 1) {
      this.progress = 0;
      this.position.x = this.nextPoint.x;
      this.position.y = this.nextPoint.y;
      this.nextPoint = this.randomNeighbor(s, this.position);
    }

    const start = s.createVector(this.position.x, this.position.y);
    const end = s.createVector(this.nextPoint.x, this.nextPoint.y);
    this.position = p5.Vector.lerp(start, end, this.progress);
    this.progress += 0.1;
  }

  randomNeighbor(s, position) {
    const candidate = p5.Vector.random2D();
    const magnitude = s.random(this.radius, this.radius * 2);

    candidate.setMag(magnitude);
    candidate.add(position);

    return candidate;
  }
}
