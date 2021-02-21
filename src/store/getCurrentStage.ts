import { levels } from '@/assets/GameLevelDef'
import store from '.'

export const getCurrentStage = () => {
  const stageNo = store.state.game.levelStage
  if (stageNo < 0) {
    return levels[0]
  }
  const levelDef = levels[stageNo]
  if (!levelDef) {
    console.warn('Invalid stage level state', stageNo)
    return levels[0]
  }
  return levelDef
}
