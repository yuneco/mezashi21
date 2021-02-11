import * as PIXI from 'pixi.js'
import gsap, { Sine, Bounce, Cubic, Back } from 'gsap'
import { swing } from '../motions/swing'
import { animate } from '../core/animate'
import { all, run } from '@/core/PromiseUtil'
import { SpriteDef, loadSprites } from '@/sprites/core/loadSprites'
import { StyledContainer } from '../core/StyledContainer'

const tamaDefs: SpriteDef[] = [
  {
    name: 'HrFr',
    pos: { x: 1, y: 96 },
    anchor: { x: 0.9, y: 0.05 }
  },
  {
    name: 'AmFr',
    pos: { x: 174, y: 261 },
    anchor: { x: 0.55, y: 0.05 }
  },
  {
    name: 'Hd',
    pos: { x: 184, y: 2 },
    anchor: { x: 0.6, y: 0.95 }
  },
  {
    name: 'Bd',
    pos: { x: 94, y: 215 },
    anchor: { x: 0.9, y: 0.05 }
  },
  {
    name: 'AmBk',
    pos: { x: 311, y: 233 },
    anchor: { x: 0.15, y: 0.1 }
  },
  {
    name: 'HrBk',
    pos: { x: 326, y: 73 },
    anchor: { x: 0.15, y: 0.05 }
  },
  {
    name: 'LgFr',
    pos: { x: 317, y: 495 },
    anchor: { x: 0.3, y: 0.1 }
  },
  {
    name: 'LgBk',
    pos: { x: 263, y: 502 },
    anchor: { x: 0.7, y: 0.1 }
  }
]

// 構造
// this ... 公開されるContainer。x,y,scale,angleを自由に変更可能 = このクラス内では操作しない
//   scaler ... 全体のサイズを調整のみを行う
//     chara ... キャラクターパーツの親。足元にpivot。アクションでx,y,angle,scale等は変わる
//       各パーツ

type TamaMotion = 'stay' | 'jump' | 'step'

export class Tama extends StyledContainer {
  private scaler = new PIXI.Container()
  readonly chara = new PIXI.Container()
  private jumpCount = 0
  // private stayMotion?: gsap.core.Timeline
  private stepMotion?: gsap.core.Timeline

  constructor() {
    super()
  }

  async load() {
    await loadSprites(tamaDefs, 'tama', this.chara)
    this.scaler.addChild(this.chara)
    this.scaler.scale.set(0.4, 0.4)
    this.addChild(this.scaler)
    this.chara.interactive = true
    this.chara.pivot.x = this.chara.width / 2
    this.chara.pivot.y = this.chara.height

    console.log(this)

    this.chara.on('pointertap', async () => {
      this.jumpCount++
      if (this.jumpCount == 1) {
        await this.jump()
        this.jumpCount = 0
      }
    })
    this.swingHair()
    // this.stayMotion = swing(this.chara, 2.5, 15, false)
    this.step()
  }

  private swingHair() {
    const hrFr = this.chara?.getChildByName('HrFr')
    const hrBk = this.chara?.getChildByName('HrBk')
    if (!hrFr || !hrBk) {
      return
    }
    swing(hrFr, 2, 40)
    swing(hrBk, 2, 30)
  }

  private async step() {
    const cont = this.chara // 本体
    const amFr = cont?.getChildByName('AmFr') // 腕手前
    const amBk = cont?.getChildByName('AmBk') // 腕奥
    const lgFr = cont?.getChildByName('LgFr') // 足手前
    const lgBk = cont?.getChildByName('LgBk') // 足奥
    if (!amFr || !amBk || !lgBk || !lgFr) {
      return
    }

    const DUR = 1.5

    await all(
      animate(amFr, { angle: 20 }, DUR / 4),
      animate(amBk, { angle: -20 }, DUR / 4),
      animate(lgFr, { angle: 20 }, DUR / 4),
      animate(lgBk, { angle: -20 }, DUR / 4)
    )
    const tl = gsap.timeline()
    tl.to(amFr, { pixi: { angle: -20 }, duration: DUR / 2, ease: Sine.easeInOut }, 0)
    tl.to(amBk, { pixi: { angle: 40 }, duration: DUR / 2, ease: Sine.easeInOut }, 0)
    tl.to(lgFr, { pixi: { angle: -30 }, duration: DUR / 2, ease: Sine.easeOut }, 0)
    tl.to(lgBk, { pixi: { angle: 20 }, duration: DUR / 2, ease: Sine.easeOut }, 0)

    tl.to(cont, { pixi: { scaleY: 0.9, y: 0 }, duration: DUR / 4, ease: Sine.easeInOut }, 0)
    tl.to(cont, { pixi: { scaleY: 1, y: -45 }, duration: DUR / 4, ease: Sine.easeInOut }, DUR / 4)

    tl.yoyo(true)
    this.stepMotion = tl
    tl.repeat(-1)
    tl.play()
  }

  async jump() {
    const cont = this.chara // 本体
    const amFr = cont?.getChildByName('AmFr') // 腕手前
    const amBk = cont?.getChildByName('AmBk') // 腕奥
    const lgFr = cont?.getChildByName('LgFr') // 足手前
    const lgBk = cont?.getChildByName('LgBk') // 足奥
    if (!amFr || !amBk || !lgBk || !lgFr) {
      return
    }

    if (this.stepMotion) {
      this.stepMotion.pause()
    }

    // 予備動作
    await all(
      animate(cont, { scaleY: 0.75 }, 0.15, Sine.easeOut),
      animate(amFr, { angle: -40 }, 0.35),
      animate(amBk, { angle: -30 }, 0.3),
      animate(lgBk, { angle: 0 }, 0.3),
      animate(lgFr, { angle: 0 }, 0.3)
    )
    await all(
      // 本体ジャンプ
      run(async () => {
        await animate(cont, { scaleY: 1.1, y: -600 }, 1.6, Cubic.easeOut)
        // このタイミングまでに2回タップされていたら二段ジャンプ
        const isDouble = this.jumpCount >= 2
        if (isDouble) {
          animate(cont, { scaleY: 0.8 }, 0.5, Back.easeOut)
          await all(
            animate(cont, { y: -1000 }, 0.9, Cubic.easeOut),
            animate(cont, { angle: -360 }, 1.8, Back.easeOut)
          )
        }
        await animate(cont, { scaleY: 1.0, y: 0 }, isDouble ? 2.4 : 1.8, Bounce.easeOut)
        cont.angle = 0
      }),
      // 腕振り手前
      run(async () => {
        await animate(amFr, { angle: 50 }, 1.3)
        await animate(amFr, { angle: 0 }, 1.0)
      }),
      // 腕振り奥
      run(async () => {
        await animate(amBk, { angle: 30 }, 1.3)
        await animate(amBk, { angle: 0 }, 1.0)
      }),
      // 足振り
      run(async () => {
        await animate(lgBk, { angle: -30 }, 1.2)
        await animate(lgBk, { angle: 0 }, 0.9)
      })
    )

    if (this.stepMotion) {
      this.stepMotion.play()
    }
  }
}
