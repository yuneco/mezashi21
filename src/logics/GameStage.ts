import { PixiApp } from './PixiApp'
import { Tama } from '@/sprites/tama/Tama'
import { Cat } from '@/sprites/Cat'
import { Planet } from '@/sprites/Planet'
import { Mezashi } from '@/sprites/Mezashi'
import { StarBg } from '@/sprites/StarBg'
//import { animate } from '@/sprites/core/animate'
import store from '@/store'
import { Satellite } from '@/sprites/Satellite'
import { angleOfPoints } from './coordUtils'
import { removeFrom } from '@/core/ArrayUtil'

const setOnPlanet = (planet: Planet, ...charas: PIXI.Container[]) => {
  charas.forEach(chara => {
    chara.x = planet.x
    chara.y = planet.y
    chara.pivot.y = planet.size / 2
  })
}
const setOnPlanetCenter = (planet: Planet, ...charas: PIXI.Container[]) => {
  charas.forEach(chara => {
    chara.x = planet.x
    chara.y = planet.y
  })
}

export class GameStage {
  private readonly app: PixiApp

  readonly tama: Tama
  readonly starBg: StarBg
  readonly planet: Planet
  readonly cats: Cat[]
  readonly sats: Satellite[]
  readonly mezashis: Mezashi[]

  constructor(canvas: HTMLCanvasElement) {
    this.app = new PixiApp(canvas)

    const PLANET_SIZE = 700
    this.starBg = new StarBg()
    this.planet = new Planet(PLANET_SIZE)
    this.tama = new Tama()
    this.cats = [new Cat()]
    this.sats = [
      new Satellite(30, PLANET_SIZE + 600, 16, true),
      new Satellite(80, PLANET_SIZE + 900, 22, false)
    ]
    this.mezashis = []
  }

  async load() {
    const sprites = [this.starBg, this.planet, ...this.sats, this.tama, ...this.cats]
    await Promise.all(sprites.map(sp => sp.load()))
    sprites.map(sp => this.app.cameraLayer.addChild(sp))

    this.planet.x = 375
    this.planet.y = 1200
    setOnPlanet(this.planet, this.tama, ...this.cats)
    this.cats[0].angle = 60
    setOnPlanetCenter(this.planet, ...this.sats)

    this.app.ticker.add(() => {
      this.onTick()
    })

    this.app.world.on('pointertap', (ev: PIXI.InteractionEvent) => {
      this.onWorldTap(ev)
    })
  }

  private async addMezashi(aimTo: PIXI.Point) {
    const mzs = new Mezashi()
    await mzs.load()
    
    const tamaPos = this.tama.globalTamaPos
    const tamaDir = store.state.tama.dir
    tamaPos.x += tamaDir === 'left' ? -40 : 40
    tamaPos.y -= 60
    const from = this.app.global2Camera(tamaPos)
    const angle = angleOfPoints(from, aimTo)
    this.mezashis.push(mzs)
    this.app.cameraLayer.addChild(mzs)
    await mzs.fire(from, angle, 1200)
    this.app.cameraLayer.removeChild(mzs)
    removeFrom(this.mezashis, mzs)
  }

  private onTick() {
    this.app.moveCamera(this.tama.chara.parent)

    const tamaDir = store.state.tama.dir
    const isJumping = this.tama.isJumping
    if (tamaDir == 'right') {
      this.tama.angle += isJumping ? 0.3 : 0.1
      this.tama.scale.x = 1
    }
    if (tamaDir == 'left') {
      this.tama.angle -= isJumping ? 0.3 : 0.1
      this.tama.scale.x = -1
    }
    this.cats.forEach(cat => {
      cat.angle -= 0.07
    })
  }

  private onWorldTap(ev: PIXI.InteractionEvent) {
    console.log(ev)
    const isBgTap = ev.target === this.app.world
    if (isBgTap) {
      const local = this.app.global2Camera(ev.data.global)
      // めざし発射
      this.addMezashi(local)
      // タップの方向に合わせて向きを変える
      const size = (ev.data.global.x < store.state.stageSetting.width / 2) ? 'left' : 'right'
      store.commit('setTamaDirection', {dir: size})
    }
  }

}
