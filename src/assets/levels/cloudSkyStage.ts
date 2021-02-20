import { GameLevel } from '../GameLevel'

const themeName = 'sky'
const baseClearScore = 5
const baseCatSpeed = 0.2
const baseCatInterval = 3.0

// Lv1 - 5: CloudSky Stage
export const cloudSkyStage: GameLevel[] = [
  {
    themeName,
    planetSize: 500,
    planetImgName: 'Planet1',
    planetItem: 'redFlower',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed,
    maxCatJump: 0,
    catBornInterval: baseCatInterval,
    satellaites: []
  },
  {
    themeName,
    planetSize: 1000,
    planetImgName: 'Planet5',
    planetItem: 'redFlower',
    scoreToClear: baseClearScore + 1,
    maxCatSpeed: baseCatSpeed + 0.2,
    maxCatJump: 0,
    catBornInterval: baseCatInterval,
    satellaites: []
  },
  {
    themeName,
    planetSize: 700,
    planetImgName: 'Planet3',
    scoreToClear: baseClearScore + 2,
    maxCatSpeed: baseCatSpeed + 0.4,
    maxCatJump: 500,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 60,
        imgName: 'Planet3',
        orbitSize: 1500,
        orbitDuration: -12,
        initialAngle: 30
      }
    ]
  },
  {
    themeName,
    planetSize: 360,
    planetImgName: 'Planet9',
    scoreToClear: baseClearScore + 3,
    maxCatSpeed: baseCatSpeed + 0.6,
    maxCatJump: 500,
    catBornInterval: baseCatInterval * 0.7,
    satellaites: [
      {
        size: 60,
        imgName: 'Planet3',
        orbitSize: 1200,
        orbitDuration: 16,
        initialAngle: 30
      }
    ]
  },
  {
    themeName,
    planetSize: 500,
    planetImgName: 'Planet6',
    scoreToClear: baseClearScore + 15,
    maxCatSpeed: baseCatSpeed + 0.2,
    maxCatJump: 1500,
    catBornInterval: baseCatInterval * 0.3,
    satellaites: [
      {
        size: 120,
        imgName: 'Planet7',
        orbitSize: 700,
        orbitDuration: 11,
        initialAngle: 30
      }
    ]
  }
]
