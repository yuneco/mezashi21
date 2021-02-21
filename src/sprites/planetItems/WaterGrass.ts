import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import { FilterOptionParam } from '@/sprites/StyledContainer'
import { items } from '@/assets/PlanetItemDef'
import { PlanetItemBase } from './PlanetItemBase'

export class WaterGrass extends PlanetItemBase {
  constructor(size = 200, filter?: FilterOptionParam) {
    super(size, filter)
  }

  async load() {
    const def = items.waterGrass
    const spStem = await this.loadItem(`${def.imgDir}/WarterGrassLeaf.svg`, 5, this.size)
    spStem.pivot.set(0.5, 1)
    spStem.position.set(-spStem.width / 2, -this.size)

    const texLeaf = await loadSvg(`${def.imgDir}/WarterGrassLeaf.svg`, 20)
    const leafCount = Math.floor(this.size / 15)
    const leafs = new Array(leafCount).fill(0).map((_, index) => {
      const leafIndex = index
      const spLeaf = new PIXI.Sprite(texLeaf)
      spLeaf.anchor.set(0.5, 1)
      spLeaf.angle = leafIndex % 2 ? -40 : 40
      spLeaf.x = 0
      const yPos = (leafIndex - (leafIndex % 2) + 1) / leafCount
      spLeaf.y = -(yPos * this.size - 15)
      spLeaf.scale.set(0.3 + (1 - yPos) * 0.7)
      return spLeaf
    })

    this.chara.addChild(spStem, ...leafs)
    this.addChild(this.chara)
  }
}
