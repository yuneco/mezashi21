import { GameLevel } from './GameLevel'

export const levels: GameLevel[] = [
  {
    themeName: 'night',
    planetSize: 500,
    planetImgName: 'Planet6',
    planetItem: undefined,
    scoreToClear: 5,
    maxCatSpeed: 0.2,
    maxCatJump: 0,
    catBornInterval: 3,
    satellaites: [
      {
        size: 70,
        imgName: 'Planet2',
        orbitSize: 800,
        orbitDuration: -11,
        initialAngle: 30
      }
    ]
  },
  {
    themeName: 'sky',
    planetSize: 800,
    planetImgName: 'Planet3',
    planetItem: 'flower',
    scoreToClear: 5,
    maxCatSpeed: 0.4,
    maxCatJump: 500,
    catBornInterval: 3,
    satellaites: [
      {
        size: 120,
        imgName: 'Planet4',
        orbitSize: 1100,
        orbitDuration: -8,
        initialAngle: 30
      },
      {
        size: 30,
        imgName: 'Planet5',
        orbitSize: 450,
        orbitDuration: 10,
        initialAngle: 30
      }
    ]
  },
  {
    themeName: 'sky',
    planetSize: 1000,
    planetImgName: 'Planet6',
    scoreToClear: 5,
    maxCatSpeed: 0.6,
    maxCatJump: 2000,
    catBornInterval: 3,
    satellaites: [
      {
        size: 20,
        imgName: 'Planet7',
        orbitSize: 400,
        orbitDuration: -8,
        initialAngle: 30
      },
      {
        size: 30,
        imgName: 'Planet8',
        orbitSize: 600,
        orbitDuration: 10,
        initialAngle: 30
      },
      {
        size: 60,
        imgName: 'Planet1',
        orbitSize: 1600,
        orbitDuration: -12,
        initialAngle: 30
      }
    ]
  }
]
