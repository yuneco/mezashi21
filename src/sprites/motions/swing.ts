import gsap, { Sine } from 'gsap'

export const swing = (o: PIXI.DisplayObject, duration: number, range: number, isRepeat = true) => {
  const baseAngle = o.angle
  const tl = gsap.timeline()
  tl.to(o, {
    pixi: { angle: baseAngle - range / 2 },
    duration: duration / 4,
    ease: Sine.easeOut
  }).to(o, {
    pixi: { angle: baseAngle + range / 2 },
    duration: duration / 2,
    yoyo: true,
    repeat: isRepeat ? -1 : 0,
    ease: Sine.easeInOut
  })
  return tl
}
