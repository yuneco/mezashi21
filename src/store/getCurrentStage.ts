import { levels } from '@/assets/GameLevelDef'
import store from '.'

export const getCurrentStage = () => {
  const levelDef = levels[store.state.game.levelStage]
  if (!levelDef) {
    console.warn('Invalid stage level state', store.state.game.levelStage)
    return levels[0]
  }
  return levelDef
}
