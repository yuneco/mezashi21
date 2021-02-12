import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import { StyledContainer } from './core/StyledContainer'
import { animate } from './core/animate'
import {Linear} from 'gsap'

export class Mezashi extends StyledContainer {
  private cont = new PIXI.Container()
  constructor() {
    super()
  }


  async load() {
    const sp = new PIXI.Sprite(await loadSvg('/imgs/Mzs.svg'))
    this.cont.addChild(sp)
    this.cont.scale.set(0.3, 0.3)
    this.addChild(this.cont)
    this.pivot.x = this.width / 2
    this.pivot.y = this.height / 2
  }

  async fire(from: PIXI.Point, angle: number, dist: number) {
    this.position.set(from.x, from.y)
    this.angle = angle
    return animate(this.cont, {x: dist}, 2, Linear.easeNone)  
  } 
}
