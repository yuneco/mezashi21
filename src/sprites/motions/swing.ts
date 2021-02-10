import { TweenMax, Sine } from 'gsap'

export const swing = (
  o: PIXI.DisplayObject,
  duration: number,
  range: number
) => {
  const baseAngle = o.angle
  TweenMax.to(o, {
    pixi: { angle: baseAngle - range / 2 },
    duration: duration / 4
  }).then(() => {
    TweenMax.to(o, {
      pixi: { angle: baseAngle + range / 2 },
      duration: duration / 2,
      yoyo: true,
      repeat: -1,
      ease: Sine.easeInOut
    })
  })
}
