import { loadSvgs } from '@/logics/loadImgs'
import { StageBackground } from './StageBackground'
import { BgParticle } from '@/sprites/bgs/BgParticle'

export class SnowSkyBg extends StageBackground {
  private readonly particle: BgParticle

  constructor() {
    super()
    this.particle = new BgParticle(30)
  }

  /**
   * リソースをロードしてアニメーションを開始します。
   */
  async load() {
    const IMGDIR = '/imgs/bg/snow'
    await this.loadBg(`${IMGDIR}/SnowSky.svg`)
    const particleImgReqs = Array(6)
      .fill(0)
      .map((_, index) => ({ url: `${IMGDIR}/Snow${index + 1}.svg` }))
    const particleTextrues = Object.values(await loadSvgs(...particleImgReqs))
    this.particle.load(particleTextrues)
    this.particle.direction = 'down'
    this.particle.setParticleDuration(8, 12)

    this.addChild(this.particle)
  }
}
