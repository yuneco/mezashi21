import * as PIXI from 'pixi.js'
import { animate } from '../logics/animate'
import { all, run } from '@/utils/PromiseUtil'
import { SpriteDef, loadSprites } from '@/logics/loadSprites'
import { StyledContainer } from '@/sprites/StyledContainer'
import { swing } from './motions/swing'
import store from '@/store'
import { Cubic } from 'gsap'

const catDefs: SpriteDef[] = [
  {
    name: 'Hd',
    pos: { x: 0, y: 0 },
    anchor: { x: 0.7, y: 0.7 }
  },
  {
    name: 'HdMzs',
    pos: { x: -79, y: 0 },
    anchor: { x: 0.6, y: 0.85 }
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

type Direction = 'left' | 'right'
type HeadType = 'Hd' | 'HdMzs'

/** 猫の状態 */
export class Cat extends StyledContainer {
  readonly chara = new PIXI.Container()
  private isWalking = false
  private walkPromise?: Promise<void>
  private _id = instanseSeq++
  private headType: HeadType = 'Hd'
  private dir: Direction = 'right'

  speed = 0.15
  jumpHeight = 0

  constructor() {
    super()
  }

  async load() {
    await loadSprites(catDefs, 'cat', this.chara)
    const scaler = new PIXI.Container()
    scaler.addChild(this.chara)
    scaler.scale.set(0.1, 0.1)
    this.addChild(scaler)
    this.chara.pivot.x = this.chara.width / 2
    this.chara.pivot.y = this.chara.height

    this.head = 'Hd'
    this.swingTail()
    this.startWalk()
  }

  get id() {
    return 'cat-' + this._id
  }

  get direction() {
    return this.dir
  }

  set direction(d: Direction) {
    this.dir = d
    this.scale.x = d == 'right' ? 1 : -1
  }

  private set head(h: HeadType) {
    this.headType = h
    this.chara.getChildByName('Hd').visible = h == 'Hd'
    this.chara.getChildByName('HdMzs').visible = h == 'HdMzs'
  }
  private get head() {
    return this.headType
  }

  swingTail() {
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
      await (this.walkPromise = this.stepMotion())
    }
  }

  async stopWalk() {
    this.isWalking = false
    await this.walkPromise
  }

  async stepMotion() {
    const cont = this.chara // 本体
    const amFr = cont.getChildByName('AmFr') // 腕手前
    const amBk = cont.getChildByName('AmBk') // 腕奥
    const lgFr = cont.getChildByName('LgFr') // 足手前
    const lgBk = cont.getChildByName('LgBk') // 足奥
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

    if (this.jumpHeight) {
      run(async () => {
        await animate(cont, { y: -1000 }, DUR / 2)
        await animate(cont, { y: 0 }, DUR / 2)
      })
    }

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

  async overMotion(hasMezashi = true) {
    const chara = this.chara // 本体
    const gHeight = store.state.stageSetting.height
    const gPosDest = chara.toGlobal(chara.pivot)
    gPosDest.y = gHeight + 200
    const localDest = chara.toLocal(gPosDest)
    const DUR = 1.5
    if (hasMezashi) {
      this.head = 'HdMzs'
    }
    this.stopWalk()
    await animate(chara, { angle: 360 }, DUR * 0.3, Cubic.easeOut)
    await animate(chara, { angle: 480, x: localDest.x, y: localDest.y }, DUR * 0.5, Cubic.easeIn)
  }
}
