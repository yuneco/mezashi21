import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import { FilterOptionParam, StyledContainer } from './core/StyledContainer'
import { randomFrom } from '@/core/ArrayUtil'

const texNames = ['Ice1', 'Ice2', 'Ice3']

export class Ice extends StyledContainer {
  readonly chara = new PIXI.Container()
  readonly size: number
  constructor(size = 100, filter?: FilterOptionParam) {
    super(filter)
    this.size = size
  }

  async load() {
    const spIce = new PIXI.Sprite(
      await loadSvg(`/imgs/items/${randomFrom(texNames)}.svg`, this.size)
    )
    spIce.anchor.set(0.5, 1)
    spIce.y = this.size * 0.12

    this.chara.addChild(spIce)
    this.addChild(this.chara)
  }
}
