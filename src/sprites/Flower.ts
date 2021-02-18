import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import { FilterOptionParam, StyledContainer } from './core/StyledContainer'

export class Flower extends StyledContainer {
  readonly chara = new PIXI.Container()
  readonly len: number
  constructor(len = 200, filter?: FilterOptionParam) {
    super(filter)
    this.len = len
  }

  async load() {
    const spFl = new PIXI.Sprite(await loadSvg('/imgs/items/Flower.svg', this.len / 4))
    const spStem = new PIXI.Sprite(await loadSvg('/imgs/items/Stem.svg', 5, this.len))
    spFl.pivot.set(0.5, 1)
    spStem.pivot.set(0.5, 1)
    spStem.position.set(-spStem.width / 2, -this.len)
    spFl.position.set(-spFl.width / 2, spStem.y - spFl.height)

    const texLeaf = await loadSvg('/imgs/items/Leaf.svg', 20)
    const leafCount = Math.floor(this.len / 30)
    const leafs = new Array(leafCount - 1).fill(0).map((_, index) => {
      const leafIndex = index
      const spLeaf = new PIXI.Sprite(texLeaf)
      spLeaf.pivot.set(0.5, 1)
      spLeaf.angle = leafIndex % 2 ? -130 : 130
      spLeaf.x = 7
      spLeaf.y = -(leafIndex / leafCount) * this.len - 15
      spLeaf.scale.set(0.5 + (1 - leafIndex / leafCount) * 0.5)
      return spLeaf
    })

    this.chara.addChild(spStem, spFl, ...leafs)
    this.addChild(this.chara)
  }
}
