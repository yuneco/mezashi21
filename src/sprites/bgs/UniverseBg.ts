import * as PIXI from 'pixi.js'

import { loadSprite, loadSvgs } from '@/logics/loadImgs'
import { StageBackground } from './StageBackground'
import PaperFilter from '@/filters/PaperFilter'
import { BgParticle } from '@/sprites/bgs/BgParticle'
import { themes } from '@/assets/StageThemeDef'

export class UniverseBg extends StageBackground {
  private readonly particle: BgParticle
  private readonly particleFront: BgParticle
  private readonly frontLayer: PIXI.Container

  constructor(frontLayer: PIXI.Container) {
    super()
    this.particle = new BgParticle(300)
    this.particleFront = new BgParticle(100)
    this.frontLayer = frontLayer
  }

  /**
   * リソースをロードしてアニメーションを開始します。
   */
  async load() {
    const def = themes.univ
    await this.loadBg(`${def.imgDir}/UnivSky.svg`)
    const asteroids = await loadSprite(`${def.imgDir}/Asteroids.svg`, this.area.width)
    asteroids.y = this.area.height - asteroids.height
    asteroids.filters = [new PaperFilter(1.5 + Math.random(), true)]

    const particleImgReqs = Array(8)
      .fill(0)
      .map((_, index) => ({ url: `${def.imgDir}/Dust${index + 1}.svg` }))
    const particleTextrues = Object.values(await loadSvgs(...particleImgReqs))
    this.particle.load(particleTextrues)
    this.particle.direction = 'down'
    this.particle.setParticleDuration(4, 12)
    this.particle.setParticleScale(0.2, 1.5)
    this.addChild(asteroids, this.particle)

    // 前面パーティクル
    this.particleFront.load(particleTextrues)
    this.particleFront.direction = 'down'
    this.particleFront.setParticleDuration(2, 5)
    this.particleFront.setParticleScale(1.0, 3.5)
    this.particleFront.filters = [new PIXI.filters.BlurFilter(5, 4)]
    this.frontLayer.addChild(this.particleFront)
    this.on('removed', () => {
      this.frontLayer.removeChild(this.particleFront)
    })
  }
}
