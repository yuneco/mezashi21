import { FilterOptionParam } from '../StyledContainer'
import { items } from '@/assets/PlanetItemDef'
import { PlanetItemBase } from './PlanetItemBase'

export class GoldFlower extends PlanetItemBase {
  constructor(size = 200, filter?: FilterOptionParam) {
    super(size, filter)
  }

  async load() {
    const def = items.goldFlower
    const spFl = await this.loadItem(`${def.imgDir}/GoldFlower.svg`, this.size * 0.6)
    const spStem = await this.loadItem(`${def.imgDir}/GoldFlowerStem.svg`, 6, this.size)
    spFl.pivot.set(0.5, 1)
    spStem.pivot.set(0.5, 1)
    spStem.position.set(-spStem.width / 2, -this.size)
    spFl.position.set(-spFl.width / 2, spStem.y - spFl.height)

    this.chara.addChild(spStem, spFl)
    this.chara.angle = (Math.random() - 0.5) * 40
    this.addChild(this.chara)
  }
}
