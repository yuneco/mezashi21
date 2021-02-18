import { loadSprite, loadSvgs } from '@/logics/loadImgs'
import { StageBackground } from './StageBackground'
import PaperFilter from '@/filters/PaperFilter'
import { BgParticle } from '@/sprites/bgs/BgParticle'

export class NightSkyBg extends StageBackground {
  private readonly particle: BgParticle

  constructor() {
    super()
    this.particle = new BgParticle(30)
  }

  /**
   * リソースをロードしてアニメーションを開始します。
   */
  async load() {
    const IMGDIR = '/imgs/bg/Night'
    this.addChild(await loadSprite(`${IMGDIR}/NightSky.svg`, this.area.width, this.area.height))
    const cloud1 = await loadSprite(`${IMGDIR}/Cloud1.svg`, this.area.width)
    const cloud2 = await loadSprite(`${IMGDIR}/Cloud2.svg`, this.area.width)
    cloud1.filters = [new PaperFilter(2.5, true)]
    cloud1.y = this.area.height - cloud1.height
    cloud2.filters = [new PaperFilter(2, true, 0.15, 0.25)]
    cloud2.y = this.area.height - cloud2.height

    const particleImgReqs = Array(7)
      .fill(0)
      .map((_, index) => ({ url: `${IMGDIR}/Star${index + 1}.svg` }))
    const particleTextrues = Object.values(await loadSvgs(...particleImgReqs))
    this.particle.load(particleTextrues)

    this.addChild(this.particle, cloud1, cloud2)
  }
}
