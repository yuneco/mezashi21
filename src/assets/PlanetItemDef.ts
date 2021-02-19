import { PlanetItem } from './PlanetItem'

export const redFlower: PlanetItem = {
  name: 'RedFlower',
  imgDir: '/imgs/items',
  preloads: ['Flower.svg', 'Leaf.svg', 'Stem.svg']
}

export const goldFlower: PlanetItem = {
  name: 'GoldFlower',
  imgDir: '/imgs/items',
  preloads: ['GoldFlowerStem.svg', 'GoldFlower.svg']
}

export const ice: PlanetItem = {
  name: 'Ice',
  imgDir: '/imgs/items',
  preloads: ['Ice1.svg', 'Ice2.svg', 'Ice3.svg']
}

export const waterGrass: PlanetItem = {
  name: 'WaterGrass',
  imgDir: '/imgs/items',
  preloads: ['WaterGrassStem.svg', 'WarterGrassLeaf.svg']
}

export const items = {
  redFlower,
  goldFlower,
  ice,
  waterGrass
}
