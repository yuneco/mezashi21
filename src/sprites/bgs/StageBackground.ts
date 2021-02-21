import * as PIXI from 'pixi.js'
import store from '@/store'
import { loadSprite } from '@/logics/loadImgs'

export abstract class StageBackground extends PIXI.Container {
  abstract load(): Promise<void>
  readonly area = new PIXI.Rectangle(0, 0, store.state.stageSetting.vw, store.state.stageSetting.vh)

  protected async loadBg(path: string) {
    const sp = await loadSprite(path)
    sp.width = this.area.width
    sp.height = this.area.height
    this.addChild(sp)
  }
}
