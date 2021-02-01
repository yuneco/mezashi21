import * as PIXI from 'pixi.js'

export class PixiApp {
  private readonly app: PIXI.Application

  constructor(canvas: HTMLCanvasElement) {
    const width = canvas.parentElement?.offsetWidth || 600
    const height = canvas.parentElement?.offsetHeight || 600

    this.app = new PIXI.Application({
      width,
      height,
      view: canvas,
      backgroundColor: 0xcccccc,
      resolution: window.devicePixelRatio || 1,
      antialias: true,
      autoDensity: true,
      transparent: true
    })
    console.log(this.app)
  }

  get stage() {
    return this.app.stage
  }
}
