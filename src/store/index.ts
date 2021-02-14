import { createStore } from 'vuex'

type Direction = 'left' | 'right'
type PlayStatus = 'playing' | 'transition' | 'over'
type TamaJumpCount = 0 | 1 | 2

type StageSetting = {
  width: number
  height: number
  vw: number
  vh: number
  scale: number
}

type TamaState = {
  dir: Direction
  jumpCount: TamaJumpCount
}

type GameState = {
  play: PlayStatus
  level: number
  score: number
}

export type State = {
  stageSetting: StageSetting
  tama: TamaState
  game: GameState
}

export default createStore<State>({
  state: {
    stageSetting: {
      width: 0,
      height: 0,
      vw: 0,
      vh: 0,
      scale: 1
    },
    tama: {
      dir: 'right',
      jumpCount: 0
    },
    game: {
      play: 'playing',
      level: 1,
      score: 0
    }
  },
  mutations: {
    setStageSetting(
      state,
      payload: { width: number; height: number; scale: number; vw: number; vh: number }
    ) {
      state.stageSetting.width = payload.width
      state.stageSetting.height = payload.height
      state.stageSetting.scale = payload.scale
      state.stageSetting.vw = payload.vw
      state.stageSetting.vh = payload.vh
    },
    setTamaDirection(state, payload: { dir: 'left' | 'right' }) {
      state.tama.dir = payload.dir
    },
    setGamePlayStatus(state, payload: { playStatus: PlayStatus }) {
      state.game.play = payload.playStatus
    },
    setTamaJumpCount(state, payload: { jumpCount: TamaJumpCount }) {
      state.tama.jumpCount = payload.jumpCount
    },
    setGameScore(state, payload: { score: number }) {
      state.game.score = payload.score
    }
  },
  actions: {
    gameOver(ctx) {
      ctx.commit('setGamePlayStatus', { playStatus: 'over' })
    },
    newGame(ctx) {
      ctx.commit('setGamePlayStatus', { playStatus: 'playing' })
      ctx.commit('setGameScore', { score: 0 })
    },
    tamaJump(ctx) {
      if (ctx.state.game.play !== 'playing') {
        return
      }
      const MAX_JUMP_COUNT = 2
      if (ctx.state.tama.jumpCount >= MAX_JUMP_COUNT) {
        return
      }
      ctx.commit('setTamaJumpCount', { jumpCount: ctx.state.tama.jumpCount + 1 })
    },
    tamaJumpEnd(ctx) {
      ctx.commit('setTamaJumpCount', { jumpCount: 0 })
    },
    gameIncrementScore(ctx) {
      ctx.commit('setGameScore', { score: ctx.state.game.score + 1 })
    }
  },
  modules: {}
})
