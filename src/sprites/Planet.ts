import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import { StyledContainer } from './core/StyledContainer'
import store from '@/store'

export class Planet extends StyledContainer {
  private sizeVal: number
  private cont = new PIXI.Container()
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
    const sprite = new PIXI.Sprite(await loadSvg('/imgs/Planet1.svg'))
    this.cont.addChild(sprite)
    this.addChild(this.cont)
    this.pivot.x = this.width / 2
    this.pivot.y = this.height / 2
    this.applySize()

    sprite.interactive = true
    sprite.on('pointertap', (ev: PIXI.InteractionEvent) => {
      const pos = sprite.toLocal(ev.data.global)
      const dist = Math.hypot(sprite.width / 2 - pos.x, sprite.height / 2 - pos.y)
      if (dist < sprite.width / 2) {
        ev.stopPropagation()
        store.dispatch('tamaJump')
      }
    })
  }

  get size(): number {
    return this.sizeVal
  }

  set size(v: number) {
    this.sizeVal = v
    this.applySize()
  }
}
