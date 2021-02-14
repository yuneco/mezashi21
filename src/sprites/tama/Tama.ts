import * as PIXI from 'pixi.js'
import { Sine, Bounce, Cubic, Back } from 'gsap'
import { swing } from '../motions/swing'
import { Animator } from '../core/animate'
import { all, run } from '@/core/PromiseUtil'
import { SpriteDef, loadSprites } from '@/sprites/core/loadSprites'
import { StyledContainer } from '../core/StyledContainer'
import { computed, reactive, watch } from 'vue'
import store from '@/store'

const tamaDefs: SpriteDef[] = [
  {
    name: 'HrFr',
    pos: { x: 1, y: 96 },
    anchor: { x: 0.9, y: 0.05 }
  },
  {
    name: 'AmFr',
    pos: { x: 120, y: 261 },
    anchor: { x: 0.4, y: 0.05 }
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

/** モーションの種類 */
type TamaMotion = 'step' | 'jump' | 'down' | 'over' | 'none'
/** たまさんの状態 */
type State = {
  /** モーションの通番。nextMotionで使用されます */
  motionSeq: number
  /** 現在のモーションの種類 */
  currentMotion: TamaMotion
}

// 構造
// this ... 公開されるContainer。x,y,scale,angleを自由に変更可能 = このクラス内では操作しない
//   scaler ... 全体のサイズを調整のみを行う
//     chara ... キャラクターパーツの親。足元にpivot。アクションでx,y,angle,scale等は変わる
//       各パーツ

export class Tama extends StyledContainer {
  private scaler = new PIXI.Container()
  readonly chara = new PIXI.Container()

  private state = reactive<State>({
    motionSeq: 0,
    currentMotion: 'none'
  })

  constructor() {
    super()
  }

  async load() {
    await loadSprites(tamaDefs, 'tama', this.chara)
    this.scaler.addChild(this.chara)
    this.scaler.scale.set(0.35, 0.35)
    this.addChild(this.scaler)
    this.chara.interactive = true
    this.chara.pivot.x = this.chara.width / 2
    this.chara.pivot.y = this.chara.height

    // ゲーム状態の監視
    watch(
      () => store.state.game.play,
      (newVal, oldVal) => {
        if (newVal === 'over') {
          this.gameOverMotion()
        }
        if (oldVal === 'over') {
          this.stepMotion()
        }
      }
    )

    // ジャンプ要求数の監視
    watch(
      () => store.state.tama.jumpCount,
      async (newVal, oldVal) => {
        if (oldVal === 0 && newVal === 1) {
          await this.jumpMotion()
        }
        if (oldVal === 2 && newVal === 3) {
          await this.downMotion()
        }
      }
    )

    // デフォルトのアニメーションを開始
    this.swingHair() // 常時ループ実行
    this.stepMotion() // 他のモーションが始まるまでループ実行
  }

  /**
   * たまさんのpivot位置（=足元）のグローバル座標を返します
   */
  get globalTamaPos() {
    return this.chara.toGlobal(this.chara.pivot)
  }

  /**
   * 新しいAnimatorインスタンスを生成します。
   * 生成したAnimatorは次にこのメソッドが呼ばれると自動的にキャンセルされます
   */
  private nextMotion(motionName: TamaMotion) {
    this.state.motionSeq++
    this.state.currentMotion = motionName
    const startSeq = this.state.motionSeq
    return new Animator(computed(() => startSeq !== this.state.motionSeq))
  }

  /**
   * 状態に合わせて適切なデフォルトモーションを実行します
   */
  private defaultMotion() {
    if (store.state.game.play === 'playing') {
      this.stepMotion()
      return
    }
    this.nextMotion('none')
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

  private async stepMotion() {
    const cont = this.chara // 本体
    const amFr = cont?.getChildByName('AmFr') // 腕手前
    const amBk = cont?.getChildByName('AmBk') // 腕奥
    const lgFr = cont?.getChildByName('LgFr') // 足手前
    const lgBk = cont?.getChildByName('LgBk') // 足奥
    if (!amFr || !amBk || !lgBk || !lgFr) {
      return
    }

    const isReqPreMotion = this.state.currentMotion !== 'step'
    const DUR = 1.5
    const mo = this.nextMotion('step')

    isReqPreMotion &&
      (await all(
        mo.animate(cont, { scaleY: 1, y: 0, angle: 0 }, DUR / 4, Sine.easeIn),
        mo.animate(amFr, { angle: 20 }, DUR / 4),
        mo.animate(amBk, { angle: -20 }, DUR / 4),
        mo.animate(lgFr, { angle: 20 }, DUR / 4),
        mo.animate(lgBk, { angle: -20 }, DUR / 4)
      ))

    await all(
      mo.animate(amBk, { angle: 40 }, DUR / 2, Sine.easeInOut),
      mo.animate(lgFr, { angle: -30 }, DUR / 2, Sine.easeOut),
      mo.animate(amFr, { angle: -20 }, DUR / 2, Sine.easeInOut),
      mo.animate(lgBk, { angle: 20 }, DUR / 2, Sine.easeOut),
      run(async () => {
        await mo.animate(cont, { scaleY: 0.9, y: 0 }, DUR / 4, Sine.easeIn)
        await mo.animate(cont, { scaleY: 1, y: -45 }, DUR / 4, Sine.easeOut)
      })
    )

    await all(
      mo.animate(amFr, { angle: 20 }, DUR / 2, Sine.easeInOut),
      mo.animate(amBk, { angle: -20 }, DUR / 2, Sine.easeOut),
      mo.animate(lgFr, { angle: 20 }, DUR / 2, Sine.easeInOut),
      mo.animate(lgBk, { angle: -20 }, DUR / 2, Sine.easeOut),
      run(async () => {
        await mo.animate(cont, { scaleY: 0.9, y: 0 }, DUR / 4, Sine.easeIn)
        await mo.animate(cont, { scaleY: 1, y: -45 }, DUR / 4, Sine.easeOut)
      })
    )

    mo.alive && this.defaultMotion()
  }

  private async jumpMotion() {
    const cont = this.chara // 本体
    const amFr = cont?.getChildByName('AmFr') // 腕手前
    const amBk = cont?.getChildByName('AmBk') // 腕奥
    const lgFr = cont?.getChildByName('LgFr') // 足手前
    const lgBk = cont?.getChildByName('LgBk') // 足奥
    if (!amFr || !amBk || !lgBk || !lgFr) {
      return
    }

    const mo = this.nextMotion('jump')

    // 予備動作
    await all(
      mo.animate(cont, { scaleY: 0.75, angle: 15 }, 0.15, Sine.easeOut),
      mo.animate(amFr, { angle: -40 }, 0.35),
      mo.animate(amBk, { angle: -30 }, 0.3),
      mo.animate(lgBk, { angle: 0 }, 0.3),
      mo.animate(lgFr, { angle: 0 }, 0.3)
    )
    await all(
      // 本体ジャンプ
      run(async () => {
        await mo.animate(cont, { scaleY: 1.1, y: -1000 }, 1.6, Cubic.easeOut)
        // このタイミングまでに2回タップされていたら二段ジャンプ
        const isDouble = store.state.tama.jumpCount >= 2
        if (isDouble) {
          mo.animate(cont, { scaleY: 0.8 }, 0.5, Back.easeOut)
          await all(
            mo.animate(cont, { y: -1600 }, 0.9, Cubic.easeOut),
            mo.animate(cont, { angle: -360 }, 1.8, Back.easeOut)
          )
        }
        if (isDouble) {
          await mo.animate(cont, { scaleY: 1.0, y: 0 }, 3.5, Bounce.easeOut)
          mo.set(cont, { angle: 0 })
        } else {
          await mo.animate(cont, { scaleY: 1.0, y: 0, angle: 0 }, 2.5, Bounce.easeOut)
        }
      }),
      // 腕振り手前
      run(async () => {
        await mo.animate(amFr, { angle: 50 }, 1.3)
        await mo.animate(amFr, { angle: 0 }, 1.0)
      }),
      // 腕振り奥
      run(async () => {
        await mo.animate(amBk, { angle: 30 }, 1.3)
        await mo.animate(amBk, { angle: 0 }, 1.0)
      }),
      // 足振り
      run(async () => {
        await mo.animate(lgBk, { angle: -30 }, 1.2)
        await mo.animate(lgBk, { angle: 0 }, 0.9)
      })
    )

    mo.alive && store.dispatch('tamaJumpEnd')
    mo.alive && this.defaultMotion()
  }

  private async downMotion() {
    const cont = this.chara // 本体
    const amFr = cont?.getChildByName('AmFr') // 腕手前
    const amBk = cont?.getChildByName('AmBk') // 腕奥
    const lgFr = cont?.getChildByName('LgFr') // 足手前
    const lgBk = cont?.getChildByName('LgBk') // 足奥
    if (!amFr || !amBk || !lgBk || !lgFr) {
      return
    }

    const mo = this.nextMotion('down')

    // 開始時の高さに合わせて所要時間を変える
    const BASE_DUR = 1.5
    const BASE_Y = 1000
    const DUR = (-this.chara.y / BASE_Y) * BASE_DUR

    // 予備動作
    await all(
      run(async () => {
        await mo.animate(cont, { y: 0, scaleY: 0.6, angle: 45 }, DUR * 0.2, Sine.easeOut)
        await mo.animate(cont, { scaleY: 1, angle: 0 }, DUR * 0.8, Sine.easeInOut)
      }),
      mo.animate(amFr, { angle: 0 }, DUR),
      mo.animate(amBk, { angle: 0 }, DUR),
      mo.animate(lgBk, { angle: 0 }, DUR),
      mo.animate(lgFr, { angle: 0 }, DUR)
    )

    mo.alive && store.dispatch('tamaJumpEnd')
    mo.alive && this.defaultMotion()
  }

  private async gameOverMotion() {
    const chara = this.chara
    const mo = this.nextMotion('over')

    await all(
      run(async () => {
        await mo.animate(chara, { y: chara.y - 200 }, 0.5, Cubic.easeOut)
        await mo.animate(chara, { y: -0 }, 1.0, Bounce.easeOut)
      }),
      mo.animate(chara, { angle: -110 }, 1.5, Bounce.easeOut)
    )
  }
}
