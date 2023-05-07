export class Point {
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
