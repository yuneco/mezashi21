import * as PIXI from 'pixi.js'
import { FilterOptionParam, StyledContainer } from '@/sprites/StyledContainer'
import { loadSvg } from '@/logics/loadImgs'

export abstract class PlanetItemBase extends StyledContainer {
  readonly chara = new PIXI.Container()
  readonly size: number

  constructor(size = 100, filter?: FilterOptionParam) {
    super(filter)
    this.size = size
  }

  abstract load(): Promise<void>

  protected async loadItem(
    path: string,
    w: number,
    h?: number,
    loadW?: number,
    loadH?: number
  ): Promise<PIXI.Sprite> {
    const tx = await loadSvg(path, loadW, loadH)
    const sp = new PIXI.Sprite(tx)
    const sw = w / sp.width
    const sh = h ? h / sp.height : undefined
    sp.scale.set(sw, sh)
    return sp
  }
}
