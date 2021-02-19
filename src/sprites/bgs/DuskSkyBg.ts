import { loadSprite, loadSvgs } from '@/logics/loadImgs'
import { StageBackground } from './StageBackground'
import { BgParticle } from '@/sprites/bgs/BgParticle'
import { themes } from '@/assets/StageThemeDef'

export class DuskSkyBg extends StageBackground {
  private readonly particle: BgParticle

  constructor() {
    super()
    this.particle = new BgParticle(20)
  }

  /**
   * リソースをロードしてアニメーションを開始します。
   */
  async load() {
    const def = themes.dusk
    this.addChild(await loadSprite(`${def.imgDir}/DuskSky.svg`, this.area.width, this.area.height))
    const particleImgReqs = Array(5)
      .fill(0)
      .map((_, index) => ({ url: `${def.imgDir}/Bubble${index + 1}.svg` }))
    const particleTextrues = Object.values(await loadSvgs(...particleImgReqs))
    this.particle.load(particleTextrues)
    this.particle.direction = 'up'
    this.particle.setParticleDuration(8, 20)
    this.particle.setParticleScale(0.4, 4)
    this.addChild(this.particle)
  }
}
