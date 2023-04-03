class TDCanvas {
  constructor() {
    this.el = document.createElement('canvas')
    this.ctx = this.el.getContext('2d')
    this.pxratio = window.devicePixelRatio
  }

  setSize(width, height) {
    this.width = width * this.pxratio
    this.height = height * this.pxratio

    this.el.setAttribute('width', this.width)
    this.el.setAttribute('height', this.height)
  }
}

class TDEffects {
  constructor(target) {
    const targetEl = document.querySelector(target)

    this.wrapper = targetEl
    this.canvas = new TDCanvas()
    this.canvas.setSize(this.wrapper.offsetWidth, this.wrapper.offsetHeight)
    this.wrapper.appendChild(this.canvas.el)

    this.initOptions()
    this.generateElements()
    this.drawFrame()
  }

  initOptions() {
    this.elements = []

    this.config = {
      count: 200,
    }
  }

  generateElements() {
    for (let n = 0; n < this.config.count; n++) {
      const newElement = new TDCircle({
        ctx: this.canvas.ctx,
        position: {
          x: this.minMaxRandom(0, this.canvas.width),
          y: this.minMaxRandom(0, this.canvas.height),
        },
      })

      this.elements.push(newElement)
    }
  }

  drawFrame() {
    this.elements.forEach((element) => {
      element.draw()
    })
  }

  minMaxRandom(min, max) {
    const random = min + Math.random() * (max + 1 - min)
    return Math.floor(random)
  }
}

class TDCircle {
  constructor({ ctx, position }) {
    this.ctx = ctx
    this.radius = 10
    this.color = '#444444'
    this.opacity = 1
    this.position = position

    this.ctx.fillStyle = this.color
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    this.ctx.closePath()
    this.ctx.fill()
  }
}