<template>
  <div class="GameStageRoot" :style="{ backgroundColor: state.mainColor }">
    <div class="debug" v-show="debug.visible">
      <div class="info">
        STATE: {{ debug.playState }} LEVEL: {{ debug.level }} SCORE: {{ debug.score }}
        <button @click="newGame">RESTART</button>
        <span class="ballets">{{ balletCountStr }}</span>
        <br />
        <button @click="prevLevel">◀︎ Prev Lv</button>
        <button @click="nextLevel">Next Lv ▶︎</button>
        START Lv: <input type="text" v-model.number="debug.startLevel" />
      </div>
    </div>
    <canvas ref="canvas"></canvas>
    <GameStageOverlay :clickable="state.overlayClickable" :blured="hasBgBlur">
      <CenterMsg />
      <TitleView
        v-show="state.titleVisible"
        @playNormal="playNormal"
        @playRandom="playRandom"
        @ranking="goToRanking"
      />
      <RankingView v-if="state.rankingVisible" @back="backToTitle" />
      <GameOverView
        v-show="state.overVisible"
        @back="backToTitle"
        @replayNormal="playNormal"
        @replayRandom="playRandom"
        @ranking="goToRanking"
      />
      <GameStatusView v-show="state.statusVisible" />
      <CatGage v-show="state.statusVisible" />
      <LoadGage v-show="state.preloadVisible" :progress="loadState.progress"></LoadGage>
    </GameStageOverlay>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, computed } from 'vue'
import { GameStage as GameStageClass } from '@/logics/GameStage'
import { useStore } from 'vuex'
import { State as StoreState } from '@/store'
import { num2cssColor } from '@/utils/colorUtil'
import playSound from '@/logics/playSound'
import CenterMsg from './CenterMsg.vue'
import GameStageOverlay from './GameStageOverlay.vue'
import TitleView from './TitleView.vue'
import GameOverView from './GameOverView.vue'
import GameStatusView from './GameStatusView.vue'
import CatGage from './CatGage.vue'
import LoadGage from './LoadGage.vue'
import RankingView from './RankingView.vue'
import { preloadAll } from '@/assets/preload'

type LocalState = {
  titleMode: 'home' | 'ranking'
}

export default defineComponent({
  name: 'GameStage',
  components: {
    GameStageOverlay,
    CenterMsg,
    TitleView,
    GameOverView,
    GameStatusView,
    CatGage,
    LoadGage,
    RankingView
  },
  setup() {
    const store = useStore<StoreState>()
    const debug = reactive({
      visible: false,
      level: computed(() => store.state.game.level),
      score: computed(() => store.state.game.score),
      playState: computed(() => store.state.game.play),
      startLevel: 15
    })
    const localState = reactive<LocalState>({
      titleMode: 'home'
    })
    const loadState = reactive({
      loading: true,
      progress: 0
    })
    const state = reactive({
      titleVisible: computed(
        () => store.state.game.play === 'opening' && localState.titleMode === 'home'
      ),
      rankingVisible: computed(
        () => store.state.game.play === 'opening' && localState.titleMode === 'ranking'
      ),
      overVisible: computed(() => store.state.game.play === 'over'),
      statusVisible: computed(() => store.state.game.play === 'playing'),
      preloadVisible: computed(() => store.state.game.play === 'opening' && loadState.loading),
      overlayClickable: computed(
        () => store.state.game.play === 'opening' || store.state.game.play === 'over'
      ),
      mainColor: computed(() => num2cssColor(store.state.appcolor.border))
    })
    const hasBgBlur = computed(() => state.rankingVisible)

    let game: GameStageClass | undefined = undefined
    const canvas = ref<HTMLCanvasElement>()

    const preload = async () => {
      await preloadAll(prog => {
        loadState.progress = prog
      })
      loadState.loading = false
    }
    preload()

    const initGame = async () => {
      playSound('btn')
      const canvasEl = canvas.value
      if (!canvasEl) {
        return
      }
      game = new GameStageClass(canvasEl)
      await game.load()
    }

    const newGame = async () => {
      store.commit('setInitialTap')
      playSound('btn')
      store.commit('setGameStartLevel', { level: debug.startLevel })
      store.dispatch('newGame')
    }

    const playNormal = () => {
      store.commit('setGameIsRandomLevel', { isRandom: false })
      store.dispatch('newGame')
    }

    const playRandom = () => {
      store.commit('setGameIsRandomLevel', { isRandom: true })
      store.dispatch('newGame')
    }

    const prevLevel = () => {
      store.dispatch('gameLevelChange', { level: Math.max(0, store.state.game.level - 1) })
    }
    const nextLevel = () => {
      store.dispatch('gameLevelChange', { level: store.state.game.level + 1 })
    }

    const balletCountStr = computed(() => {
      const count = store.state.game.balletCount
      return count
        ? Array(6)
            .fill('')
            .map((_, index) => (index < count ? '●' : '○'))
            .join('')
        : 'RELOADING...'
    })

    const backToTitle = () => {
      localState.titleMode = 'home'
      store.dispatch('gameTop')
    }

    const goToRanking = () => {
      localState.titleMode = 'ranking'
      store.dispatch('gameTop')
    }

    onMounted(initGame)
    return {
      state,
      localState,
      loadState,
      hasBgBlur,
      debug,
      canvas,
      newGame,
      prevLevel,
      nextLevel,
      balletCountStr,
      playNormal,
      playRandom,
      backToTitle,
      goToRanking
    }
  }
})
</script>

<style lang="scss" scoped>
.GameStageRoot {
  position: relative;
  display: flex;
  height: 100%;
  canvas {
    margin: auto;
  }
  .debug {
    position: absolute;
    z-index: 9999;
  }
}
</style>
