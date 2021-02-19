import * as PIXI from 'pixi.js'
import store from '@/store'
//import { AdvancedBloomFilter } from '@pixi/filter-advanced-bloom'
import { BloomFilter } from '@pixi/filter-bloom'
import { AdjustmentFilter } from '@pixi/filter-adjustment'
import { GlowFilter } from '@pixi/filter-glow'
import { loadSvg } from './loadImgs'

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
  readonly frontLayer: PIXI.Container
  readonly bgLayer: PIXI.Container
  private _cameraFocusObject?: PIXI.DisplayObject
  cameraY: number
  cameraZoom: number

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

    // ワールド = ステージ直下のスケール調整されたレイヤー
    const world = new PIXI.Container()
    world.name = 'world'
    world.width = size.vw
    world.height = size.vh
    this.world = world
    this.stage.addChild(world)
    world.scale.set(size.scale)

    // 背景レイヤー = ワールド下層の固定位置レイヤー
    const bgLayer = new PIXI.Container()
    this.world.addChild(bgLayer)
    this.bgLayer = bgLayer

    // カメラレイヤー = メインのキャラクター配置レイヤー。カメラ追従
    const cameraLayer = new PIXI.Container()
    cameraLayer.width = size.vw
    cameraLayer.height = size.vh
    this.cameraLayer = cameraLayer
    this.world.addChild(cameraLayer)
    this.cameraY = 0.75
    this.cameraZoom = 1.0

    // 前面レイヤー = ワールド上層の固定位置レイヤー
    const frontLayer = new PIXI.Container()
    this.world.addChild(frontLayer)
    this.frontLayer = frontLayer

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

  moveCamera(obj?: PIXI.DisplayObject) {
    const target = obj ?? this._cameraFocusObject
    if (!target) {
      console.warn('No camera target')
      return
    }
    const gPos = target.toGlobal(target.pivot).clone()
    const stageSetting = store.state.stageSetting
    gPos.x /= stageSetting.scale
    gPos.y /= stageSetting.scale

    const gAngle = getGlobalAngle(target)

    const center = new PIXI.Point(stageSetting.vw * 0.5, stageSetting.vh * this.cameraY)
    this.cameraLayer.x -= gPos.x - center.x
    this.cameraLayer.y -= gPos.y - center.y
    this.cameraLayer.angle -= gAngle
    this.cameraLayer.scale.set(this.cameraZoom, this.cameraZoom)
  }

  global2Camera(gPos: PIXI.IPoint): PIXI.Point {
    return this.cameraLayer.toLocal(gPos)
  }

  get cameraFocusObject() {
    return this._cameraFocusObject
  }

  set cameraFocusObject(v) {
    this._cameraFocusObject = v
    this.moveCamera()
  }

  async setStageFilter(filterType?: 'water' | 'dark') {
    this.stage.filters = []
    this.cameraLayer.filters = []
    if (!filterType) {
      return
    }
    if (filterType === 'water') {
      const tex = new PIXI.Sprite(
        await loadSvg(
          '/imgs/paperNoise2.png',
          store.state.stageSetting.width,
          store.state.stageSetting.height
        )
      )
      this.stage.filters = [new PIXI.filters.DisplacementFilter(tex, 12)]
    }
    if (filterType === 'dark') {
      this.cameraLayer.filters = [
        new AdjustmentFilter({ gamma: 0.2, saturation: 0.8, brightness: 0.25, red: 1.3 }),
        new BloomFilter(6),
        new GlowFilter({ innerStrength: 1.8, outerStrength: 1, color: 0xe1ae89 })
      ]
    }
  }
}
