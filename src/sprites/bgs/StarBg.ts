import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'

import store from '@/store'
import { animate } from '../../logics/animate'
import { sleep } from '@/utils/sleep'
import { StyledContainer } from '../StyledContainer'

const MINSCALE = 0.1
const MAXSCALE = 2.0
const MINDURATION = 2.0
const MAXDURATION = 4.5
const MINROTATE = 120
const MAXROTATE = 400
const STARCOUNT = 10
const MAXINTERVAL = 5000

class Star extends PIXI.Sprite {
  // 1=手前, 0=奥
  readonly zScale: number
  constructor(tx: PIXI.Texture) {
    super(tx)
    this.zScale = Math.random() ** 3
    const scale = MINSCALE + this.zScale * (MAXSCALE - MINSCALE)
    this.scale.set(scale, scale)
    this.anchor.set(0.5, 0.5)
  }
}

export class StarBg extends StyledContainer {
  private starTexture?: PIXI.Texture
  public readonly area: PIXI.Rectangle
  private isDisposed = false

  constructor() {
    super()
    this.area = new PIXI.Rectangle(0, 0, store.state.stageSetting.vw, store.state.stageSetting.vh)
  }

  private async addStar() {
    if (!this.starTexture || this.isDisposed) {
      return
    }
    await sleep(Math.random() * MAXINTERVAL) // ランダム時間待つ
    const star = new Star(this.starTexture)
    // 表示領域下辺のランダムな位置に配置
    star.x = this.area.x + Math.random() * this.area.width
    star.y = this.area.y + this.area.height + star.height
    star.angle = Math.random() * 360 // 初期角度はランダム
    this.addChild(star)
    // 仮想的なz位置に連動して移動速度・回転速度を決定
    const duration = MINDURATION + (1 - star.zScale) * (MAXDURATION - MINDURATION)
    const angleRotate = MINROTATE + (1 - star.zScale) * (MAXROTATE - MINROTATE)
    // アニメーション実行
    await animate(star, { y: this.area.y - star.height, angle: star.angle + angleRotate }, duration)
    // 要素を削除した上で、上限数に達していなければ星を追加
    this.removeChild(star)
    if (this.children.length < STARCOUNT) {
      this.addStar()
    }
  }

  /**
   * リソースをロードしてアニメーションを開始します。
   * <b>不要になったら必ずdispose()を呼び出してください</b>
   */
  async load() {
    this.starTexture = await loadSvg('/imgs/Star.svg')
    for (let index = 0; index < STARCOUNT; index++) {
      this.addStar()
    }
  }

  dispose() {
    this.isDisposed = true
  }
}
