import { GameLevel } from './GameLevel'

export const levels: GameLevel[] = [
  {
    planetSize: 500,
    scoreToClear: 5,
    maxCatSpeed: 0.3,
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
    maxCatSpeed: 0.3,
    maxCatJump: 0,
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
        orbitSize: 500,
        orbitDuration: 10,
        initialAngle: 30
      }
    ]
  }
]
