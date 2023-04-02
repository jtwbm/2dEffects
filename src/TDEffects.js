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
  }
}
