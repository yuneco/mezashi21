import { removeFrom } from '@/core/ArrayUtil'
import { Cat } from '@/sprites/Cat'
import { GameStage } from '../GameStage'
import { setOnPlanet } from './setOnPlanet'

export const addCat = async (stage: GameStage, speed: number) => {
  const cat = new Cat()
  await cat.load()
  stage.cats.push(cat)
  const isDirRight = Math.random() > 0.5
  cat.direction = isDirRight ? 'right' : 'left'
  cat.speed = speed
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
