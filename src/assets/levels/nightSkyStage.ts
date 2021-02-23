import { GameLevel } from '../GameLevel'

const themeName = 'night'
const baseClearScore = 10
const baseCatSpeed = 0.3
const baseCatInterval = 2.5

// Lv6 - 10: NightSky Stage
export const nightSkyStage: GameLevel[] = [
  {
    themeName,
    planetSize: 700,
    planetImgName: 'Planet3',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed,
    maxCatJump: 0,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 40,
        imgName: 'Planet5',
        orbitSize: 250,
        orbitDuration: -13,
        initialAngle: 30
      }
    ]
  },
  {
    themeName,
    planetSize: 1000,
    planetImgName: 'Planet5',
    planetItem: 'redFlower',
    scoreToClear: baseClearScore + 1,
    maxCatSpeed: baseCatSpeed * 0.6,
    maxCatJump: 1000,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 40,
        imgName: 'Planet5',
        orbitSize: 550,
        orbitDuration: 20,
        initialAngle: 30
      }
    ]
  },
  {
    themeName,
    planetSize: 700,
    planetImgName: 'Planet3',
    scoreToClear: baseClearScore + 2,
    maxCatSpeed: baseCatSpeed * 1.3,
    maxCatJump: 1000,
    catBornInterval: baseCatInterval * 0.7,
    satellaites: [
      {
        size: 60,
        imgName: 'Planet3',
        orbitSize: 1200,
        orbitDuration: -12,
        initialAngle: 30
      },
      {
        size: 40,
        imgName: 'Planet3',
        orbitSize: 1000,
        orbitDuration: 12,
        initialAngle: 30
      }
    ]
  },
  {
    themeName,
    planetSize: 360,
    planetImgName: 'Planet8',
    scoreToClear: baseClearScore + 3,
    maxCatSpeed: baseCatSpeed * 1.5,
    maxCatJump: 2000,
    catBornInterval: baseCatInterval * 0.7,
    satellaites: [
      {
        size: 60,
        imgName: 'Planet4',
        orbitSize: 600,
        orbitDuration: 8,
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
    maxCatJump: 2000,
    catBornInterval: baseCatInterval * 0.6,
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
