import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'
import OutlineFilter from '@/filters/OutlineFilter'
import PaperFilter from '@/filters/PaperFilter'
import { Sine, Bounce, Cubic, Back } from 'gsap'
import { swing } from './motions/swing'
import { animate } from './motions/animate'
import { all, run } from '@/core/PromiseUtil'

import store from '@/store'

const createSprite = async (name: string): Promise<PIXI.Sprite> => {
  const tx = await loadSvg(`/imgs/tama/${name}.svg`)
  return new PIXI.Sprite(tx)
}

export const createTama = async () => {
  const parts = ['LgFr', 'LgBk', 'HrBk', 'AmBk', 'Hd', 'Bd', 'AmFr', 'HrFr']
  const tasks = parts.map(name => ({ name, task: createSprite(name) }))
  await Promise.all(tasks.map(t => t.task))
  const sprites: { [k in string]: PIXI.Sprite } = {}
  for (const t of tasks) {
    sprites[t.name] = await t.task
    sprites[t.name].name = t.name
  }

  sprites.HrFr.anchor.x = 0.9
  sprites.HrFr.anchor.y = 0.05
  sprites.HrBk.anchor.x = 0.15
  sprites.HrBk.anchor.y = 0.05
  sprites.Hd.anchor.x = 0.6
  sprites.Hd.anchor.y = 0.95
  sprites.AmFr.anchor.x = 0.55
  sprites.AmFr.anchor.y = 0.05
  sprites.AmBk.anchor.x = 0.15
  sprites.AmBk.anchor.y = 0.1
  sprites.LgFr.anchor.x = 0.3
  sprites.LgFr.anchor.y = 0.1
  sprites.LgBk.anchor.x = 0.7
  sprites.LgBk.anchor.y = 0.1

  sprites.HrFr.x = 1
  sprites.HrFr.y = 96
  sprites.HrBk.x = 326
  sprites.HrBk.y = 73
  sprites.Hd.x = 184
  sprites.Hd.y = 2
  sprites.Bd.x = 94
  sprites.Bd.y = 215
  sprites.AmFr.x = 174
  sprites.AmFr.y = 261
  sprites.AmBk.x = 311
  sprites.AmBk.y = 233
  sprites.LgFr.x = 317
  sprites.LgFr.y = 495
  sprites.LgBk.x = 263
  sprites.LgBk.y = 502

  Object.values(sprites).forEach(sp => {
    sp.x += sp.anchor.x * sp.width
    sp.y += sp.anchor.y * sp.height
  })

  const cont = new PIXI.Container()
  cont.addChild(...Object.values(sprites))
  return cont
}

export class Tama extends PIXI.Container {
  private cont?: PIXI.Container
  private jumpCount = 0
  constructor() {
    super()
  }

  async load() {
    this.cont = await createTama()
    this.addChild(this.cont)

    const stageSetting = store.state.stageSetting
    this.filters = [new OutlineFilter(stageSetting.scale * 5.0), new PaperFilter()]
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
