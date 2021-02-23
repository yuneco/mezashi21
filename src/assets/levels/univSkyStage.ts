import { GameLevel } from '../GameLevel'

const themeName = 'univ'
const baseClearScore = 20
const baseCatSpeed = 0.4
const baseCatInterval = 1.8

// Lv26 - 30: UnivSky Stage
export const univSkyStage: GameLevel[] = [
  //25
  {
    themeName,
    planetSize: 750,
    planetImgName: 'Planet2',
    planetItem: 'goldFlower',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed * 0.9,
    maxCatJump: 500,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 120,
        imgName: 'Planet5',
        orbitSize: 750,
        orbitDuration: 30,
        initialAngle: 30
      }
    ]
  },
  //26
  {
    themeName,
    planetSize: 600,
    planetImgName: 'Planet6',
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
  //27
  {
    themeName,
    planetSize: 400,
    planetImgName: 'Planet9',
    planetItem: 'waterGrass',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed * 0.4,
    maxCatJump: 2200,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 30,
        imgName: 'Planet5',
        orbitSize: 200,
        orbitDuration: 10,
        initialAngle: 30
      }
    ]
  },
  //28
  {
    themeName,
    planetSize: 700,
    planetImgName: 'Planet5',
    planetItem: 'goldFlower',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed,
    maxCatJump: 800,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 20,
        imgName: 'Planet4',
        orbitSize: 60,
        orbitDuration: -12,
        initialAngle: 30
      },
      {
        size: 35,
        imgName: 'Planet4',
        orbitSize: 100,
        orbitDuration: 13,
        initialAngle: 30
      },
      {
        size: 120,
        imgName: 'Planet4',
        orbitSize: 1000,
        orbitDuration: 15,
        initialAngle: 30
      }
    ]
  },
  //29
  {
    themeName,
    planetSize: 700,
    planetImgName: 'Planet6',
    planetItem: 'goldFlower',
    scoreToClear: baseClearScore + 20,
    maxCatSpeed: baseCatSpeed * 1.1,
    maxCatJump: 1200,
    catBornInterval: baseCatInterval * 0.7,
    satellaites: [
      {
        size: 120,
        imgName: 'Planet6',
        orbitSize: 220,
        orbitDuration: 11,
        initialAngle: 30
      },
      {
        size: 40,
        imgName: 'Planet6',
        orbitSize: 760,
        orbitDuration: 17,
        initialAngle: 30
      }
    ]
  }
]
