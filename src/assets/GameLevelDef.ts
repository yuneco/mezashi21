import { GameLevel } from './GameLevel'

export const levels: GameLevel[] = [
  {
    planetSize: 500,
    scoreToClear: 5,
    maxCatSpeed: 0.2,
    maxCatJump: 0,
    catBornInterval: 3,
    satellaites: [
      {
        size: 70,
        orbitSize: 800,
        orbitDuration: -11,
        initialAngle: 30
      }
    ]
  },
  {
    planetSize: 800,
    scoreToClear: 5,
    maxCatSpeed: 0.4,
    maxCatJump: 500,
    catBornInterval: 3,
    satellaites: [
      {
        size: 120,
        orbitSize: 1100,
        orbitDuration: -8,
        initialAngle: 30
      },
      {
        size: 30,
        orbitSize: 450,
        orbitDuration: 10,
        initialAngle: 30
      }
    ]
  },
  {
    planetSize: 1000,
    scoreToClear: 5,
    maxCatSpeed: 0.6,
    maxCatJump: 2000,
    catBornInterval: 3,
    satellaites: [
      {
        size: 20,
        orbitSize: 400,
        orbitDuration: -8,
        initialAngle: 30
      },
      {
        size: 30,
        orbitSize: 600,
        orbitDuration: 10,
        initialAngle: 30
      },
      {
        size: 60,
        orbitSize: 1600,
        orbitDuration: -12,
        initialAngle: 30
      }
    ]
  }
]
