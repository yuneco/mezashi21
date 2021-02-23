import { GameLevel } from '../GameLevel'

const themeName = 'snow'
const baseClearScore = 15
const baseCatSpeed = 0.35
const baseCatInterval = 2.5

// Lv11 - 15: SnowSky Stage
export const snowSkyStage: GameLevel[] = [
  //10
  {
    themeName,
    planetSize: 1300,
    planetImgName: 'Planet4',
    planetItem: 'ice',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed * 0.8,
    maxCatJump: 800,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 40,
        imgName: 'Planet3',
        orbitSize: 150,
        orbitDuration: -13,
        initialAngle: 30
      }
    ]
  },
  //11
  {
    themeName,
    planetSize: 1100,
    planetImgName: 'Planet4',
    planetItem: 'ice',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed * 0.8,
    maxCatJump: 800,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 60,
        imgName: 'Planet3',
        orbitSize: 350,
        orbitDuration: -18,
        initialAngle: 30
      }
    ]
  },
  //12
  {
    themeName,
    planetSize: 900,
    planetImgName: 'Planet4',
    planetItem: 'ice',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed,
    maxCatJump: 2000,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 200,
        imgName: 'Planet2',
        orbitSize: 850,
        orbitDuration: -18,
        initialAngle: 30
      }
    ]
  },
  //13
  {
    themeName,
    planetSize: 1000,
    planetImgName: 'Planet1',
    planetItem: 'ice',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed,
    maxCatJump: 2000,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 120,
        imgName: 'Planet4',
        orbitSize: 800,
        orbitDuration: 18,
        initialAngle: 30
      }
    ]
  },
  //14
  {
    themeName,
    planetSize: 700,
    planetImgName: 'Planet3',
    planetItem: 'ice',
    scoreToClear: baseClearScore + 15,
    maxCatSpeed: baseCatSpeed,
    maxCatJump: 1200,
    catBornInterval: baseCatInterval * 0.5,
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
