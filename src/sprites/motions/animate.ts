import * as PIXI from 'pixi.js'
import gsap, { Sine } from 'gsap'

export const animate = async (
  o: PIXI.DisplayObject,
  vars: PixiPlugin.Vars,
  duration: number,
  ease?: gsap.EaseFunction
) => {
  await gsap.to(o, { pixi: vars, duration, ease: ease ?? Sine.easeOut })
}

export const anime = (
  o: PIXI.DisplayObject,
  vars: PixiPlugin.Vars,
  duration: number,
  ease?: gsap.EaseFunction
) => {
  return async () => {
    await gsap.to(o, { pixi: vars, duration, ease: ease ?? Sine.easeOut })
  }
}
