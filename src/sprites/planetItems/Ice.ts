import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import { FilterOptionParam } from '@/sprites/StyledContainer'
import { randomFrom } from '@/utils/ArrayUtil'
import { items } from '@/assets/PlanetItemDef'
import { PlanetItemBase } from './PlanetItemBase'

export class Ice extends PlanetItemBase {
  constructor(size = 100, filter?: FilterOptionParam) {
    super(size, filter)
  }

  async load() {
    const def = items.ice
    const spIce = new PIXI.Sprite(
      await loadSvg(`${def.imgDir}/Ice${randomFrom([1, 2, 3])}.svg`, this.size)
    )
    spIce.anchor.set(0.5, 1)
    spIce.y = this.size * 0.12

    this.chara.addChild(spIce)
    this.addChild(this.chara)
  }
}
