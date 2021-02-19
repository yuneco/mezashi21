import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import { StyledContainer } from './StyledContainer'
import { animate } from '../logics/animate'
import { Linear } from 'gsap'

let instanseSeq = 0

export class Mezashi extends StyledContainer {
  readonly chara = new PIXI.Container()
  private _id = instanseSeq++
  constructor() {
    super()
  }

  async load() {
    const sp = new PIXI.Sprite(await loadSvg('/imgs/Mzs.svg'))
    this.chara.addChild(sp)
    this.chara.scale.set(0.3, 0.3)
    this.addChild(this.chara)
    this.pivot.x = this.width / 2
    this.pivot.y = this.height / 2
  }

  async fire(from: PIXI.Point, angle: number, dist: number) {
    this.position.set(from.x, from.y)
    this.angle = angle
    return animate(this.chara, { x: dist }, 2, Linear.easeNone)
  }

  get id() {
    return 'mzs-' + this._id
  }
}
