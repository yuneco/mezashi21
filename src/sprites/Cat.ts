import * as PIXI from 'pixi.js'
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

let instanseSeq = 0

export class Cat extends StyledContainer {
  readonly chara = new PIXI.Container()
  private isWalking = false
  private walkPromise?: Promise<void>
  private _id = instanseSeq++

  constructor() {
    super()
  }

  async load() {
    await loadSprites(catDefs, 'cat', this.chara)
    const scaler = new PIXI.Container()
    scaler.addChild(this.chara)
    scaler.scale.set(0.1, 0.1)
    this.addChild(scaler)
    this.chara.interactive = true
    this.chara.pivot.x = this.chara.width / 2
    this.chara.pivot.y = this.chara.height

    this.swinfTail()
    this.startWalk()
  }

  get id() {
    return 'cat-' + this._id
  }

  swinfTail() {
    const tail = this.chara?.getChildByName('Tl') // しっぽ
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
    const cont = this.chara // 本体
    const amFr = cont?.getChildByName('AmFr') // 腕手前
    const amBk = cont?.getChildByName('AmBk') // 腕奥
    const lgFr = cont?.getChildByName('LgFr') // 足手前
    const lgBk = cont?.getChildByName('LgBk') // 足奥
    if (!cont || !amFr || !amBk || !lgFr || !lgBk) {
      return
    }

    const DUR = 1.6

    cont.scale.y = 0.8
    amFr.angle = 20
    lgFr.angle = 20
    amBk.angle = -20
    lgBk.angle = -20

    run(async () => {
      await animate(cont, { scaleY: 1 }, DUR / 4)
      await animate(cont, { scaleY: 0.8 }, DUR / 4)
      await animate(cont, { scaleY: 1 }, DUR / 4)
      await animate(cont, { scaleY: 0.8 }, DUR / 4)
    })

    await all(
      animate(amFr, { angle: -20 }, DUR / 2),
      animate(lgFr, { angle: -20 }, DUR / 2),
      animate(amBk, { angle: 20 }, DUR / 2),
      animate(lgBk, { angle: 20 }, DUR / 2)
    )
    await all(
      animate(amFr, { angle: 20 }, DUR / 2),
      animate(lgFr, { angle: 20 }, DUR / 2),
      animate(amBk, { angle: -20 }, DUR / 2),
      animate(lgBk, { angle: -20 }, DUR / 2)
    )
  }
}
