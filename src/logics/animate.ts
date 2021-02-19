import * as PIXI from 'pixi.js'
import gsap, { Sine } from 'gsap'
import { ComputedRef, watch } from 'vue'
import { removeFrom } from '@/utils/ArrayUtil'

const tween = (
  o: PIXI.DisplayObject,
  vars: PixiPlugin.Vars,
  duration: number,
  ease?: gsap.EaseFunction
): gsap.core.Tween => {
  return gsap.to(o, { pixi: vars, duration, ease: ease ?? Sine.easeOut })
}

/**
 * PIXI.DisplayObjectに対してTweenアニメーションを実行します。
 * awaitアニメーション完了を待つことができます。
 */
export const animate = async (...params: Parameters<typeof tween>): Promise<void> => {
  await tween(...params)
}

/**
 * キャンセル可能なアニメーションを管理・実行します
 */
export class Animator {
  private isCancelled = false
  private canceller?: ComputedRef<boolean>
  private runningTweens: gsap.core.Tween[] = []

  /**
   * キャンセル可能なアニメーションの管理インスタンスを作成します。
   * @param canceller キャンセルすべきかどうかを返すcomputedプロパティ。一度でもtrueになるとその時点で実行中のアニメーションを中断し、以後のアニメーションを全て無視します。
   */
  constructor(canceller?: ComputedRef<boolean>) {
    this.canceller = canceller
    if (canceller) {
      const unwatch = watch([this.canceller], val => {
        if (!val) {
          return
        }
        this.isCancelled = true
        unwatch()
        if (this.runningTweens.length) {
          this.runningTweens.forEach(tw => tw.kill())
          this.runningTweens.length = 0
        }
      })
    }
  }

  /**
   * アニメーションを実行します。すでにキャンセルされている場合には何も起こりません。
   * また、実行を開始した後でキャンセルが成立した場合、アニメーションは途中で打ち切られます。
   * 実行されなかった場合及び、実行が打ち切られた場合にもPromiseはresolveになります（rejectはされません）。
   */
  async animate(...params: Parameters<typeof animate>) {
    if (!this.alive) {
      return
    }
    const tw = tween(...params)
    this.runningTweens.push(tw)
    await tw
    removeFrom(this.runningTweens, tw)
  }

  set(o: PIXI.DisplayObject, vars: PixiPlugin.Vars) {
    this.alive && gsap.set(o, vars)
  }

  cancel() {
    this.isCancelled = true
  }

  get alive() {
    return !this.isCancelled
  }
}
