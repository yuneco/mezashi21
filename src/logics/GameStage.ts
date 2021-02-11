import { PixiApp } from './PixiApp'
import { Tama } from '@/sprites/tama/Tama'
import { Cat } from '@/sprites/Cat'
import { Planet } from '@/sprites/Planet'
import { StarBg } from '@/sprites/StarBg'
//import { animate } from '@/sprites/core/animate'
import store from '@/store'

const setOnPlanet = (planet: Planet, ...charas: PIXI.Container[]) => {
  charas.forEach(chara => {
    chara.x = planet.x
    chara.y = planet.y
    chara.pivot.y = planet.size / 2
  })
}

export class GameStage {
  private readonly app: PixiApp

  readonly tama: Tama
  readonly starBg: StarBg
  readonly planet: Planet
  readonly cats: Cat[]

  constructor(canvas: HTMLCanvasElement) {
    this.app = new PixiApp(canvas)

    const PLANET_SIZE = 700
    this.starBg = new StarBg()
    this.planet = new Planet(PLANET_SIZE)
    this.tama = new Tama()
    this.cats = [new Cat()]
  }

  async load() {
    const sprites = [this.starBg, this.planet, this.tama, ...this.cats]
    await Promise.all(sprites.map(sp => sp.load()))
    sprites.map(sp => this.app.cameraLayer.addChild(sp))

    this.planet.x = 375
    this.planet.y = 1200
    setOnPlanet(this.planet, this.tama, ...this.cats)
    this.cats[0].angle = 60

    this.app.ticker.add(() => {
      this.onTick()
    })
  }

  private onTick() {
    this.app.moveCamera(this.tama.chara.parent)

    const tamaDir = store.state.tama.dir
    if (tamaDir == 'right') {
      this.tama.angle += 0.1
      this.tama.scale.x = 1
    }
    if (tamaDir == 'left') {
      this.tama.angle -= 0.1
      this.tama.scale.x = -1
    }
  }
}
