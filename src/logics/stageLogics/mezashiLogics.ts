import { Mezashi } from '@/sprites/Mezashi'
import { GameStage } from '../GameStage'
import { angleOfPoints } from '../../utils/coordUtils'
import { removeFrom } from '@/utils/ArrayUtil'
import store from '@/store'

export const addMezashi = async (stage: GameStage, aimTo: PIXI.Point) => {
  const mzs = new Mezashi()
  await mzs.load()

  const tamaPos = stage.tama.globalTamaPos
  const tamaDir = store.state.tama.dir
  tamaPos.x += tamaDir === 'left' ? -40 : 40
  tamaPos.y -= 60
  const from = stage.app.global2Camera(tamaPos)
  const angle = angleOfPoints(from, aimTo)
  stage.mezashis.push(mzs)
  stage.app.cameraLayer.addChild(mzs)
  await mzs.fire(from, angle, 1200)
  stage.app.cameraLayer.removeChild(mzs)
  removeFrom(stage.mezashis, mzs)
}

export const clearMezashis = (stage: GameStage) => {
  stage.mezashis.length = 0
}
