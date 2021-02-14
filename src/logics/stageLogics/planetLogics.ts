import { Planet } from '@/sprites/Planet'
import { GameStage } from '../GameStage'
import { setOnPlanet } from './setOnPlanet'

const removeCurrent = (planet: Planet) => {
  if (planet.parent) {
    planet.parent.removeChild(planet)
  }
}

export const changePlanet = async (stage: GameStage, size: number) => {
  const planet = new Planet(size)
  await planet.load()
  removeCurrent(stage.planet)
  stage.planet = planet
  stage.app.cameraLayer.addChild(planet)
  setOnPlanet(planet, true, stage.tama)
  setOnPlanet(planet, false, ...stage.sats)
}
