import { GameLevel } from '../GameLevel'

const themeName = 'water'
const baseClearScore = 20
const baseCatSpeed = 0.39
const baseCatInterval = 2.2

// Lv16 - 20: WaterSky Stage
export const waterSkyStage: GameLevel[] = [
  //15
  {
    themeName,
    planetSize: 1300,
    planetImgName: 'Planet4',
    planetItem: 'waterGrass',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed * 0.85,
    maxCatJump: 200,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 40,
        imgName: 'Planet2',
        orbitSize: 250,
        orbitDuration: -13,
        initialAngle: 30
      }
    ]
  },
  //16
  {
    themeName,
    planetSize: 1100,
    planetImgName: 'Planet3',
    planetItem: 'waterGrass',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed * 0.85,
    maxCatJump: 200,
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
  //17
  {
    themeName,
    planetSize: 700,
    planetImgName: 'Planet1',
    planetItem: 'redFlower',
    scoreToClear: baseClearScore,
    maxCatSpeed: baseCatSpeed,
    maxCatJump: 800,
    catBornInterval: baseCatInterval,
    satellaites: [
      {
        size: 40,
        imgName: 'Planet2',
        orbitSize: 850,
        orbitDuration: -18,
        initialAngle: 30
      },
      {
        size: 80,
        imgName: 'Planet5',
        orbitSize: 0,
        orbitDuration: 14,
        initialAngle: 30
      }
    ]
  },
  //18
  {
    themeName,
    planetSize: 1000,
    planetImgName: 'Planet8',
    planetItem: 'waterGrass',
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
        orbitSize: 660,
        orbitDuration: 13,
        initialAngle: 30
      },
      {
        size: 20,
        imgName: 'Planet8',
        orbitSize: 720,
        orbitDuration: 14,
        initialAngle: 30
      }
    ]
  },
  //19
  {
    themeName,
    planetSize: 600,
    planetImgName: 'Planet9',
    planetItem: 'waterGrass',
    scoreToClear: baseClearScore + 15,
    maxCatSpeed: baseCatSpeed * 1.3,
    maxCatJump: 400,
    catBornInterval: baseCatInterval * 0.5,
    satellaites: [
      {
        size: 120,
        imgName: 'Planet5',
        orbitSize: 200,
        orbitDuration: 11,
        initialAngle: 30
      }
    ]
  }
]
