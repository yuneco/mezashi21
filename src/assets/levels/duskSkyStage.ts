import { GameLevel } from '../GameLevel'

const themeName = 'dusk'
const baseClearScore = 20
const baseCatSpeed = 0.43
const baseCatInterval = 2.0

// Lv21 - 25: DuskSky Stage
export const duskSkyStage: GameLevel[] = [
  //20
  {
    themeName,
    planetSize: 1000,
    planetImgName: 'Planet6',
    planetItem: 'redFlower',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed * 0.9,
    maxCatJump: 2000,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 140,
        imgName: 'Planet3',
        orbitSize: 750,
        orbitDuration: -30,
        initialAngle: 30
      },
      {
        size: 120,
        imgName: 'Planet3',
        orbitSize: 850,
        orbitDuration: 30,
        initialAngle: 30
      }
    ]
  },
  //21
  {
    themeName,
    planetSize: 600,
    planetImgName: 'Planet8',
    planetItem: 'goldFlower',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed * 1.15,
    maxCatJump: 200,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 60,
        imgName: 'Planet7',
        orbitSize: 350,
        orbitDuration: -18,
        initialAngle: 30
      },
      {
        size: 60,
        imgName: 'Planet7',
        orbitSize: 950,
        orbitDuration: 21,
        initialAngle: 30
      }
    ]
  },
  //22
  {
    themeName,
    planetSize: 1400,
    planetImgName: 'Planet1',
    planetItem: 'waterGrass',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed * 0.6,
    maxCatJump: 2800,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 120,
        imgName: 'Planet1',
        orbitSize: 850,
        orbitDuration: -18,
        initialAngle: 30
      },
      {
        size: 30,
        imgName: 'Planet1',
        orbitSize: 200,
        orbitDuration: 14,
        initialAngle: 30
      }
    ]
  },
  //23
  {
    themeName,
    planetSize: 900,
    planetImgName: 'Planet3',
    planetItem: 'redFlower',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed,
    maxCatJump: 1000,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 20,
        imgName: 'Planet8',
        orbitSize: 60,
        orbitDuration: -12,
        initialAngle: 30
      },
      {
        size: 20,
        imgName: 'Planet8',
        orbitSize: 720,
        orbitDuration: 13,
        initialAngle: 30
      },
      {
        size: 20,
        imgName: 'Planet8',
        orbitSize: 1000,
        orbitDuration: 15,
        initialAngle: 30
      }
    ]
  },
  //24
  {
    themeName,
    planetSize: 700,
    planetImgName: 'Planet6',
    planetItem: 'waterGrass',
    scoreToClear: baseClearScore + 20,
    maxCatSpeed: baseCatSpeed * 1.1,
    maxCatJump: 500,
    catBornInterval: baseCatInterval * 0.7,
    satellaites: [
      {
        size: 120,
        imgName: 'Planet8',
        orbitSize: 200,
        orbitDuration: 11,
        initialAngle: 30
      }
    ]
  }
]
