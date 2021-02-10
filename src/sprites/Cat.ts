import * as PIXI from 'pixi.js'
import { Sine, Bounce, Cubic, Back } from 'gsap'
import { animate } from './core/animate'
import { all, run } from '@/core/PromiseUtil'
import { SpriteDef, loadSprites } from '@/sprites/core/loadSprites'
import { StyledContainer } from './core/StyledContainer'
import { swing } from './motions/swing'

const catDefs: SpriteDef[] = [
  {
    name: 'Hd',
    pos: { x: 0, y: 0 },
    anchor: { x: 0.7, y: 0.7 }
  },
  {
    name: 'AmFr',
    fileName: 'Am',
    pos: { x: 205, y: 378 },
    anchor: { x: 0.5, y: 0.1 }
  },
  {
    name: 'LgFr',
    fileName: 'Lg',
    pos: { x: 597, y: 351 },
    anchor: { x: 0.5, y: 0.1 }
  },
  {
    name: 'Tl',
    pos: { x: 649, y: 95 },
    anchor: { x: 0.1, y: 0.9 }
  },
  {
    name: 'Bd',
    pos: { x: 175, y: 222 },
    anchor: { x: 0.5, y: 0.5 }
  },
  {
    name: 'AmBk',
    fileName: 'Am',
    pos: { x: 180, y: 378 },
    anchor: { x: 0.5, y: 0.1 }
  },
  {
    name: 'LgBk',
    fileName: 'Lg',
    pos: { x: 572, y: 351 },
    anchor: { x: 0.5, y: 0.1 }
  }
]

export class Cat extends StyledContainer {
  private cont?: PIXI.Container
  private jumpCount = 0
  private isWalking = false
  private walkPromise?: Promise<void>

  constructor() {
    super()
  }

  async load() {
    this.cont = await loadSprites(catDefs, 'cat')
    this.addChild(this.cont)
    this.cont.interactive = true
    this.cont.pivot.x = this.width / 2
    this.cont.pivot.y = this.height
    this.scale.set(0.12, 0.12)

    this.swinfTail()
    this.startWalk()
  }

  swinfTail() {
    const tail = this.cont?.getChildByName('Tl') // しっぽ
    if (!tail) {
      return
    }
    swing(tail, 0.6, 15)
  }

  async startWalk() {
    if (this.isWalking) {
      return
    }
    this.isWalking = true
    while (this.isWalking) {
      await (this.walkPromise = this.step())
    }
  }

  async stopWalk() {
    this.isWalking = false
    await this.walkPromise
  }

  async step() {
    const cont = this.cont // 本体
    const amFr = cont?.getChildByName('AmFr') // 腕手前
    const amBk = cont?.getChildByName('AmBk') // 腕奥
    const lgFr = cont?.getChildByName('LgFr') // 足手前
    const lgBk = cont?.getChildByName('LgBk') // 足奥
    if (!cont || !amFr || !amBk || !lgFr || !lgBk) {
      return
    }

    amFr.angle = 20
    lgFr.angle = 20
    amBk.angle = -20
    lgBk.angle = -20

    await all(
      animate(amFr, { angle: -20 }, 0.8),
      animate(lgFr, { angle: -20 }, 0.8),
      animate(amBk, { angle: 20 }, 0.8),
      animate(lgBk, { angle: 20 }, 0.8)
    )
    await all(
      animate(amFr, { angle: 20 }, 0.8),
      animate(lgFr, { angle: 20 }, 0.8),
      animate(amBk, { angle: -20 }, 0.8),
      animate(lgBk, { angle: -20 }, 0.8)
    )
  }
}
