import { GameStage } from '../GameStage'
import { setOnPlanet } from './setOnPlanet'
import { SatelliteDef } from '@/assets/LevelDef'
import { Satellite } from '@/sprites/Satellite'
import { removeFrom } from '@/core/ArrayUtil'

export const addSatellite = async (stage: GameStage, def: SatelliteDef) => {
  const sat = new Satellite(
    def.size,
    def.orbitSize,
    Math.abs(def.orbitDuration),
    def.orbitDuration > 0
  )
  await sat.load()
  stage.sats.push(sat)
  stage.app.cameraLayer.addChild(sat)
  setOnPlanet(stage.planet, false, sat)
}

export const removeSatellite = (stage: GameStage, sat: Satellite) => {
  sat.parent.removeChild(sat)
  removeFrom(stage.sats, sat)
}

export const clearSatellites = (stage: GameStage) => {
  ;[...stage.sats].forEach(sat => removeSatellite(stage, sat))
}
