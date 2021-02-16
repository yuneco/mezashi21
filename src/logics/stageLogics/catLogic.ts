import { removeFrom } from '@/core/ArrayUtil'
import { Cat } from '@/sprites/Cat'
import { GameStage } from '../GameStage'
import { setOnPlanet } from './setOnPlanet'
import store from '@/store'
import { levels } from '@/assets/GameLevelDef'

const randomBased = (base: number, lowerTimes: number, upperTimes: number): number => {
  return base * (lowerTimes + (upperTimes - lowerTimes) * Math.random())
}

export const addCat = async (stage: GameStage) => {
  const cat = new Cat()
  await cat.load()

  const levelNo = store.state.game.level
  const level = levels[levelNo] ?? levels[0]

  const catSpeed = randomBased(level.maxCatSpeed, 0.5, 1)
  const jumpHeight =
    level.maxCatJump > 0 && Math.random() > 0.5 ? randomBased(level.maxCatJump, 0.5, 1) : 0

  stage.cats.push(cat)
  const isDirRight = Math.random() > 0.5
  cat.direction = isDirRight ? 'right' : 'left'
  cat.speed = catSpeed
  cat.jumpHeight = jumpHeight
  cat.angle = stage.tama.angle + 120 * (isDirRight ? 1 : -1)
  stage.app.cameraLayer.addChild(cat)
  setOnPlanet(stage.planet, true, cat)
}

export const removeCat = async (stage: GameStage, cat: Cat, withMotion = true) => {
  removeFrom(stage.cats, cat)
  withMotion && (await cat.overMotion())
  cat.parent.removeChild(cat)
}

export const clearCats = (stage: GameStage) => {
  ;[...stage.cats].forEach(cat => removeCat(stage, cat))
}
