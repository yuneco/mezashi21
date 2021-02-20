<template>
  <div class="GameStageRoot">
    <div class="debug">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, computed } from 'vue'
import { GameStage as GameStageClass } from '@/logics/GameStage'
import { useStore } from 'vuex'
import { State as StoreState } from '@/store'
import playSound from '@/logics/playSound'

export default defineComponent({
  name: 'GameStage',
  setup() {
    const store = useStore<StoreState>()
    const debug = reactive({
      level: computed(() => store.state.game.level),
      score: computed(() => store.state.game.score),
      playState: computed(() => store.state.game.play),
      startLevel: 15
    })

    let game: GameStageClass | undefined = undefined
    const canvas = ref<HTMLCanvasElement>()

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
      store.dispatch('newGame', { level: debug.startLevel || 0 })
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

    onMounted(initGame)
    return {
      debug,
      canvas,
      newGame,
      prevLevel,
      nextLevel,
      balletCountStr
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
    box-sizing: border-box;
    border: 1px solid gray;
    margin: auto;
  }
  .debug {
    position: absolute;
  }
}
</style>
