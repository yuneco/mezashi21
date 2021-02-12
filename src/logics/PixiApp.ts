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

const getGlobalAngle = (o: PIXI.DisplayObject): number => {
  let angle = o.angle
  let parent = o.parent
  while (parent) {
    angle += parent.angle
    parent = parent.parent
  }
  return angle
}

export class PixiApp extends PIXI.Application {
  readonly world: PIXI.Container
  readonly cameraLayer: PIXI.Container

  constructor(canvas: HTMLCanvasElement) {
    const size = defineStageSize()
    super({
      width: size.width,
      height: size.height,
      view: canvas,
      backgroundColor: 0xcccccc,
      resolution: window.devicePixelRatio || 1,
      antialias: window.devicePixelRatio <= 1,
      autoDensity: true,
      transparent: true
    })
    PIXI.settings.FILTER_RESOLUTION = window.devicePixelRatio || 1

    const world = new PIXI.Container()
    world.name = 'world'
    world.width = size.vw
    world.height = size.vh
    this.world = world
    this.stage.addChild(world)
    world.scale.set(size.scale)

    const cameraLayer = new PIXI.Container()
    cameraLayer.width = size.vw
    cameraLayer.height = size.vh
    this.cameraLayer = cameraLayer
    this.world.addChild(cameraLayer)

    store.commit('setStageSetting', {
      width: size.width,
      height: size.height,
      scale: size.scale,
      vw: size.vw,
      vh: size.vh
    })

    world.interactive = true
    world.hitArea = new PIXI.Rectangle(0, 0, size.vw, size.vh)
  }

  moveCamera(obj: PIXI.DisplayObject) {
    const gPos = obj.toGlobal(obj.pivot).clone()
    const stageSetting = store.state.stageSetting
    gPos.x /= stageSetting.scale
    gPos.y /= stageSetting.scale

    const gAngle = getGlobalAngle(obj)

    const center = new PIXI.Point(stageSetting.vw * 0.5, stageSetting.vh * 0.75)
    this.cameraLayer.x -= gPos.x - center.x
    this.cameraLayer.y -= gPos.y - center.y
    this.cameraLayer.angle -= gAngle
  }

  global2Camera(gPos: PIXI.IPoint): PIXI.Point {
    return this.cameraLayer.toLocal(gPos)
  }
}
