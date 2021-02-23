import { levels } from '@/assets/GameLevelDef'
import { randomIntBetween } from '@/utils/MathUtil'
import { createStore } from 'vuex'

const maxLevel = levels.length - 1

type Direction = 'left' | 'right'
type PlayStatus = 'opening' | 'playing' | 'transition' | 'over'
type TamaJumpCount = 0 | 1 | 2 | 3
type BalletCount = 0 | 1 | 2 | 3 | 4 | 5 | 6

type SystemState = {
  initialTapped: boolean
}

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
  seq: number
  startLevel: number
  isRandomLevel: boolean
  play: PlayStatus
  level: number
  levelStage: number
  score: number
  scoreInLevel: number
  balletCount: BalletCount
  isReloading: boolean
}

type AppColor = {
  border: number
}

export type State = {
  system: SystemState
  stageSetting: StageSetting
  tama: TamaState
  game: GameState
  appcolor: AppColor
}

export default createStore<State>({
  state: {
    system: {
      initialTapped: false
    },
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
      seq: 0,
      startLevel: 0,
      isRandomLevel: false,
      play: 'opening',
      level: -1,
      levelStage: -1,
      score: 0,
      scoreInLevel: 0,
      balletCount: 6,
      isReloading: false
    },
    appcolor: {
      border: 0x2f4753
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
    setGameScore(state, payload: { score: number; scoreInLevel: number }) {
      state.game.score = payload.score
      state.game.scoreInLevel = payload.scoreInLevel
    },
    setGameLevel(state, payload: { level: number; stageLevel?: number }) {
      state.game.level = payload.level
      state.game.scoreInLevel = 0
      state.game.levelStage = payload.stageLevel ?? payload.level
    },
    setGameSeq(state, payload: { seq: number }) {
      state.game.seq = payload.seq
    },
    setBallet(state, payload: { balletCount: BalletCount }) {
      state.game.balletCount = payload.balletCount
      state.game.isReloading = payload.balletCount === 0
    },
    setAppColor(state, payload: Partial<AppColor>) {
      Object.entries(payload).forEach(ent => {
        const [key, val] = ent
        if (state.appcolor[key as keyof AppColor] && typeof val === 'number') {
          state.appcolor[key as keyof AppColor] = val
        }
      })
    },
    setInitialTap(state) {
      state.system.initialTapped = true
    },
    setGameStartLevel(state, payload: { level: number }) {
      state.game.startLevel = payload.level
    },
    setGameIsRandomLevel(state, payload: { isRandom: boolean }) {
      state.game.isRandomLevel = payload.isRandom
    }
  },
  actions: {
    gameOver(ctx) {
      ctx.commit('setGamePlayStatus', { playStatus: 'over' })
    },
    gameTop(ctx) {
      ctx.commit('setGamePlayStatus', { playStatus: 'opening' })
    },
    newGame(ctx) {
      ctx.commit('setGameSeq', { seq: ctx.state.game.seq + 1 })
      ctx.commit('setGamePlayStatus', { playStatus: 'playing' })
      const isRandom = ctx.state.game.isRandomLevel
      const stageLevel = isRandom ? randomIntBetween(0, maxLevel) : ctx.state.game.startLevel
      ctx.commit('setGameLevel', { level: ctx.state.game.startLevel, stageLevel })
      ctx.commit('setTamaJumpCount', { jumpCount: 0 })
      ctx.commit('setTamaDirection', { dir: 'right' })
      ctx.commit('setGameScore', {
        score: 0,
        scoreInLevel: 0
      })
      ctx.commit('setBallet', { balletCount: 6 })
    },
    tamaJump(ctx) {
      if (ctx.state.game.play !== 'playing') {
        return
      }
      const MAX_JUMP_COUNT = 3
      if (ctx.state.tama.jumpCount >= MAX_JUMP_COUNT) {
        return
      }
      ctx.commit('setTamaJumpCount', { jumpCount: ctx.state.tama.jumpCount + 1 })
    },
    tamaJumpEnd(ctx) {
      ctx.commit('setTamaJumpCount', { jumpCount: 0 })
    },
    gameIncrementScore(ctx) {
      ctx.commit('setGameScore', {
        score: ctx.state.game.score + 1,
        scoreInLevel: ctx.state.game.scoreInLevel + 1
      })
    },
    gameLevelUp(ctx) {
      ctx.commit('setGamePlayStatus', { playStatus: 'transition' })
      const level = ctx.state.game.level + 1
      const isRandom = ctx.state.game.isRandomLevel || level > maxLevel
      const stageLevel = isRandom ? randomIntBetween(0, maxLevel) : level
      ctx.commit('setGameLevel', { level, stageLevel })
      ctx.commit('setTamaJumpCount', { jumpCount: 0 })
    },
    gameLevelChange(ctx, payload: { level: number }) {
      ctx.commit('setGamePlayStatus', { playStatus: 'transition' })
      ctx.commit('setGameLevel', { level: payload.level })
      ctx.commit('setTamaJumpCount', { jumpCount: 0 })
    },
    gameLevelTransitionEnd(ctx) {
      ctx.commit('setGamePlayStatus', { playStatus: 'playing' })
    },
    gameFireBallet(ctx) {
      ctx.commit('setBallet', { balletCount: ctx.state.game.balletCount - 1 })
    },
    gameReloadBallet(ctx) {
      ctx.commit('setBallet', { balletCount: 6 })
    }
  },
  modules: {}
})
