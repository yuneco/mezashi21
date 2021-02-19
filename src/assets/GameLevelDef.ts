import { GameLevel } from './GameLevel'

export const levels: GameLevel[] = [
  // Lv1
  {
    themeName: 'sky',
    planetSize: 500,
    planetImgName: 'Planet1',
    planetItem: 'redFlower',
    scoreToClear: 5,
    maxCatSpeed: 0.2,
    maxCatJump: 0,
    catBornInterval: 3,
    satellaites: []
  },
  {
    themeName: 'sky',
    planetSize: 800,
    planetImgName: 'Planet3',
    planetItem: 'redFlower',
    scoreToClear: 5,
    maxCatSpeed: 0.25,
    maxCatJump: 20,
    catBornInterval: 3,
    satellaites: []
  },
  {
    themeName: 'sky',
    planetSize: 1000,
    planetImgName: 'Planet6',
    scoreToClear: 5,
    maxCatSpeed: 0.28,
    maxCatJump: 100,
    catBornInterval: 2.8,
    satellaites: [
      {
        size: 60,
        imgName: 'Planet3',
        orbitSize: 1500,
        orbitDuration: -12,
        initialAngle: 30
      }
    ]
  }
]
