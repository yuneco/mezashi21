import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import { StyledContainer } from './StyledContainer'
import store from '@/store'
import { items } from '@/assets/PlanetItemDef'
import { randomBetween, randomIntBetween } from '@/utils/MathUtil'
import { createPlanetItem } from './planetItems/createPlanetItem'
import { notNull } from '@/utils/ArrayUtil'
import playSound from '@/logics/playSound'

type PlanetItemName = keyof typeof items

/** 惑星本体に適用するフィルタ定義 */
const planetFilterOption = {
  outline: {
    scale: 4
  },
  paper: {
    scale: 1.5
  }
}

/** 装飾のPlanetItemに適用するフィルタ定義 */
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
    const scale = this.sizeVal / this.baseSize
    this.cont.scale.set(scale, scale)

    this.initTap(sprite)

    // アイテム配置
    this.itemName === 'ice' && this.addPlanetItem('ice', 8, 12, 50, 100)
    this.itemName === 'redFlower' && this.addPlanetItem('redFlower', 6, 18, 100, 200)
    this.itemName === 'goldFlower' && this.addPlanetItem('goldFlower', 20, 45, 80, 150)
    this.itemName === 'waterGrass' && this.addPlanetItem('waterGrass', 12, 35, 100, 300)
  }

  /** タップイベントを登録します。ロード処理の一部です */
  private initTap(planetBodySprite: PIXI.Sprite) {
    planetBodySprite.interactive = true
    planetBodySprite.on('pointertap', (ev: PIXI.InteractionEvent) => {
      const SAFE_MARGIN = 0.05 // 5%
      const pos = planetBodySprite.toLocal(ev.data.global)
      const dist = Math.hypot(pos.x, pos.y)
      if (dist < (planetBodySprite.width / 2) * (1 - SAFE_MARGIN)) {
        ev.stopPropagation()
        const currentCount = store.state.tama.jumpCount
        if (currentCount <= 1) {
          playSound('jump')
        } else if (currentCount == 2) {
          playSound('down')
        }
        store.dispatch('tamaJump')
      }
    })
  }

  /** 地面に指定したPlanetItemを生成・配置します */
  private async addPlanetItem(
    itemName: keyof typeof items,
    minCount: number,
    maxCount: number,
    minSize: number,
    maxSize: number
  ) {
    const count = randomIntBetween(minCount, maxCount)
    const items = new Array(count)
      .fill(0)
      .map(() => createPlanetItem(itemName, randomBetween(minSize, maxSize), itemFilterOption))
      .filter(notNull)
    await Promise.all(items.map(item => item.load()))
    items.forEach(item => {
      this.placeOnGround(item, Math.random() * 360)
    })
  }

  /** 指定のオブジェクトを角度を指定して惑星の地面位置にして配置します。PlanetItemの配置に利用することを想定しています */
  private placeOnGround(item: PIXI.Container, angle = 0) {
    const wrapper = new PIXI.Container()
    wrapper.addChild(item)
    wrapper.position.set(this.pivot.x, this.pivot.y)
    item.y -= this.sizeVal / 2
    wrapper.angle = angle
    this.items.addChild(wrapper)
  }

  /** 惑星サイズ */
  get size(): number {
    return this.sizeVal
  }
}
