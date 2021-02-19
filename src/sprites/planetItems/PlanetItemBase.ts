import * as PIXI from 'pixi.js'
import { FilterOptionParam, StyledContainer } from '@/sprites/StyledContainer'

export abstract class PlanetItemBase extends StyledContainer {
  readonly chara = new PIXI.Container()
  readonly size: number

  constructor(size = 100, filter?: FilterOptionParam) {
    super(filter)
    this.size = size
  }

  abstract load(): Promise<void>
}
