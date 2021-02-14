import { Planet } from '@/sprites/Planet'

export const setOnPlanet = (planet: Planet, isOnGround: boolean, ...charas: PIXI.Container[]) => {
  charas.forEach(chara => {
    chara.x = planet.x
    chara.y = planet.y
    if (isOnGround) {
      chara.pivot.y = planet.size / 2
    }
  })
}
