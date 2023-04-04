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

class TDVector2 {
  constructor() {
    this.x = 0
    this.y = 0
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
      count: 300,
    }
  }

  generateElements() {
    // const SAMPLES_BEFORE_REJECTION = 30
    // const pointRadius = 30
    // const cellSize = this.radius / Math.sqrt(2)
    // const points = []
    // const spawnPoints = []

    // spawnPoints.push(this.width / 2)

    // while (spawnPoints.length) {
    //   const spawnIndex = this.minMaxRandom(0, spawnPoints.length)
    //   const spawnCentre = spawnPoints[spawnIndex]

    //   for (let i = 0; i < SAMPLES_BEFORE_REJECTION; i++) {
    //     const randomAngle = Math.random() * Math.PI * 2
    //     const direction = [Math.sin(randomAngle), Math.cos(randomAngle)]
    //     const radiusRange = this.minMaxRandom(pointRadius, pointRadius * 2)
    //     const candidatePoint = [
    //       spawnCentre[0] + direction[0] * radiusRange,
    //       spawnCentre[1] + direction[1] * radiusRange,
    //     ]
    //   }
    // }

    // for (let i = 0; i < Math.ceil(this.width / cellSize); i++) {
    //   for (let j = 0; i < Math.ceil(this.height / cellSize); j++) {
    //   }
    // }

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
  constructor({
    ctx,
    position,
  }) {
    this.ctx = ctx
    this.radius = 20
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