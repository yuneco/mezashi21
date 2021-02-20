import { removeFrom } from '@/utils/ArrayUtil'
import { Cat } from '@/sprites/Cat'
import { GameStage } from '../GameStage'
import { setOnPlanet } from './setOnPlanet'
import store from '@/store'
import { levels, unknownLevel } from '@/assets/GameLevelDef'
import { randomBetween } from '@/utils/MathUtil'

export const addCat = async (stage: GameStage) => {
  const cat = new Cat()
  await cat.load()

  const levelNo = store.state.game.level
  const level = levels[levelNo] ?? unknownLevel

  const catSpeed = level.maxCatSpeed * randomBetween(0.6, 1)
  const shouldJump = level.maxCatJump > 0 && Math.random() > 0.5
  const jumpHeight = shouldJump ? level.maxCatJump * randomBetween(0.4, 1) : 0

  stage.cats.push(cat)
  const isDirRight = Math.random() > 0.5
  cat.direction = isDirRight ? 'right' : 'left'
  cat.speed = catSpeed
  cat.jumpHeight = jumpHeight
  cat.angle = stage.tama.angle + randomBetween(90, 130) * (isDirRight ? 1 : -1)
  stage.app.cameraLayer.addChild(cat)
  setOnPlanet(stage.planet, true, cat)
}

export const removeCat = async (stage: GameStage, cat: Cat, withMotion = true) => {
  removeFrom(stage.cats, cat)
  withMotion && (await cat.overMotion())
  cat.parent.removeChild(cat)
}

export const clearCats = (stage: GameStage, withMotion = false) => {
  ;[...stage.cats].forEach(cat => removeCat(stage, cat, withMotion))
}
