import { randomFrom } from '@/utils/ArrayUtil'
import { GameLevel } from './GameLevel'
import { cloudSkyStage } from './levels/cloudSkyStage'
import { duskSkyStage } from './levels/duskSkyStage'
import { nightSkyStage } from './levels/nightSkyStage'
import { snowSkyStage } from './levels/snowSkyStage'
import { univSkyStage } from './levels/univSkyStage'
import { waterSkyStage } from './levels/waterSkyStage'

export const openingLevel: GameLevel = {
  themeName: 'sky',
  planetSize: 500,
  planetImgName: 'Planet3',
  planetItem: 'redFlower',
  scoreToClear: 1,
  maxCatSpeed: 0.3,
  maxCatJump: 10,
  catBornInterval: 3,
  satellaites: [
    {
      size: 100,
      imgName: 'Planet2',
      orbitSize: 700,
      orbitDuration: 8,
      initialAngle: 30
    },
    {
      size: 60,
      imgName: 'Planet4',
      orbitSize: 1200,
      orbitDuration: -12,
      initialAngle: 30
    }
  ]
}

export const levels: GameLevel[] = [
  // Lv1 - 5: CloudSky Stage
  ...cloudSkyStage,
  ...nightSkyStage,
  ...snowSkyStage,
  ...waterSkyStage,
  ...duskSkyStage,
  ...univSkyStage
]

export const unknownLevel = randomFrom(levels)
