import { items } from '@/assets/PlanetItemDef'
import { FilterOptionParam } from '../StyledContainer'
import { GoldFlower } from './GoldFlower'
import { Ice } from './Ice'
import { PlanetItemBase } from './PlanetItemBase'
import { RedFlower } from './RedFlower'
import { WaterGrass } from './WaterGrass'

export const createPlanetItem = (
  name: keyof typeof items,
  size = 200,
  filter?: FilterOptionParam
): PlanetItemBase | undefined => {
  let item: PlanetItemBase | undefined
  switch (name) {
    case 'redFlower':
      item = new RedFlower(size, filter)
      break
    case 'goldFlower':
      item = new GoldFlower(size, filter)
      break
    case 'ice':
      item = new Ice(size, filter)
      break
    case 'waterGrass':
      item = new WaterGrass(size, filter)
      break
    default:
      break
  }

  if (!item) {
    return
  }

  return item
}
