import { PixiApp } from './PixiApp'
import { Tama } from '@/sprites/tama/Tama'
import { Cat } from '@/sprites/Cat'
import { Planet } from '@/sprites/Planet'
import { Mezashi } from '@/sprites/Mezashi'
import { StarBg } from '@/sprites/StarBg'
import store from '@/store'
import { Satellite } from '@/sprites/Satellite'
import { CollisionDetector } from '@/logics/CollisionDetector'
import { addMezashi, clearMezashis } from './stageLogics/mezashiLogics'
import { addCat, clearCats } from './stageLogics/catLogic'
import {
  detectCollision,
  updateCatPos,
  updateSatIndicator,
  updateTamaPos
} from './stageLogics/onTick'
import { AutoCatMaker } from './stageLogics/AutoCatMaker'
import { changePlanet } from './stageLogics/planetLogics'
import { addSatellite, clearSatellites } from './stageLogics/satelliteLogics'
import { levels } from '@/assets/GameLevelDef'
import { watch } from 'vue'

export class GameStage {
  readonly app: PixiApp
  readonly detector = new CollisionDetector()

  readonly tama: Tama
  readonly starBg: StarBg
  planet: Planet
  readonly cats: Cat[] = []
  readonly sats: Satellite[] = []
  readonly mezashis: Mezashi[] = []
  private readonly catMaker: AutoCatMaker

  constructor(canvas: HTMLCanvasElement) {
    this.app = new PixiApp(canvas)

    // 初期要素を配置して初期化
    this.starBg = new StarBg()
    this.planet = new Planet(100) // ダミー
    this.tama = new Tama()
    this.catMaker = new AutoCatMaker(() => {
      if (this.cats.length < 10) {
        const speed = 0.1 + Math.random() * 0.3
        addCat(this, speed)
      }
    })

    // ゲーム状態の変更監視
    watch(
      () => store.state.game.scoreInLevel,
      async newScore => {
        const level = levels[store.state.game.level] ?? levels[0]
        if (newScore >= level.scoreToClear) {
          // レベルアップ
          console.log('LEVEL UP: ' + (store.state.game.level + 1))
          store.dispatch('gameLevelUp')
          this.reset()
        }
      }
    )
  }

  async reset() {
    this.tama.angle = 0
    clearCats(this)
    clearSatellites(this)
    clearMezashis(this)

    const levelNo = store.state.game.level
    const level = levels[levelNo] || levels[0]
    console.log('NEW LEVEL:' + levelNo, level)

    // 仮データセット
    // TODO: レベル定義と現在のレベルから生成する
    await changePlanet(this, level.planetSize)
    await Promise.all(
      level.satellaites.map(satDef =>
        addSatellite(this, {
          size: satDef.size,
          orbitSize: level.planetSize + satDef.orbitSize,
          orbitDuration: satDef.orbitDuration,
          initialAngle: 0
        })
      )
    )
    // たまさんの表示順を一番上にするためaddしなおす
    this.tama.parent.addChild(this.tama)

    // カメラ位置をセット
    this.app.moveCamera(this.tama.chara.parent)

    // 猫生成機を（再）始動
    this.catMaker.interval = level.catBornInterval
    this.catMaker.start()
  }

  async load() {
    this.app.cameraLayer.visible = false
    const sprites = [this.starBg, this.tama]
    await Promise.all(sprites.map(sp => sp.load()))
    sprites.map(sp => this.app.cameraLayer.addChild(sp))
    await this.reset()
    this.app.cameraLayer.visible = true

    this.app.ticker.add(() => {
      this.onTick()
    })

    this.app.world.on('pointertap', (ev: PIXI.InteractionEvent) => {
      this.onWorldTap(ev)
    })
  }

  private onWorldTap(ev: PIXI.InteractionEvent) {
    const isGameOver = store.state.game.play === 'over'
    if (isGameOver) {
      return // ゲームオーバーなら何もできない
    }
    const local = this.app.global2Camera(ev.data.global)
    // めざし発射
    addMezashi(this, local)
    // タップの方向に合わせてたまさんの向きを変える
    const size = ev.data.global.x < store.state.stageSetting.width / 2 ? 'left' : 'right'
    store.commit('setTamaDirection', { dir: size })
  }

  private onTick() {
    this.app.moveCamera(this.tama.chara.parent)
    updateTamaPos(this.tama)
    this.cats.forEach(updateCatPos)
    this.sats.forEach(sat => {
      updateSatIndicator(sat, this.tama.angle)
    })
    detectCollision(this)
  }
}
