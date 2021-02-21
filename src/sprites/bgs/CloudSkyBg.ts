import { loadSprite, loadSvgs } from '@/logics/loadImgs'
import { StageBackground } from './StageBackground'
import PaperFilter from '@/filters/PaperFilter'
import { BgParticle } from '@/sprites/bgs/BgParticle'

export class CloudSkyBg extends StageBackground {
  private readonly particle: BgParticle

  constructor() {
    super()
    this.particle = new BgParticle(50)
  }

  /**
   * リソースをロードしてアニメーションを開始します。
   */
  async load() {
    const IMGDIR = '/imgs/bg/sky'
    await this.loadBg(`${IMGDIR}/BlueSky.svg`)
    const cloud1 = await loadSprite(`${IMGDIR}/Cloud1.svg`)
    const cloud2 = await loadSprite(`${IMGDIR}/Cloud2.svg`)
    cloud1.filters = [new PaperFilter(2.5, true)]
    cloud1.scale.set(2.5)
    cloud1.y = this.area.height - cloud1.height
    cloud2.filters = [new PaperFilter(2, true, 0.15, 0.25)]
    cloud2.scale.set(1.7)
    cloud2.y = this.area.height - cloud2.height

    const particleTextrues = Object.values(
      await loadSvgs(
        { url: `${IMGDIR}/BubleWhite1.svg` },
        { url: `${IMGDIR}/BubleWhite2.svg` },
        { url: `${IMGDIR}/BubleWhite3.svg` }
      )
    )
    this.particle.load(particleTextrues)

    this.addChild(cloud1, cloud2, this.particle)
  }
}
