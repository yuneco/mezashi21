import * as PIXI from 'pixi.js'
import gsap, { Sine } from 'gsap'
import { ComputedRef, watch } from 'vue'
import { removeFrom } from '@/core/ArrayUtil'

const tween = (
  o: PIXI.DisplayObject,
  vars: PixiPlugin.Vars,
  duration: number,
  ease?: gsap.EaseFunction
): gsap.core.Tween => {
  return gsap.to(o, { pixi: vars, duration, ease: ease ?? Sine.easeOut })
}

export const animate = async (...params: Parameters<typeof tween>): Promise<void> => {
  await tween(...params)
}

export class Animator {
  private isCancelled = false
  private canceller?: ComputedRef<boolean>
  private runningTweens: gsap.core.Tween[] = []

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
