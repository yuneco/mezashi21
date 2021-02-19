import { loadSprite, loadSvgs } from '@/logics/loadImgs'
import { StageBackground } from './StageBackground'
import PaperFilter from '@/filters/PaperFilter'
import { BgParticle } from '@/sprites/bgs/BgParticle'
import { themes } from '@/assets/StageThemeDef'

export class WaterBg extends StageBackground {
  private readonly particle: BgParticle

  constructor() {
    super()
    this.particle = new BgParticle(50)
  }

  /**
   * リソースをロードしてアニメーションを開始します。
   */
  async load() {
    const def = themes.water
    this.addChild(await loadSprite(`${def.imgDir}/WaterBg.svg`, this.area.width, this.area.height))
    const wave1 = await loadSprite(`${def.imgDir}/Wave1.svg`, this.area.width)
    const wave2 = await loadSprite(`${def.imgDir}/Wave2.svg`, this.area.width)
    const wave3 = await loadSprite(`${def.imgDir}/Wave3.svg`, this.area.width)
    ;[wave1, wave2, wave3].forEach(wave => {
      wave.y = this.area.height - wave.height
      wave.filters = [new PaperFilter(1.5 + Math.random(), true)]
    })

    const particleImgReqs = Array(4)
      .fill(0)
      .map((_, index) => ({ url: `${def.imgDir}/WaterBubble${index + 1}.svg` }))
    const particleTextrues = Object.values(await loadSvgs(...particleImgReqs))
    this.particle.load(particleTextrues)
    this.particle.setParticleDuration(4, 12)
    this.particle.setParticleScale(0.4, 4.5)

    this.addChild(wave1, wave2, wave3, this.particle)
  }
}
