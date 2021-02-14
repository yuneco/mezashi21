import store from "@/store"

export class AutoCatMaker {
  interval: number
  private cb: () => void
  private timer?: number
  constructor(cb: () => void, interval = 1.5) {
    this.interval = interval
    this.cb = cb
  }
  private fire() {
    if (store.state.game.play !== 'playing') {
      this.timer = undefined
      return
    }
    this.cb()
    this.timer = setTimeout(() => this.fire(), this.interval * 1000)
  }

  stop = () => {
    clearTimeout(this.timer)
    this.timer = undefined
  }

  start = () => {
    if (this.timer) {
      return
    }
    this.timer = setTimeout(() => this.fire(), this.interval * 1000)
  }
}
