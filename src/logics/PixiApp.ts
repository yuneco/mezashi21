import * as PIXI from 'pixi.js'
import store from '@/store'

const defineStageSize = () => {
  // base: 375 * 630
  const BASE_W = 375 * 2
  const BASE_H = 600 * 2
  const winW = window.innerWidth
  const winH = window.innerHeight
  const ratio = Math.min(winW / BASE_W, winH / BASE_H)
  return { width: BASE_W * ratio, height: BASE_H * ratio, scale: ratio, vw: BASE_W, vh: BASE_H }
}

export class PixiApp {
  private readonly app: PIXI.Application
  private readonly world: PIXI.Container

  constructor(canvas: HTMLCanvasElement) {
    const size = defineStageSize()

    this.app = new PIXI.Application({
      width: size.width,
      height: size.height,
      view: canvas,
      backgroundColor: 0xcccccc,
      resolution: window.devicePixelRatio || 1,
      antialias: true,
      autoDensity: true,
      transparent: true
    })

    const worldRoot = new PIXI.Container()
    worldRoot.width = size.vw
    worldRoot.height = size.vh
    this.world = worldRoot

    this.app.stage.addChild(worldRoot)
    worldRoot.scale.set(size.scale)

    store.commit('setStageSetting', {
      width: size.width,
      height: size.height,
      scale: size.scale,
      vw: size.vw,
      vh: size.vh
    })
  }

  get stage() {
    return this.world
  }
}
