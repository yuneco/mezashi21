import * as PIXI from 'pixi.js'
import { Sine, Bounce, Cubic, Back } from 'gsap'
import { swing } from './motions/swing'
import { animate } from './core/animate'
import { all, run } from '@/core/PromiseUtil'
import { SpriteDef, loadSprites } from '@/sprites/core/loadSprites'
import { StyledContainer } from './core/StyledContainer'

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
    name: 'Bd',
    pos: { x: 94, y: 215 },
    anchor: { x: 0.9, y: 0.05 }
  },
  {
    name: 'Hd',
    pos: { x: 184, y: 2 },
    anchor: { x: 0.6, y: 0.95 }
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

export class Tama extends StyledContainer {
  private cont?: PIXI.Container
  private jumpCount = 0
  constructor() {
    super()
  }

  async load() {
    this.cont = await loadSprites(tamaDefs, 'tama')
    this.addChild(this.cont)
    this.cont.interactive = true
    this.cont.pivot.x = this.width / 2
    this.cont.pivot.y = this.height
    this.scale.set(0.5, 0.5)

    this.cont.on('pointertap', async () => {
      this.jumpCount++
      if (this.jumpCount == 1) {
        await this.jump()
        this.jumpCount = 0
      }
    })
    this.swingHair()
    swing(this, 4.5, 15)
  }

  swingHair() {
    const hrFr = this.cont?.getChildByName('HrFr')
    const hrBk = this.cont?.getChildByName('HrBk')
    if (!hrFr || !hrBk) {
      return
    }
    swing(hrFr, 2, 40)
    swing(hrBk, 2, 30)
  }

  async jump() {
    const cont = this.cont // 本体
    const amFr = cont?.getChildByName('AmFr') // 腕手前
    const amBk = cont?.getChildByName('AmBk') // 腕奥
    const lgBk = cont?.getChildByName('LgBk') // 足奥
    if (!cont || !amFr || !amBk || !lgBk) {
      return
    }

    // 予備動作
    await all(
      animate(cont, { scaleY: 0.8 }, 0.2, Sine.easeOut),
      animate(amFr, { angle: 40 }, 0.5),
      animate(amBk, { angle: 30 }, 0.5)
    )
    await all(
      // 本体ジャンプ
      run(async () => {
        await animate(cont, { scaleY: 1.1, y: -400 }, 0.9, Sine.easeOut)
        // このタイミングまでに2回タップされていたら二段ジャンプ
        const isDouble = this.jumpCount >= 2
        if (isDouble) {
          animate(cont, { scaleY: 0.8 }, 0.5, Back.easeOut)
          await all(
            animate(cont, { y: -1000 }, 0.9, Cubic.easeOut),
            animate(cont, { angle: -360 }, 1.8, Back.easeOut)
          )
        }
        await animate(cont, { scaleY: 1.0, y: 0 }, isDouble ? 2.0 : 1.0, Bounce.easeOut)
        cont.angle = 0
      }),
      // 腕振り手前
      run(async () => {
        await animate(amFr, { angle: -50 }, 0.7)
        await animate(amFr, { angle: 0 }, 0.5)
      }),
      // 腕振り奥
      run(async () => {
        await animate(amBk, { angle: -30 }, 0.7)
        await animate(amBk, { angle: 0 }, 0.5)
      }),
      // 足振り
      run(async () => {
        await animate(lgBk, { angle: -30 }, 0.8)
        await animate(lgBk, { angle: 0 }, 0.6)
      })
    )
  }
}
