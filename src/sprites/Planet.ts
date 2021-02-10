import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import OutlineFilter from '@/filters/OutlineFilter'
import PaperFilter from '@/filters/PaperFilter'

// ↓ Wrong! まちがい
//import { useStore } from 'vuex'
// ↓ Correct! せいかい
import store from '@/store'

export class Planet extends PIXI.Container {
  private sizeVal: number
  private cont?: PIXI.Sprite
  constructor(size = 300) {
    super()
    this.sizeVal = size
  }

  private applySize() {
    if (!this.cont) {
      return
    }
    const scale = this.sizeVal / this.cont.width
    this.scale.set(scale, scale)
  }

  async load() {
    this.cont = new PIXI.Sprite(await loadSvg('/imgs/Planet1.svg'))

    this.addChild(this.cont)

    const stageSetting = store.state.stageSetting
    this.filters = [new OutlineFilter(stageSetting.scale * 5.0), new PaperFilter()]
    this.pivot.x = this.width / 2
    this.pivot.y = this.height / 2
    this.applySize()
  }

  get size(): number {
    return this.sizeVal
  }

  set size(v: number) {
    this.sizeVal = v
    this.applySize()
  }
}
