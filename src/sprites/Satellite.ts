import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import { StyledContainer } from './core/StyledContainer'
import PaperFilter from '@/filters/PaperFilter'
import { rotate } from './motions/rotate'

export class Satellite extends PIXI.Container {
  private sizeVal: number
  private orbitSizeVal: number
  private cont: PIXI.Container
  private orbitG?: PIXI.Graphics
  constructor(size = 30, orbit = 300, dur = 8, isClockwise = true) {
    super()
    this.sizeVal = size
    this.orbitSizeVal = orbit
    this.cont = new StyledContainer()
    rotate(this, dur, isClockwise)
  }

  private applySize() {
    if (!this.cont) {
      return
    }
    const scale = this.sizeVal / this.cont.width
    this.cont.scale.set(scale, scale)
  }

  private applyOrbit() {
    if (this.orbitG) {
      this.removeChild(this.orbitG)
    }
    const g = (this.orbitG = new PIXI.Graphics())
    g.lineStyle(2, 0x614d3e)
    g.drawCircle(0, 0, this.orbitSizeVal / 2)
    g.filters = [new PaperFilter()]
    this.addChildAt(g, 0)
    this.cont.y = -this.orbitSizeVal / 2
  }

  async load() {
    const sp = new PIXI.Sprite(await loadSvg('/imgs/Planet2.svg'))
    sp.anchor.set(0.5, 0.5)
    this.cont.addChild(sp)
    this.addChild(this.cont)
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
}
