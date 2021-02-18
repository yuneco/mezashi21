import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import { StyledContainer } from './core/StyledContainer'
import PaperFilter from '@/filters/PaperFilter'
import { rotate } from './motions/rotate'
import { blink } from './motions/blink'
import store from '@/store'

let instanseSeq = 0

export class Satellite extends PIXI.Container {
  readonly cont: PIXI.Container
  private approachIndicator = new StyledContainer()
  private readonly _id = instanseSeq++
  private readonly imgName: string
  private direction: 'clockwise' | 'unticlockwise' = 'clockwise'
  private sizeVal: number
  private orbitSizeVal: number
  private orbitG?: PIXI.Graphics

  constructor(imgName: string, size = 30, orbit = 300, dur = 8, isClockwise = true) {
    super()
    this.imgName = imgName
    this.sizeVal = size
    this.orbitSizeVal = orbit
    this.direction = isClockwise ? 'clockwise' : 'unticlockwise'
    this.cont = new StyledContainer()
    this.IndicatorAngle = undefined
    rotate(this.cont, dur, isClockwise)
  }

  get id() {
    return 'satellite-' + this._id
  }

  private applySize() {
    if (!this.cont) {
      return
    }
    const scale = this.sizeVal / this.cont.width
    this.cont.scale.set(scale, scale)
  }

  private applyOrbit() {
    // 軌道の円を描く
    if (this.orbitG) {
      this.removeChild(this.orbitG)
    }
    const g = (this.orbitG = new PIXI.Graphics())
    g.lineStyle(2, store.state.appcolor.border)
    g.drawCircle(0, 0, this.orbitSizeVal / 2)
    g.filters = [new PaperFilter(1.5, true)]
    this.addChildAt(g, 0)
    // 衛星本体と侵入検知用のマーカーの高さを合わせる
    const elems = [this.cont, this.approachIndicator]
    elems.forEach(el => {
      el.pivot.y = (-this.orbitSizeVal / 2) * (1 / el.scale.y)
    })
  }

  async load() {
    const sp = new PIXI.Sprite(await loadSvg(`/imgs/${this.imgName}.svg`))
    const indicatorSp = new PIXI.Sprite(await loadSvg('/imgs/Warning.svg', 40))
    blink(indicatorSp, 0.15, Infinity)
    indicatorSp.angle = 180
    indicatorSp.y = 50
    indicatorSp.x = 25
    this.approachIndicator.addChild(indicatorSp)

    sp.anchor.set(0.5, 0.5)
    this.cont.addChild(sp)
    this.addChild(this.cont, this.approachIndicator)
    this.applySize()
    this.applyOrbit()
  }

  get size(): number {
    return this.sizeVal
  }

  set size(v: number) {
    this.sizeVal = v
    this.applySize()
  }

  get orbitSize() {
    return this.orbitSizeVal
  }

  set orbitSize(v: number) {
    this.orbitSizeVal = v
    this.applyOrbit()
  }

  set IndicatorAngle(v: number | undefined) {
    if (v === undefined) {
      this.approachIndicator.visible = false
      return
    }
    this.approachIndicator.visible = true
    this.approachIndicator.angle = v
  }

  get satelliteAngle() {
    return this.cont.angle % 360
  }

  get isClockwise() {
    return this.direction == 'clockwise'
  }
}
