import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import { FilterOptionParam } from '@/sprites/StyledContainer'
import { items } from '@/assets/PlanetItemDef'
import { PlanetItemBase } from './PlanetItemBase'

export class RedFlower extends PlanetItemBase {
  constructor(size = 200, filter?: FilterOptionParam) {
    super(size, filter)
  }

  async load() {
    const def = items.redFlower
    const spFl = new PIXI.Sprite(await loadSvg(`${def.imgDir}/Flower.svg`, this.size / 4))
    const spStem = new PIXI.Sprite(await loadSvg(`${def.imgDir}/Stem.svg`, 5, this.size))
    spFl.pivot.set(0.5, 1)
    spStem.pivot.set(0.5, 1)
    spStem.position.set(-spStem.width / 2, -this.size)
    spFl.position.set(-spFl.width / 2, spStem.y - spFl.height)

    const texLeaf = await loadSvg(`${def.imgDir}/Leaf.svg`, 20)
    const leafCount = Math.floor(this.size / 30)
    const leafs = new Array(leafCount - 1).fill(0).map((_, index) => {
      const leafIndex = index
      const spLeaf = new PIXI.Sprite(texLeaf)
      spLeaf.pivot.set(0.5, 1)
      spLeaf.angle = leafIndex % 2 ? -130 : 130
      spLeaf.x = 7
      spLeaf.y = -(leafIndex / leafCount) * this.size - 15
      spLeaf.scale.set(0.5 + (1 - leafIndex / leafCount) * 0.5)
      return spLeaf
    })

    this.chara.addChild(spStem, spFl, ...leafs)
    this.addChild(this.chara)
  }
}
