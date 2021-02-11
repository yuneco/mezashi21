import gsap, { Linear } from 'gsap'

export const rotate = (
  o: PIXI.DisplayObject,
  duration: number,
  isClockwise = true,
  isRepeat = true
) => {
  return gsap.to(o, {
    pixi: { angle: o.angle + (isClockwise ? 360 : -360) },
    duration,
    repeat: isRepeat ? -1 : 0,
    ease: Linear.easeNone
  })
}
