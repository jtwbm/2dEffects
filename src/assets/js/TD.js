import p5 from 'p5';
import { Grid } from './Grid';

export class TD {
  constructor({
    radius,
    generate, // генерация объектов на сетке
    particles, // генерация объекта
  }) {
    this.radius = radius;

    this.grid = new Grid({
      attempts: 25,
      radius: this.radius,
    });

    this.generateModule = new generate.module({
      particleClass: particles.module,
      radius: this.radius,
      grid: this.grid,
    });

    new p5(this.sketch.bind(this));
  }

  sketch(s) {
    s.setup = () => {
      s.frameRate(3);
      s.createCanvas(600, 600);
      s.background('rgba(255, 255, 255, 0)');
      s.strokeWeight(4);

      this.width = s.width;
      this.height = s.height;

      this.grid.generate(s, this.width, this.height);
      this.generateModule.generatePoints(s, this.width, this.height);
    };

    s.draw = () => {
      s.clear()
      s.background('rgba(255, 255, 255, 0)');
      // s.noLoop();

      for (let i = 0; i < this.grid.points.length; i++) {
        if (this.grid.points[i] === -1) continue;
        this.grid.points[i].draw(s);
      }
    };
  }
}
