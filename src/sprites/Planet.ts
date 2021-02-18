import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import { StyledContainer } from './core/StyledContainer'
import store from '@/store'
import { Flower } from './Flower'
import { Ice } from './Ice'
import { PlanetItemName } from '@/assets/GameLevel'

const planetFilterOption = {
  outline: {
    scale: 4
  },
  paper: {
    scale: 1.5
  }
}

const itemFilterOption = {
  outline: {
    enabled: false
  },
  paper: {
    scale: 1.5
  }
}

export class Planet extends PIXI.Container {
  private readonly imgName: string
  private baseSize: number
  private sizeVal: number
  private cont = new StyledContainer(planetFilterOption)
  private items = new PIXI.Container()
  private itemName?: PlanetItemName
  constructor(imgName: string, size = 300, itemName?: PlanetItemName) {
    super()
    this.imgName = imgName
    this.sizeVal = size
    this.baseSize = size
    this.itemName = itemName
  }

  private applySize() {
    if (!this.cont) {
      return
    }
    const scale = this.sizeVal / this.baseSize
    this.cont.scale.set(scale, scale)
  }

  async load() {
    this.addChild(this.items)
    const sprite = new PIXI.Sprite(await loadSvg(`/imgs/planets/${this.imgName}.svg`))
    sprite.anchor.set(0.5, 0.5)
    this.baseSize = sprite.width
    this.cont.addChild(sprite)
    this.cont.position.set(this.cont.width / 2, this.cont.height / 2)
    this.addChild(this.cont)
    this.pivot.x = this.width / 2
    this.pivot.y = this.height / 2
    this.applySize()

    this.itemName === 'ice' && this.addIces(12)
    this.itemName === 'flower' && this.addFlowers(12)

    sprite.interactive = true
    sprite.on('pointertap', (ev: PIXI.InteractionEvent) => {
      const SAFE_MARGIN = 0.05 // 5%
      const pos = sprite.toLocal(ev.data.global)
      const dist = Math.hypot(pos.x, pos.y)
      if (dist < (sprite.width / 2) * (1 - SAFE_MARGIN)) {
        ev.stopPropagation()
        store.dispatch('tamaJump')
      }
    })
  }

  /**
   * 花を植えます
   * @param maxCount 最大数
   */
  private async addFlowers(maxCount: number) {
    const count = Math.ceil(Math.random() * maxCount)
    const MIN_H = 100
    const MAX_H = 200
    const rndLen = () => MIN_H + (MAX_H - MIN_H) * Math.random()
    const fls = new Array(count).fill(0).map(() => new Flower(rndLen(), itemFilterOption))
    await Promise.all(fls.map(fl => fl.load()))
    fls.forEach(fl => {
      this.placeItem(fl, Math.random() * 360)
    })
  }

  /**
   *
   * @param maxCount 氷を配置します
   */
  private async addIces(maxCount: number) {
    const count = Math.ceil(Math.random() * maxCount)
    const MIN_W = 50
    const MAX_W = 100
    const rndSize = () => MIN_W + (MAX_W - MIN_W) * Math.random()
    const ices = new Array(count).fill(0).map(() => new Ice(rndSize(), itemFilterOption))
    await Promise.all(ices.map(ice => ice.load()))
    ices.forEach(ice => {
      this.placeItem(ice, Math.random() * 360)
    })
  }

  private placeItem(item: PIXI.Container, angle = 0) {
    const wrapper = new PIXI.Container()
    wrapper.addChild(item)
    wrapper.position.set(this.pivot.x, this.pivot.y)
    item.y -= this.sizeVal / 2
    wrapper.angle = angle
    this.items.addChild(wrapper)
  }

  get size(): number {
    return this.sizeVal
  }

  set size(v: number) {
    this.sizeVal = v
    this.applySize()
  }
}
