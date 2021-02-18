import * as PIXI from 'pixi.js'
import store from '@/store'

export abstract class StageBackground extends PIXI.Container {
  abstract load(): Promise<void>
  readonly area = new PIXI.Rectangle(0, 0, store.state.stageSetting.vw, store.state.stageSetting.vh)
}
