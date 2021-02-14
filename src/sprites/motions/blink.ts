import { sleep } from '@/core/sleep'

export const blink = async (o: PIXI.DisplayObject, interval: number, times: number) => {
  let count = 0
  let isRemoved = false
  o.on('removed', () => (isRemoved = true))
  while (count < times && !isRemoved) {
    count++
    await sleep(interval * 1000)
    o.visible = !o.visible
  }
}
