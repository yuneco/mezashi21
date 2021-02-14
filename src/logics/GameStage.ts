import { PixiApp } from './PixiApp'
import { Tama } from '@/sprites/tama/Tama'
import { Cat } from '@/sprites/Cat'
import { Planet } from '@/sprites/Planet'
import { Mezashi } from '@/sprites/Mezashi'
import { StarBg } from '@/sprites/StarBg'
import store from '@/store'
import { Satellite } from '@/sprites/Satellite'
import { angleOfPoints } from './coordUtils'
import { removeFrom } from '@/core/ArrayUtil'
import { CollisionDetector, CollidableObject } from '@/logics/CollisionDetector'

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

const indecatorAngleForOrbit = (orbit: number) => {
  const width = store.state.stageSetting.vw
  const rad = Math.acos(width / (orbit + 200))
  const angle = (rad / Math.PI) * 180
  return 90 - angle
}

export class GameStage {
  private readonly app: PixiApp

  readonly tama: Tama
  readonly starBg: StarBg
  readonly planet: Planet
  readonly cats: Cat[]
  readonly sats: Satellite[]
  readonly mezashis: Mezashi[]

  readonly detector = new CollisionDetector()

  constructor(canvas: HTMLCanvasElement) {
    this.app = new PixiApp(canvas)

    const PLANET_SIZE = 600
    this.starBg = new StarBg()
    this.planet = new Planet(PLANET_SIZE)
    this.tama = new Tama()
    this.cats = []
    this.sats = [
      new Satellite(30, PLANET_SIZE + 600, 7, true),
      new Satellite(80, PLANET_SIZE + 1300, 12, false)
    ]
    this.mezashis = []
  }

  async load() {
    const sprites = [this.starBg, this.planet, ...this.sats, this.tama, ...this.cats]
    await Promise.all(sprites.map(sp => sp.load()))
    sprites.map(sp => this.app.cameraLayer.addChild(sp))

    this.planet.x = 375
    this.planet.y = 1200
    setOnPlanet(this.planet, this.tama)
    setOnPlanetCenter(this.planet, ...this.sats)

    this.app.ticker.add(() => {
      this.onTick()
    })

    this.app.world.on('pointertap', (ev: PIXI.InteractionEvent) => {
      this.onWorldTap(ev)
    })

    setInterval(() => {
      const MAX_CATS = 10
      if (this.cats.length >= MAX_CATS) {
        return
      }
      this.addCat()
    }, 3000)
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

  private async addCat() {
    const cat = new Cat()
    await cat.load()
    this.cats.push(cat)
    const isDirRight = Math.random() > 0.5
    cat.direction = isDirRight ? 'right' : 'left'
    cat.angle = this.tama.angle + 120 * (isDirRight ? 1 : -1)
    this.app.cameraLayer.addChild(cat)
    setOnPlanet(this.planet, cat)
  }

  private async removeCat(cat: Cat) {
    removeFrom(this.cats, cat)
    await cat.overMotion()
    cat.parent.removeChild(cat)
  }

  private onTick() {
    this.app.moveCamera(this.tama.chara.parent)

    const isGameOver = store.state.game.play === 'over'
    if (!isGameOver) {
      const tamaDir = store.state.tama.dir
      const isJumping = store.state.tama.jumpCount > 0
      if (tamaDir == 'right') {
        this.tama.angle += isJumping ? 0.3 : 0.1
        this.tama.scale.x = 1
      }
      if (tamaDir == 'left') {
        this.tama.angle -= isJumping ? 0.3 : 0.1
        this.tama.scale.x = -1
      }
    }

    this.cats.forEach(cat => {
      cat.angle += cat.direction === 'left' ? 0.15 : -0.15
    })

    this.sats.forEach(sat => {
      const baseAngle = (this.tama.angle + 180) % 360
      const angleDiff = sat.satelliteAngle - baseAngle
      const angleDiffNormalized = angleDiff < 0 ? angleDiff + 360 : angleDiff
      const approachAngle = sat.isClockwise ? 360 - angleDiffNormalized : angleDiffNormalized
      const isApproaching = approachAngle > 20 && approachAngle < 90
      const IndicatorAngle = indecatorAngleForOrbit(sat.orbitSize)
      sat.IndicatorAngle = isApproaching
        ? baseAngle + IndicatorAngle * (sat.isClockwise ? -1 : 1)
        : undefined
    })

    this.detectCollision()
  }

  private onWorldTap(ev: PIXI.InteractionEvent) {
    const isGameOver = store.state.game.play === 'over'
    if (isGameOver) {
      return // ゲームオーバーなら何もできない
    }
    const local = this.app.global2Camera(ev.data.global)
    // めざし発射
    this.addMezashi(local)
    // タップの方向に合わせて向きを変える
    const size = ev.data.global.x < store.state.stageSetting.width / 2 ? 'left' : 'right'
    store.commit('setTamaDirection', { dir: size })
  }

  private detectCollision = () => {
    const targets: CollidableObject[] = []
    targets.push({
      obj: this.tama.chara,
      id: 'tama',
      category: 'tama',
      targets: ['cat', 'sat'],
      margin: [0.18, 0.1]
    })
    targets.push(
      ...this.cats
        .filter(cat => cat.worldVisible)
        .map(cat => ({
          obj: cat.chara,
          id: cat.id,
          category: 'cat',
          targets: ['mezashi']
        }))
    )
    targets.push(
      ...this.mezashis
        .filter(mzs => mzs.worldVisible)
        .map(mzs => ({
          obj: mzs.chara,
          id: mzs.id,
          category: 'mezashi',
          targets: ['cat']
        }))
    )
    targets.push(
      ...this.sats
        .filter(sat => sat.worldVisible)
        .map(sat => ({
          obj: sat.cont,
          id: sat.id,
          category: 'sat'
        }))
    )

    this.detector.clear()
    this.detector.add(...targets)
    const hitPairs = this.detector.detect()
    if (!hitPairs.length) {
      return
    }

    hitPairs.forEach(pair => {
      const sub = pair[0]
      // たまさんが何かに当たった
      if (sub.id === 'tama') {
        store.dispatch('gameOver')
      }
      // 猫がめざしに当たった
      if (sub.category === 'cat') {
        const cat = this.cats.find(cat => cat.id === sub.id)
        if (cat) {
          store.dispatch('gameIncrementScore')
          this.removeCat(cat)
        }
      }
      // めざしが何かに当たった
      if (sub.category === 'mezashi') {
        const mzs = this.mezashis.find(mzs => mzs.id === sub.id)
        if (mzs) {
          mzs.visible = false
        }
      }
    })
  }
}
