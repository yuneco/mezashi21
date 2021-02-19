import * as PIXI from 'pixi.js'

import store from '@/store'
import { animate } from '../../logics/animate'
import { sleep } from '../../utils/sleep'
import { StyledContainer } from '../StyledContainer'
import { randomFrom } from '@/utils/ArrayUtil'

type ParticleDirection = 'up' | 'down'

class Particle extends PIXI.Sprite {
  // 1=手前, 0=奥
  readonly zScale: number
  constructor(tx: PIXI.Texture, minScale: number, maxScale: number) {
    super(tx)
    this.zScale = Math.random() ** 3
    const scale = minScale + this.zScale * (maxScale - minScale)
    this.scale.set(scale, scale)
    this.anchor.set(0.5, 0.5)
  }
}

export class BgParticle extends StyledContainer {
  private minScale = 0.1
  private maxScale = 2.0
  private minDuration = 2.0
  private maxDuration = 4.5
  private minRotate = 120
  private maxRotate = 400
  private xNoiseScale = 1
  direction: ParticleDirection = 'up'
  maxInterval = 5000

  private readonly textures: PIXI.Texture[] = []
  public readonly area: PIXI.Rectangle
  private maxCountVal = 0
  private isDisposed = false

  constructor(maxCount = 10) {
    super({
      outline: { enabled: false },
      paper: {
        scale: 1.5,
        applyAlpha: true
      }
    })
    this.area = new PIXI.Rectangle(0, 0, store.state.stageSetting.vw, store.state.stageSetting.vh)
    this.maxCountVal = maxCount
  }

  private async addParticle() {
    if (this.isDisposed || !this.textures.length) {
      return
    }
    await sleep(Math.random() * this.maxInterval) // ランダム時間待つ
    const par = new Particle(randomFrom(this.textures), this.minScale, this.maxScale)
    // 表示領域下辺or上辺のランダムな位置に配置
    const topY = this.area.y - par.height
    const bottmY = this.area.y + this.area.height + par.height
    par.x = this.area.x + Math.random() * this.area.width
    par.y = this.direction === 'up' ? bottmY : topY
    par.angle = Math.random() * 360 // 初期角度はランダム
    this.addChild(par)
    // 仮想的なz位置に連動して移動速度・回転速度を決定
    const duration = this.minDuration + (1 - par.zScale) * (this.maxDuration - this.minDuration)
    const angleRotate = this.minRotate + (1 - par.zScale) * (this.maxRotate - this.minRotate)
    // アニメーション実行
    await animate(
      par,
      { y: this.direction === 'up' ? topY : bottmY, angle: par.angle + angleRotate },
      duration
    )
    // 要素を削除した上で、上限数に達していなければ星を追加
    this.removeChild(par)
    if (this.children.length < this.maxCountVal) {
      this.addParticle()
    }
  }

  /**
   * リソースをロードしてアニメーションを開始します。
   * <b>不要になったら必ずdispose()を呼び出してください</b>
   */
  async load(textures: PIXI.Texture[]) {
    this.textures.length = 0
    this.textures.push(...textures)
    for (let index = 0; index < this.maxCountVal; index++) {
      if (this.isDisposed) {
        break
      }
      this.addParticle()
      await sleep(10)
    }
  }

  get maxCount() {
    return this.maxCountVal
  }

  set maxCount(v: number) {
    while (this.maxCountVal < v) {
      this.maxCountVal++
      this.addParticle()
    }
    this.maxCountVal = v
  }

  setParticleScale(min: number, max: number) {
    this.minScale = min
    this.maxScale = max
  }

  setParticleDuration(min: number, max: number) {
    this.minDuration = min
    this.maxDuration = max
  }

  setParticleDRotate(min: number, max: number) {
    this.minRotate = min
    this.maxRotate = max
  }

  dispose() {
    this.isDisposed = true
  }
}
