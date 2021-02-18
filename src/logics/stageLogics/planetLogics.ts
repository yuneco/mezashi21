import { PlanetItemName } from '@/assets/GameLevel'
import { Planet } from '@/sprites/Planet'
import { GameStage } from '../GameStage'
import { setOnPlanet } from './setOnPlanet'

const removeCurrent = (planet: Planet) => {
  if (planet.parent) {
    planet.parent.removeChild(planet)
  }
}

export const changePlanet = async (
  stage: GameStage,
  imgName: string,
  size: number,
  planetItem?: PlanetItemName
) => {
  const planet = new Planet(imgName, size, planetItem)
  await planet.load()
  removeCurrent(stage.planet)
  stage.planet = planet
  stage.app.cameraLayer.addChild(planet)
  setOnPlanet(planet, true, stage.tama)
  setOnPlanet(planet, false, ...stage.sats)
}
